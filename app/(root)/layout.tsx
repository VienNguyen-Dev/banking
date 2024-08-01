import MobileNav from "@/components/MobileNav";
import RightSideBar from "@/components/RightSidebar";
import SideBar from "@/components/Sidebar";
import Image from "next/image";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");
  return (
    <main className=" flex h-screen font-inter w-full">
      <SideBar user={loggedIn} />
      <div className="flex flex-col size-full">
        <div className="root-layout">
          <Image src={"/icons/logo.svg"} width={30} height={30} alt="menu logo" />
          <div className="">
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
      <RightSideBar user={loggedIn} transactions={[]} banks={[{ currentBalance: 1234 }, { currentBalance: 1234 }]} />
    </main>
  );
}
