import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../products/product";

const Pagination = ({ itemsPerPage, items }) => {
    const [itemOffset, setItemOffset] = useState(0);

    if (!Array.isArray(items)) {
        console.error("Invalid items data:", items);
        return <div>No items to display.</div>;
    }

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
                {currentItems.map((item) => (
                    <div key={item._id} className="w-full">
                        <Product
                            _id={item.idpro}
                            img={`images/pros/${item.image}`}
                            proName={item.namepro}
                            price={item.price}
                            des={item.descr}
                            cates={item.category}
                            discount={item.discount}
                        />
                    </div>
                ))}
            </div>

            <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
                <ReactPaginate
                    nextLabel=""
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel=""
                    pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
                    pageClassName="mr-6"
                    containerClassName="flex text-base font-semibold font-titleFont py-10"
                    activeClassName="bg-black text-white"
                />
                <p className="text-base font-normal text-lightText">
                    Products from {itemOffset === 0 ? 1 : itemOffset + 1} to {endOffset} of {items.length}
                </p>
            </div>
        </div>
    );
};

export default Pagination;