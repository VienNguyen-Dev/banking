"use client";
import { cn, formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const BankTabItem = ({ account, appwriteItemId }: BankTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = appwriteItemId === account.appwriteItemId;
  const hanldeBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div
      onClick={hanldeBankChange}
      className={cn("banktab-item", {
        " border-blue-600": isActive,
      })}
    >
      <p
        className={cn(" text-gray-500 line-clamp-1 text-16 font-medium flex-1", {
          "text-blue-600": isActive,
        })}
      >
        {account.name}
      </p>
    </div>
  );
};

export default BankTabItem;
