import { formatAmount } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const BankCard = ({ account, userName, showBalance }: CreditCardProps) => {
  return (
    <div className=" flex flex-col">
      <Link href={"/"} className="bank-card">
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 font-semibold text-white">{account.name || userName}</h1>
            <p className=" font-ibm-plex-serif font-black text-white">{formatAmount(account.currentBalance)}</p>
          </div>
          <article className="flex flex-col gal-2">
            <div className="flex justify-between items-center">
              <h1 className=" font-semibold text-12 text-white">{userName}</h1>
              <p className=" text-white">&#9679;&#9679; / &#9679;&#9679;</p>
            </div>
            <p className=" text-white font-semibold tracking-[1.1px] text-14">
              &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; <span>1234</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image src={"/icons/Paypass.svg"} width={20} height={20} alt="payment" />
          <Image src={"/icons/mastercard.svg"} width={20} height={20} alt="mastercard" />
        </div>
        <Image src={"/icons/lines.png"} alt="line" width={360} height={190} className=" absolute top-0 left-0" />
      </Link>
    </div>
  );
};

export default BankCard;
