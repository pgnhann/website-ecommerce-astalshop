import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Breadcrumbs from "../components/pageprops/breadcrumbs";
import ProductInfo from "../components/pageprops/prodetails/info";
import ProductsOnSale from "../components/pageprops/prodetails/onsale";

const ProductDetails = () => {
  const location = useLocation();
  const { item, imagePath, searchQuery } = location.state || {}; // Lấy item và searchQuery từ state

  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const fullname = localStorage.getItem("fullname");

  useEffect(() => {
    setProductInfo(location.state.item || {});
    setPrevLocation(location.pathname);

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/products/comments/${location.state.item._id}`
        );
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setComments(data);
      } catch (error) {
        toastr.error("Failed to load comments. Please try again.", "Error");
        console.error("Error:", error);
      }
    };

    if (location.state.item?._id) fetchComments();
  }, [location]);

  const handleAddComment = async () => {
    toastr.options = {
      closeButton: true,
      timeOut: 1200,
    };
    if (!fullname) {
      toastr.warning("You must log in to post a comment.", "Warning");
      return;
    }
    if (!newComment.trim()) {
      toastr.warning("Comment content cannot be empty.", "Warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/products/addcomments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idpro: productInfo._id,
          username: fullname,
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");
      const addedComment = await response.json();

      setComments([addedComment, ...comments]); 
      setNewComment(""); 
      toastr.success("Your comment has been posted successfully.", "");
    } catch (error) {
      toastr.error("Failed to post comment. Please try again.", "");
      console.error("Error:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await fetch(`http://localhost:5000/products/comments/delete/${commentId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete comment');
        setComments(comments.filter((comment) => comment.id_cmt !== commentId));
        toastr.success('Comment deleted successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 1200); 
      } catch (error) {
        toastr.error('Failed to delete comment!');
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="w-full mx-auto border-b-gray-300 mb-12 mt-4">
      {/* Product Details Section */}
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full">
            <ProductsOnSale />
          </div>
          <div className="h-full xl:col-span-2 flex items-center justify-center">
            <img
              className="ml-20 object-contain max-w-max scale-125"
              src={searchQuery ? imagePath : `/${item.img}`} 
              alt={item.namepro || "Product"}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>

        {/* Comment Section */}
        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h3>

          {/* Comments List */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id_cmt} className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <FiUser className="text-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold">{comment.username}</h4>
                      <span className="text-sm text-gray-500">
                        | {new Date(comment.created_at).toLocaleDateString()}{" "}
                        at {new Date(comment.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{comment.content}</p>
                  </div>
                </div>
                {fullname === comment.username && (
                  <button
                    className="flex items-center justify-center mt-3 bg-red-600 text-white w-8 h-8 rounded p-1 hover:bg-red-700"
                    onClick={() => handleDeleteComment(comment.id_cmt)}
                    title="Delete Comment"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}

          {/* Add Comment Form */}
          {fullname ? (
            <div className="mt-6">
              <textarea
                className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                rows="3"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="bg-black text-white px-5 py-2 mt-3 rounded hover:bg-gray-800 transition-all"
                onClick={handleAddComment}
              >
                Post Comment
              </button>
            </div>
          ) : (
            <Link to="/signin">
              <p className="text-gray-500 hover:text-gray-800 transition-all mt-6">
                Log in to post a comment.
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
