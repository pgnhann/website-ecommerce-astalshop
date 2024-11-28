import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../components/pageprops/breadcrumbs";
import { resetCart } from "../redux/astalslice";
import ItemCart from "./itemcart";
import toastr from "toastr";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.astalReducer.products);
  const [totalAmt, setTotalAmt] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");

  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const firstDiscountedItem = products.find(
    (item) => Number(item.discount) > 0
  );
  useEffect(() => {
    if (firstDiscountedItem) {
      setCoupon(firstDiscountedItem.discount);
    }
  }, [firstDiscountedItem]);
  
  useEffect(() => {
    const total = products.reduce((acc, item) => {
      const originalPrice = Number(item.price) * item.quantity;
      const discountedPrice =
        isCouponApplied && Number(item.discount) > 0
          ? originalPrice * (1 - Number(item.discount) / 100)
          : originalPrice;
      return acc + discountedPrice;
    }, 0);
    setTotalAmt(total);
  }, [products, isCouponApplied]);

  console.log(totalAmt);
  
  useEffect(() => {
    if (totalAmt <= 10) {
      setShippingCharge(1.2);
    } else if (totalAmt <= 20) {
      setShippingCharge(0.8);
    } else if (totalAmt <= 30) {
      setShippingCharge(0.4);
    } else if (totalAmt > 30) {
      setShippingCharge(0);
    }
  }, [totalAmt]);

  const navigate = useNavigate(); 
  const handleNavPayment = () => {
    const userInfo = localStorage.getItem("fullname");
    if (userInfo) {
      navigate("/paymentgateway", { state: { shippingCharge, totalAmt } });
    } else {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        timeOut: 1500,
        onHidden: function () {
          navigate("/signin"); 
        },
      };
      toastr.warning("You need to log in to proceed check out.");
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2 ml-12">Product Name</h2>
            <h2 className="ml-12">Price</h2>
            <h2 className="ml-12">Quantity</h2>
            <h2 className="ml-28">Sub Total</h2>
          </div>
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCart
                  key={item._id}
                  item={item}
                  isCouponApplied={isCouponApplied}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(resetCart())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset cart
          </button>

          <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
          <div className="flex items-center gap-4">
            <input
              className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
              type="text"
              value={`${coupon}%`}
              readOnly
            />
            <button
              onClick={() => {
                const hasDiscountedItems = products.some(
                  (item) => Number(item.discount) > 0
                );
      
                if (!hasDiscountedItems) {
                  toastr.error("No items are eligible for discount.");
                  return;
                }
      
                if (coupon && !isNaN(coupon)) {
                  setIsCouponApplied(true);
                  toastr.options = {
                    closeButton: true,
                    timeOut: 1000,
                  };
                  toastr.success("Voucher applied successfully!");
                } else {
                  toastr.error("Invalid voucher.");
                }
              }}
              className="w-40 h-10 bg-primeColor text-white hover:bg-black duration-300"
            >
              Apply Voucher
            </button>
          </div>
          </div>

          
          <div className="max-w-7xl gap-4 flex justify-end mt-4 ml-32">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold tracking-wide font-titleFont">
                      ${Number(totalAmt).toFixed(2)}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Shipping Charge
                  <span className="font-semibold tracking-wide font-titleFont">
                      ${shippingCharge}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Total
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    ${(Number(totalAmt) + Number(shippingCharge)).toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="flex justify-end">
                  <button 
                      onClick={handleNavPayment} 
                      className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300"
                  >
                      Proceed to Checkout
                  </button>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={'images/emptyCart.png'}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              books, electronics, videos, etc. and make it happy.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
