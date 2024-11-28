import React from "react";
import NavTitle from "./navtitle";

const Price = ({ setItems }) => { 
  const priceList = [
    {
      _id: 1,
      priceOne: 0,
      priceTwo: 5,
    },
    {
      _id: 2,
      priceOne: 5,
      priceTwo: 10,
    },
    {
      _id: 3,
      priceOne: 10,
      priceTwo: 15,
    },
    {
      _id: 4,
      priceOne: 15,
      priceTwo: 20,
    },
    {
      _id: 5,
      priceOne: 20,
      priceTwo: 30,
    },
  ];

  const handlePriceClick = async (minPrice, maxPrice) => {
    try {
      const response = await fetch(`http://localhost:5000/products/shopside?priceRange=${minPrice}-${maxPrice}`);
      const data = await response.json();
      console.log("Filtered Products:", data);
      console.log(`priceRange=${minPrice}-${maxPrice}`);
      setItems(data); 
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  return (
    <div className="cursor-pointer">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {priceList.map((item) => (
            <li
              key={item._id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
              onClick={() => handlePriceClick(item.priceOne, item.priceTwo)} 
            >
            {item.priceOne === 0 ? "$0" : `$${item.priceOne}`} - {`$${item.priceTwo}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;