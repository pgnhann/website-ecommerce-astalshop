import React, { useEffect, useState } from 'react';

const ProductsOnSale = () => {
  const [productsOnSale, setProductsOnSale] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products/on-sale")
      .then(response => response.json())
      .then(data => setProductsOnSale(data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Products On Sale
      </h3>
      {productsOnSale.length > 0 ? (
        <div className="flex flex-col gap-2">
          {productsOnSale.map(product => (
            <div key={product.idpro} className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2">
              <img className="w-24" src={`/images/pros/${product.image}`} />
              <div className="flex flex-col gap-2 font-titleFont">
                <p className="text-base font-medium">{product.namepro}</p>
                <p className="text-sm font-semibold">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>There are currently no products on sale.</p> 
      )}
    </div>
  );
};

export default ProductsOnSale;
