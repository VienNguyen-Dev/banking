"use client";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = (user: MobileNavProps) => {
  const path = usePathname();
  return (
    <div className=" w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image src={"/icons/hamburger.svg"} alt="hamburger" width={30} height={30} className=" cursor-pointer" />
        </SheetTrigger>
        <SheetContent side={"left"} className=" border-none bg-white">
          <Link href={"/"} className="flex  items-center cursor-pointer gap-1">
            <Image src={"/icons/logo.svg"} alt="Horizon logo" width={34} height={34} />
            <h1 className=" text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
          </Link>
          <div className="mobile-sheet">
            <SheetClose asChild>
              <nav className=" flex h-full flex-col pt-16 text-white ">
                {sidebarLinks.map((link) => {
                  const isActive = path === link.route || path.startsWith(`${link.route}/`);
                  return (
                    <SheetClose key={link.label} asChild>
                      <Link
                        href={link.route}
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": isActive,
                        })}
                      >
                        <Image src={link.imgURL} alt={link.label} width={24} height={24} className={cn({ " brightness-[3] invert-0": isActive })} />

                        <p className={cn("text-16 font-semibold text-black-2", { "text-white": isActive })}> {link.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
                USER
              </nav>
            </SheetClose>
          </div>
          FOOTER
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
