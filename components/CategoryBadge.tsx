import React from "react";
import { Progress } from "./ui/progress";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return (
    <div className="category-badge">
      <h1>{category}</h1>
      <Progress value={category.count} />
    </div>
  );
};

export default CategoryBadge;
