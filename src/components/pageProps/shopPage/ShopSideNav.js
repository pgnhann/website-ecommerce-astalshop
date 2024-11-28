import React from "react";
import Brand from "./shopby/brand";
import Category from "./shopby/category";
import Price from "./shopby/price";

const ShopSideNav = ({ setItems }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category setItems={setItems} />
      <Brand setItems={setItems} />
      <Price setItems={setItems} />
    </div>
  );
};

export default ShopSideNav;
