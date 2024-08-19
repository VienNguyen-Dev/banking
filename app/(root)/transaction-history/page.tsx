import BankDropdown from "@/components/BankDropdown";
import HeaderBox from "@/components/HeaderBox";
import Pagination from "@/components/Pagination";
import TransactionsTable from "@/components/TransactionsTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { formatAmount } from "@/lib/utils";
import React from "react";

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts) return;
  const accountData = accounts?.data;
  const appwriteItemId = (id as string) || accountData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });

  const rowPerPage = 10;
  const totalPages = Math.ceil(account.allTransactions.length / rowPerPage);
  const indexOfLastTransaction = currentPage * rowPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowPerPage;
  const currentTransaction = account.allTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox type="title" title="Transactions History" subtext="Gain Insights and Track Your Transactions Over Time" />
        <BankDropdown accounts={accountData} />
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
          <TransactionsTable transactions={currentTransaction} />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination page={currentPage} totalPages={totalPages} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
