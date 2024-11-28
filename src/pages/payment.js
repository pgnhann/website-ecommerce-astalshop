import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../components/pageprops/breadcrumbs";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { resetCart } from "../redux/astalslice";

const Payment = () => {
  const products = useSelector((state) => state.astalReducer.products);

  const location = useLocation();
  const { shippingCharge: initialShippingCharge, totalAmt: initialTotalAmt} = location.state || {};
  const [shippingCharge, setShippingCharge] = useState(initialShippingCharge || 0);
  const [totalAmt, setTotalAmt] = useState(initialTotalAmt || 0);

  const dispatch = useDispatch();

  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    subtotal: 0,
    totalamount: 0,
    paymethod: "cod",
    shipcost: shippingCharge,
    note: "",
  });


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) throw new Error("No email found in localStorage");

        const response = await axios.post("http://localhost:5000/userinfo", { email });
        if (response.status === 200) {
          const user = response.data;
          setPaymentData((prev) => ({
            ...prev,
            name: user.fullname || "",
            email: user.email || "",
            phone: user.phone || "",
            address: `${user.address || ""}, ${user.state || ""}`, 
          }));
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = { 
        ...paymentData,
        subtotal: totalAmt.toFixed(2),
        totalamount: (totalAmt + shippingCharge).toFixed(2),
        shipcost: shippingCharge,
        products: products.map((item) => {
          const priceAfterDiscount = item.discount
            ? Number(item.price) * (1 - Number(item.discount) / 100)
            : item.price;
          return {
            namepro: item.name,
            price_ori: item.price,
            price_afvou: priceAfterDiscount.toFixed(2), 
            quantity: item.quantity,
          };
        }),
      };      

      const response = await axios.post("http://localhost:5000/placeorder", orderData);

      if (response.status === 201) {
        toastr.options = {
          closeButton: true,
          timeOut: 2000,
        };
        toastr.success(
          "Your order has been placed successfully! Please check your email to receive bill!",
          ""
        );
        
        dispatch(resetCart()); 
        setShippingCharge(0); 
        setTotalAmt(0); 

        setPaymentData({
          name: "",
          email: "",
          phone: "",
          address: "",
          subtotal: 0,
          totalamount: 0,
          paymethod: "cod",
          shipcost: 0,
          note: "",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toastr.error("Failed to place your order. Please try again later.", "Error");
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Payment Checkout" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
        {/* Left Column: User Information */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Billing Details</h2>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={paymentData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={paymentData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              value={paymentData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              name="address"
              value={paymentData.address}
              onChange={handleInputChange}
              placeholder="Shipping Address"
              required
              className="w-full p-3 border rounded-md"
            />
            <select
              name="paymethod"
              value={paymentData.paymethod}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="bank">Bank Transfer</option>
            </select>
            <textarea
              name="note"
              value={paymentData.note}
              onChange={handleInputChange}
              placeholder="Additional Notes (Optional)"
              className="w-full p-3 border rounded-md"
              rows="4"
            />
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="bg-primeColor text-white px-6 py-2 rounded-md"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Right Column: Cart Summary */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
          <div className="border-b pb-4">
            {products.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-2 border-b"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1 px-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">x {item.quantity}</p>
                </div>
                <span className="font-medium">
                  ${(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="flex justify-between items-center font-medium text-lg mb-2">
              Subtotal: <span>${(totalAmt).toFixed(2)}</span>
            </p>
            <p className="flex justify-between items-center font-medium text-lg mb-2">
              Shipping: <span>{shippingCharge}</span>
            </p>
            <p className="flex justify-between items-center font-bold text-xl">
              Total: <span>${(totalAmt + shippingCharge).toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
