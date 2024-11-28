import React from "react";
import NavTitle from "./navtitle";

const Category = ({ setItems }) => {
  const cates = [
    { _id: 1, title: "Facial Cleanser" },
    { _id: 2, title: "Makeup Remover" },
    { _id: 3, title: "Sunscreen" },
    { _id: 4, title: "Toner" },
    { _id: 5, title: "Serum" },
    { _id: 6, title: "Moisturizer" },
  ];

  const handleCategoryClick = async (category) => {
    try {
      const response = await fetch(`http://localhost:5000/products/shopside?category=${category}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={true} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {cates.map(({ _id, title }) => (
            <li
              key={_id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
              onClick={() => handleCategoryClick(title)}
            >
              {title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
