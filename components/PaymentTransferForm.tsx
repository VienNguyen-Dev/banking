"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import BankDropdown from "./BankDropdown";
import { decryptId } from "@/lib/utils";
import { getBank, getBankByAccountId } from "@/lib/actions/user.action";
import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});
const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });
  //. Tao 1 transaction: thong tin nguoi gui, thong tin nguoi nhan
  //Truoc khi tao mot transaction can phai tao transfer(chuyen khoan): duong dan nguon, dich va luong giao dich la bao nhieu?
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      //Cần phải lấy được thông tin của tài khoản người gửi và người nhận => lấy bank
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({ accountId: receiverAccountId });
      const senderBank = await getBank({ documentId: data.senderBank });

      //Create TRansfer Params
      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };

      //Create transfer
      const transfer = await createTransfer(transferParams);
      if (transfer) {
        const transactionData = {
          email: data.email,
          name: data.name,
          amount: data.amount,
          senderBankId: senderBank.$id,
          receiverBankId: receiverBank.$id,
          senderId: senderBank.userId.$id,
          receiverId: receiverBank.userId.$id,
        };
        //Create transaction here
        const newTransaction = await createTransaction(transactionData);
        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">Select Source Bank</FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">Select the bank account you want to transfer funds from</FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full" />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">Transfer Note (Optional)</FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">Please provide any additional information or instructions related to the transfer</FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea placeholder="Write a short note here" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">Bank account details</h2>
          <p className="text-16 font-normal text-gray-600">Enter the bank account details of the recipient</p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Recipient&apos;s Email Address</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="ex: name@gmail.com" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sharableId"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Receiver&apos;s Plaid Sharable Id</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Enter the public account number" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Amount</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="ex: 5.00" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
