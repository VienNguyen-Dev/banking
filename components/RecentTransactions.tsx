import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankTabItem from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";

const RecentTransactions = ({ accounts = [], transactions = [], appwriteItemId, page = 1 }: RecentTransactionsProps) => {
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
              <TransactionsTable transactions={transactions} />
            </TabsContent>
          ))}
        </Tabs>
      </header>
    </section>
  );
};

export default RecentTransactions;
