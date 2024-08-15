"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const Pagination = ({ page, totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleNavigation = async (type: "prev" | "next") => {
    const pageNumber = type === "prev" ? page - 1 : page + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageNumber.toString(),
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="flex justify-between gap-3">
      <Button variant={"ghost"} size={"lg"} onClick={() => handleNavigation("prev")} disabled={Number(page) <= 1} className="flex gap-4 p-0 hover:bg-transparent">
        <Image src={"/icons/arrow-left.svg"} width={24} height={24} alt="arrow-right" />
        Prev
      </Button>
      <p className="text-14 flex items-center px-2">
        {page} / {totalPages}
      </p>
      <Button variant={"ghost"} size={"lg"} onClick={() => handleNavigation("next")} disabled={Number(page) >= Number(totalPages)} className="flex gap-4 p-0 hover:bg-transparent">
        <Image src={"/icons/arrow-left.svg"} width={24} height={24} alt="arrow-left" className=" -scale-x-100" />
        Next
      </Button>
    </div>
  );
};

export default Pagination;
