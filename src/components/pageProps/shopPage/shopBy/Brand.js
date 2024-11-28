import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./navtitle";

const Brand = ({ setItems }) => { 
  const [showBrands, setShowBrands] = useState(true);
  const brands = [
    { _id: 1, title: "La Roche-Posay" },
    { _id: 2, title: "L'Oreal" },
    { _id: 3, title: "Cocoon" },
    { _id: 4, title: "SVR" },
    { _id: 5, title: "Skin1004" },
  ];

  const handleBrandClick = async (brand) => {
    try {
      const response = await fetch(`http://localhost:5000/products/shopside?brand=${brand}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  return (
    <div>
      <div
        onClick={() => setShowBrands(!showBrands)}
        className="cursor-pointer"
      >
        <NavTitle title="Shop by Brand" icons={true} />
      </div>
      {showBrands && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {brands.map((item) => (
              <li
                key={item._id}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
                onClick={() => handleBrandClick(item.title)} 
              >
                {item.title}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Brand;