"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideBar = (user: SiderbarProps) => {
  const path = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href={"/"} className="flex mb-12 items-center cursor-pointer gap-2">
          <Image src={"/icons/logo.svg"} alt="Horizon logo" width={34} height={34} className="size-[24px] max-xl:size-14" />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {sidebarLinks.map((link) => {
          const isActive = path === link.route || path.startsWith(`${link.route}/`);
          return (
            <Link
              key={link.label}
              href={link.route}
              className={cn("sidebar-link", {
                "bg-bank-gradient": isActive,
              })}
            >
              <div className=" relative size-6">
                <Image src={link.imgURL} alt={link.label} fill className={cn({ " brightness-[3] invert-0": isActive })} />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}> {link.label}</p>
            </Link>
          );
        })}
        USER
      </nav>
      FOOTER
    </section>
  );
};

export default SideBar;
