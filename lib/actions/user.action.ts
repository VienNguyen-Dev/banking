"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite.config";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
const { APPWRITE_DATABASE_ID: DATABASE_ID, APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID, APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID } = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();
    const userInfo = await database.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [Query.equal("userId", [userId])]);

    return parseStringify(userInfo.documents[0]);
  } catch (error) {
    console.log("Error while get user info", error);
  }
};
export async function signUp({ password, ...userData }: SignUpParams) {
  const { email, firstName, lastName } = userData;
  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();
    //Chekc exist user? Ý tưởng mà nó muốn thể hiện ở đây đó là cho phép viêc tạo tao khoan ban đầu sau đó sẽ liên kêt với tài khoản ngân hàng
    newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
    if (!newUserAccount) throw new Error("Error while create a new account");
    const dwollaCustomerUrl = await createDwollaCustomer({ ...userData, type: "personal" });
    if (!dwollaCustomerUrl) throw new Error("Error while create dwolla customer URL");
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    const newUser = await database.createDocument(DATABASE_ID!, USER_COLLECTION_ID!, ID.unique(), {
      ...userData,
      userId: newUserAccount.$id,
      dwollaCustomerUrl,
      dwollaCustomerId,
    });
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.log("Error while create new user", error);
  }
}

export async function signIn({ email, password }: signInProps) {
  try {
    //mutation / database /make fetch
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (error) {
    console.log("Error while you sign in your account", error);
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    const userInfo = await getUserInfo({ userId: user.$id });
    return parseStringify(userInfo);
  } catch (error) {
    return null;
  }
}
export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};
export const createBankAccount = async ({ userId, bankId, accountId, accessToken, fundingSourceUrl, sharableId }: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(DATABASE_ID!, BANK_COLLECTION_ID!, ID.unique(), {
      userId,
      bankId,
      accountId,
      accessToken,
      fundingSourceUrl,
      sharableId,
    });
    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const exChangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    //get account information from Plaid using accesToken
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];
    //Create a processor token for Dwolla using the access token adn account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };
    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;
    //read a funding source URL for the account using the dwolla customer ID processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    //If the fundingSource URL is not create => throw new Error
    if (!fundingSourceUrl) throw Error;
    //Creat a bank acccount using the user ID, account ID, access Token, funding source URL, and shareble ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    //revalidate the path to felect the changes
    revalidatePath("/");
    return parseStringify({ publicTokenExchange: "complete" });
  } catch (error) {
    console.log("An error occured while reating exchanging token: ", error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();
    const banks = await database.listDocuments(DATABASE_ID!, BANK_COLLECTION_ID!, [Query.equal("userId", [userId])]);
    return parseStringify(banks.documents);
  } catch (error) {
    console.log("Error while get banks", error);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(DATABASE_ID!, BANK_COLLECTION_ID!, [Query.equal("$id", [documentId])]);

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(DATABASE_ID!, BANK_COLLECTION_ID!, [Query.equal("accountId", [accountId])]);
    if (bank.total !== 1) return null;
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log("Erroe while get bank by account ID", error);
  }
};
