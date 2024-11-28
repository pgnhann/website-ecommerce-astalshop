import React, { useState, useEffect } from "react";
import Breadcrumbs from "../components/pageprops/breadcrumbs";
import Pagination from "../components/pageprops/shoppage/pagination";
import ProductBanner from "../components/pageprops/shoppage/probanner";
import ShopSideNav from "../components/pageprops/shoppage/shopsidenav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [items, setItems] = useState([]); 

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  const fetchProducts = async (sortCriteria) => {
    let url = "http://localhost:5000/products/all-products"; 
    if (sortCriteria === "new") {
      url = "http://localhost:5000/products/new-brands";
    } else if (sortCriteria === "best") {
      url = "http://localhost:5000/products/best-sellers";
    } else if (sortCriteria === "spe") {
      url = "http://localhost:5000/products/spe-offers";
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setItems(data); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts("all"); 
  }, []);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav setItems={setItems}/>
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} onSortChange={fetchProducts} />
          <Pagination itemsPerPage={itemsPerPage} items={items}  />
        </div>
      </div>
    </div>
  );
};

export default Shop;