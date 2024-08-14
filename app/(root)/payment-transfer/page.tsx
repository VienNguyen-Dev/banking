import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.action";
import React from "react";

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts) return;
  const accountData = accounts?.data;

  return (
    <section className="payment-transfer">
      <HeaderBox type="title" title="Payment Transfer" subtext="Please provide any specific details or note related to the payment transfer" />
      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountData} />
      </section>
    </section>
  );
};

export default Transfer;
