import React from "react";

import CategoryBadge from "./CategoryBadge";
import { topCategoryStyles } from "@/constants";
import { cn, formatAmount } from "@/lib/utils";
import Image from "next/image";
import { Progress } from "./ui/progress";

const Category = ({ category }: CategoryProps) => {
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = topCategoryStyles[category.name as keyof typeof topCategoryStyles] || topCategoryStyles.default;
  return (
    <div className={cn("flex gap-[18px] rounded-xl p-4", bg)}>
      <figure className={cn("flex-center rounded-full size-10  ", circleBg)}>
        <Image src={icon} alt={category.name} width={20} height={20} />
      </figure>
      <div className="flex flex-col gap-2  flex-1">
        <div className="flex text-14 justify-between">
          <p className={cn(" font-medium", main)}>{category.name}</p>
          <p className={cn(" font-normal", count)}>${category.count} left</p>
        </div>
        <Progress className={cn("w-full h-2", progressBg)} indicatorClassName={cn("w-full h-2", indicator)} value={(category.count / category.totalCount) * 100} />
      </div>
    </div>
  );
};

export default Category;
