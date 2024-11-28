import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../products/heading";
import Product from "../products/product";
import SampleNextArrow from "./arrow/next";
import SamplePrevArrow from "./arrow/prev";

  const imageFolder = "images/pros/";  
  const NewBrands = () => {
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/products/new-brands")
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error("Error fetching products:", error));
    }, []);
  
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
          },
        },
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
          },
        },
      ],
    };

    return (
      <div className="w-full mt-12">
        <Heading heading="New Brands" />
        <Slider {...settings}>
          {Array.isArray(products) ? (
            products.map((product) => (
              <div key={product.idpro} className="px-2">
                <Product
                  _id={product.idpro}
                  img={`${imageFolder}${product.image}`}
                  proName={product.namepro}
                  price={product.price}
                  cates={product.category}
                  des={product.descr}
                  badge={true}
                  discount={product.discount}
                />
              </div>
            ))
          ) : (
            <div>No products available.</div> 
          )}
        </Slider>
      </div>
    );
    
  };
  
export default NewBrands;
