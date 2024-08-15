"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankTabItem from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import Pagination from "./Pagination";
import { useSearchParams } from "next/navigation";

const RecentTransactions = ({ accounts = [], transactions = [], appwriteItemId, page = 1 }: RecentTransactionsProps) => {
  const searchParams = useSearchParams();

  // const currentPage = Number(page as string) || 1;
  const rowPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowPerPage);
  const indexOfLastTransaction = page * rowPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowPerPage;
  const currentTransaction = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  return (
    <section className="recent-transactions">
      <header className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="recent-transactions-label">Recent transactions</h1>
          <Link href={`/transaction-history/?id=${appwriteItemId}`} className="view-all-btn">
            View alls
          </Link>
        </div>
        <Tabs defaultValue={appwriteItemId} className="w-full">
          <TabsList className="recent-transactions-tablist">
            {accounts.map((account: Account) => (
              <TabsTrigger key={account.id} value={account.appwriteItemId}>
                <BankTabItem account={account} appwriteItemId={appwriteItemId} />
              </TabsTrigger>
            ))}
          </TabsList>
          {accounts.map((account: Account) => (
            <TabsContent key={account.id} value={account.appwriteItemId} className=" space-y-4">
              <BankInfo account={account} type="full" appwriteItemId={appwriteItemId} />
              <TransactionsTable transactions={currentTransaction} />

              <Pagination page={page} totalPages={totalPages} />
            </TabsContent>
          ))}
        </Tabs>
      </header>
    </section>
  );
};

export default RecentTransactions;
