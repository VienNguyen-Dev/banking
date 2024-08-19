"use client";
import React, { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { formatAmount, formUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const BankDropdown = ({ accounts, setValue, otherStyles }: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [valueSelected, setValueSelected] = useState(accounts[0]);

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.appwriteItemId === id)!;
    setValueSelected(account);
    const searchParamsUrl = new URLSearchParams(searchParams.toString());
    searchParamsUrl.set("id", id);
    searchParamsUrl.set("page", "1");
    const newUrl = formUrlQuery({
      params: searchParamsUrl.toString(),
      key: "id",
      value: id,
    });
    router.push(newUrl, { scroll: false });
    if (setValue) {
      setValue("senderBank", id);
    }
  };
  return (
    <Select defaultValue={valueSelected.id} onValueChange={(value) => handleBankChange(value)}>
      <SelectTrigger className={`w-full flex bg-white gap-3 md:w-[300px] ${otherStyles}`}>
        <div className="flex gap-4 items-center">
          <Image src={"/icons/credit-card.svg"} width={24} height={24} color="green" alt="credit-card" />
          <p className=" line-clamp-1 text-left">{valueSelected.name}</p>
        </div>
      </SelectTrigger>
      <SelectContent className={`w-full bg-white md:w-[300px] ${otherStyles}`} align="end">
        <SelectGroup>
          <SelectLabel className=" font-normal text-gray-500 py-2">Select a bank to display</SelectLabel>
          {accounts.map((a: Account) => (
            <>
              <SelectItem key={a.id} value={a.appwriteItemId} className=" cursor-pointer border-t border-gray-200">
                <div className="flex flex-col">
                  <p className=" font-medium text-14">{a.name}</p>
                  <p className="text-[#0179FE] text-16 font-medium">{formatAmount(a.currentBalance)}</p>
                </div>
              </SelectItem>
            </>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BankDropdown;
