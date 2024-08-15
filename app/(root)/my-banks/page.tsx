import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getBanks, getLoggedInUser } from "@/lib/actions/user.action";
import React from "react";

const MyBank = async () => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts) return;
  const accountData = accounts?.data;
  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox type="title" title="My Bank Accounts" subtext="Effortlessly Manage Your Banking Activities" />
        <div className=" space-y-2">
          <h2 className=" font-bold text-[16px]">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accountData.map((account: Account) => <BankCard key={account.id} showBalance={true} account={account} userName={`${loggedIn.firstName} ${loggedIn.lastName}`} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBank;
