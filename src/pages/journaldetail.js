import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaRegCalendarAlt, FaRegCommentDots } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import toastr from 'toastr'; 
import 'toastr/build/toastr.min.css'; 

const JournalDetail = () => {
  const { id } = useParams(); 
  const [journalEntry, setJournalEntry] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const fullname = localStorage.getItem('fullname'); 


  useEffect(() => {
    const fetchJournalEntry = async () => {
      try {
        const response = await fetch(`http://localhost:5000/journal/${id}`);
        if (!response.ok) throw new Error('Failed to fetch journal details');
        const data = await response.json();
        setJournalEntry(data);
      } catch (error) {
        toastr.error('Failed to load journal details. Please try again.', 'Error');
        console.error('Error:', error);
      }
    };

    fetchJournalEntry();
  }, [id]);

 
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/journal/comments/${id}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        setComments(data);
      } catch (error) {
        toastr.error('Failed to load comments. Please try again.', 'Error');
        console.error('Error:', error);
      }
    };

    fetchComments();
  }, [id]);

 
  const handleAddComment = async () => {
    toastr.options = {
      closeButton: true,
      timeOut: 1200,
    };
    if (!fullname) {
      toastr.warning('You must log in to post a comment.', 'Warning');
      return;
    }
    if (!newComment.trim()) {
      toastr.warning('Comment content cannot be empty.', 'Warning');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/journal/addcomments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_jour: id,
          username: fullname, 
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const addedComment = await response.json();
      setComments([addedComment, ...comments]); 
      setNewComment(''); 
      toastr.options = {
        closeButton: true,
        timeOut: 1200,
      };
      toastr.success('Your comment has been posted successfully.', '');
    } catch (error) {
      toastr.error('Failed to post comment. Please try again.', '');
      console.error('Error:', error);
    }
  };

    
    const handleDeleteComment = async (commentId) => {
      if (window.confirm('Are you sure you want to delete this comment?')) {
        try {
          const response = await fetch(`http://localhost:5000/journal/comments/delete/${commentId}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('Failed to delete comment');
          setComments(comments.filter((comment) => comment.id !== commentId));
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

  if (!journalEntry) return <p>Loading...</p>;

  return (
    <div className="max-w-container mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{journalEntry.title}</h1>

      {/* Metadata */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <FaRegCalendarAlt className="mr-2" />
        <span>{new Date(journalEntry.created_at).toLocaleDateString()}</span>
        <FaRegCommentDots className="ml-2 mr-2" />
        <span className='mr-2'>{comments.length}</span>Comments
      </div>

      {/* Blog Content */}
      <div className="text-gray-700 space-y-4 mb-10 text-justify">
       
        <p>{journalEntry.content}</p>
        <p>{journalEntry.content1}</p>
        <p>{journalEntry.content2}</p>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-300 pt-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h3>

        {/* Comments List */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id_cmt} className="flex justify-between items-start mb-6">
              {/* Left Side: User Avatar and Comment Content */}
              <div className="flex gap-4">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <FiUser className="text-xl" />
                </div>

                {/* Comment Content */}
                <div>
                  {/* Username and Timestamp */}
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold">{comment.username}</h4>
                    <span className="text-sm text-gray-500">
                      | {new Date(comment.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      at {new Date(comment.created_at).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-gray-700 mt-2">{comment.content}</p>
                </div>
              </div>

              {/* Right Side: Delete Button */}
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
          <p className="text-gray-500 hover:text-gray-800 transition-all mt-6">Log in to post a comment.</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default JournalDetail;
