"use server";

import { getBank, getBanks } from "./user.action";
import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";
import { CountryCode } from "plaid";
import { getTransactionByBankId } from "./transaction.actions";

//get multiple bank accounts
// //1. Take bank info from DB
//2. From bank info => take all accounts info in the Plaid => it include balance
//3. Take first account data
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    //get bankf from dtabasbe
    const banks = await getBanks({ userId });
    //travel banks and take infor account in the plaid
    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        const accountResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountResponse.data.accounts[0];
        //get intutation from the plaid
        const institution = await getInstitution({
          institutionId: accountResponse.data.item.institution_id!,
        });
        //take info account follow banks and acount in the pliad as user register
        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          institutionId: institution.institution_id,
          name: accountData.name as string,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId,
        };
        return account;
      })
    );
    const totalBanks = banks.length;
    const totalCurrentBalance = accounts.reduce((total, account) => (total = total + account.currentBalance), 0);
    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.log("Error while get account", error);
  }
};
//Write get a bank account to take transaction of ech bank account and account info
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    //get bank from databse
    const bank = await getBank({ documentId: appwriteItemId });
    //get account info from plaid
    const accountResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountResponse.data.accounts[0];
    //get tranfer transaction of bank account from appwrite (write yet) => each account have many transactions =. return các giao dich liên quan đến ngân hàng này
    const tranferTransactionData = await getTransactionByBankId({
      bankId: bank.$id,
    });
    //The transactionifo need take
    const tranferTransactions = tranferTransactionData.documents.map((tranferData: Transaction) => ({
      id: tranferData.$id,
      name: tranferData.name!,
      amount: tranferData.amount!,
      paymentChannel: tranferData.paymentChannel,
      category: tranferData.category,
      date: tranferData.date,
      type: tranferData.senderBankId === bank.$id ? "debit" : "credit",
    }));

    //get intutation from the plaid đảm bảo không bỏ sót giao dịch nào
    const institution = await getInstitution({
      institutionId: accountResponse.data.item.institution_id!,
    });
    //get transaction từ plaid
    const transactions = await getTransactions({
      accessToken: bank.accessToken,
    });
    //get account info
    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      institutionId: institution.institution_id!,
      name: accountData.name as string,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
      sharableId: bank.sharableId,
    };
    //gom hai ông nội này lại => sort the transactions by recent date
    const allTransactions = [...transactions, ...tranferTransactions].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return parseStringify({ data: account, allTransactions });
  } catch (error) {
    console.log("Error while get a bank account", error);
  }
};

export const getInstitution = async ({ institutionId }: getInstitutionProps) => {
  try {
    const institutionData = await plaidClient.institutionsGetById({ institution_id: institutionId, country_codes: ["US"] as CountryCode[] });
    const institution = institutionData.data.institution;
    return parseStringify(institution);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactions = async ({ accessToken }: getTransactionsProps) => {
  //1. xem cos còn transaction không để get tiếp
  //2. phải có một mảng để lưu trữ nó.
  //3. Lấy dữ liệu từ Plaid  theo access_token
  //4. Them những đối tượng cần lấy vào mảng trươc đó
  try {
    let hasMore = true;
    let transactions: any = [];
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });
      const data = response.data;
      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        amount: transaction.amount,
        pending: transaction.pending,
        date: transaction.date,
        type: transaction.payment_channel,
        category: transaction.category ? transaction.category[0] : "",
        image: transaction.logo_url,
      }));
      hasMore = data.has_more; // kiem tra co con du lieu nua khong?
    }

    return parseStringify(transactions);
  } catch (error) {
    console.log("Error while get transactions", error);
  }
};
