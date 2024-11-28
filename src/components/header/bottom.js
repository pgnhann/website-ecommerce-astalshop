import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Flex from "../designlayouts/flex";
import { useSelector } from "react-redux";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const HeaderBottom = () => {
  const products = useSelector((state) => state.astalReducer.products);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const [fullname, setFullname] = useState(() => localStorage.getItem("fullname"));

  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get("status");
    const googleFullname = queryParams.get("fullname");

    if (status === "success" && googleFullname) {
      const decodedFullname = decodeURIComponent(googleFullname);
      localStorage.setItem("fullname", decodedFullname);
      setFullname(decodedFullname);
    }

    // Xóa tham số dư thừa trong URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/search?query=${query}`);
      const data = await response.json();
      setFilteredProducts(data);  

    } catch (error) {
      console.error('Fail to find product!', error);
    }
};

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:5000/logout', { 
            method: 'POST', 
            credentials: 'include' 
        });

        toastr.options = {
          closeButton: true,
          timeOut: 1200,
        };

        if (response.ok) {
          localStorage.clear();
          setFullname(null);
          toastr.success("Logout successfully!", "");
          setTimeout(() => {
            window.location.href = "/";
        }, 800);
        } else {
            toastr.error("Failed to logout. Please try again.", "Error");
        }
    } catch (error) {
        toastr.error("An error occurred during logout. Please try again.", "Error");
        console.error("Logout error:", error);
    }
};


  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-center lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">

          {/* Search */}
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl ml-32">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleInputChange}
              value={searchQuery}
              placeholder="Search your products here"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div
                className={`w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                
                {filteredProducts.map((item) => (
                  <div
                    onClick={() => {
                      // navigate(`/product/${item.idpro}`, { state: { item } });
                      const imagePath = `images/pros/${item.image}`;
                      navigate(`/product/${item.idpro}`, { state: { item, imagePath, searchQuery: true } }); // Thêm searchQuery vào state
                      setShowSearchBar(false); 
                      setSearchQuery("");     
                    }}
                    key={item.idpro}
                    className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                  >
                    <img className="w-24" src={`images/pros/${item.image}`} alt={item.namepro || "Product"} />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">{item.namepro}</p>
                      <p className="text-sm">
                        Price:{" "}
                        <span className="text-primeColor font-semibold">${item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User and Cart */}
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            {/* User */}
            <div onClick={() => setShowUser(!showUser)} className="flex">
              <span className="mt-1"> <FaUser /> </span>
              <span className="ml-2 mr-2"> {fullname} </span>
              <FaCaretDown />
            </div>
                {showUser && (
                  <motion.ul
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-8 left-0 z-50 bg-primeColor w-40 text-[#767676] h-auto p-4 pb-6"
                  >
                    {!fullname ? (
                      <>
                        <Link to="/signin">
                          <li className="text-gray-400 px-4 py-1 hover:text-white cursor-pointer">Sign In</li>
                        </Link>
                        <Link onClick={() => setShowUser(false)} to="/signup">
                          <li className="text-gray-400 px-4 py-1 hover:text-white cursor-pointer">Sign Up</li>
                        </Link>
                      </>
                    ) : (
                      <>
                       <Link to="/userprofile">
                        <li className="text-gray-400 px-4 py-1 hover:text-white cursor-pointer">Profile</li>
                      </Link>
                        <li onClick={handleLogout} className="text-gray-400 px-4 py-1 hover:text-white cursor-pointer">Logout</li>
                      </>
                    )}
                  </motion.ul>
                )}
            {/* Cart */}
            <Link to="/cart">
              <div className="relative mt-1">
                <FaShoppingCart />
                <span className="absolute bottom-1 left-2 transform translate-x-1 -translate-y-1 font-titleFont text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;

