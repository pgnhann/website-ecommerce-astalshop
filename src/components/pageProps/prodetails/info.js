import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/astalslice";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-5 ml-12">
      <h2 className="text-4xl font-semibold">{productInfo.proName} {productInfo.namepro}</h2>
      <p className="text-xl font-semibold">${productInfo.price}</p>
      <p className="text-base text-gray-600 text-justify">{productInfo.des} {productInfo.descr}</p>
      <p className="font-medium text-lg">
        <span className="font-normal">Category:</span> {productInfo.cates} {productInfo.category}
      </p>
      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id,
              name: productInfo.proName,
              quantity: 1,
              des: productInfo.des,
              image: productInfo.img,
              badge: productInfo.badge,
              price: productInfo.price,
              cate: productInfo.cate,
              discount: productInfo.discount,
            })
          )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductInfo;
