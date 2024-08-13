import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import TransactionsTable from "@/components/TransactionsTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { formatAmount } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts) return;
  const accountData = accounts?.data;
  const appwriteItemId = (id as string) || accountData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  console.log(account?.data);
  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox type="title" title="Transactions History" subtext="Gain Insights and Track Your Transactions Over Time" />
      </div>
      <div className=" space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-4">
            <h2 className=" text-18 font-bold text-white">{account?.data.name}</h2>
            <p className="text-14 text-blue-25">{account?.data.officialName}</p>
            <p className=" text-white font-semibold tracking-[1.8px] text-14">
              &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; <span>{account?.data.mask}</span>
            </p>
          </div>
          <div>
            <div className="transactions-account-balance">
              <p className=" font-medium text-[14px] ">Current Balance</p>
              <p className=" text-[24px] font-bold text-center">{formatAmount(account?.data.currentBalance)}</p>
            </div>
          </div>
        </div>
        <section className=" flex flex-col gap-6">
          <TransactionsTable transactions={account?.allTransactions} />
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
