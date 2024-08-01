import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen w-full justify-between flex">
      {children}
      <div className="auth-asset">
        <div>
          <Image src={"/icons/auth-image.svg"} width={500} height={500} alt="auth" />
        </div>
      </div>
    </main>
  );
}
