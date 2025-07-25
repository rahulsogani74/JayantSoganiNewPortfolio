import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const CommentsList = ({ post, setCommentCounts }) => {
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  const handleCommentChange = (e, postId) => {
    setNewComment((prevComment) => ({
      ...prevComment,
      [postId]: e.target.value,
    }));
  };

  const handleCommentSubmit = (postId) => {
    const commentText = newComment[postId]?.trim();
    if (commentText) {
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: [
          ...(prevComments[postId] || []),
          {
            name: "You",
            profilePic: "https://via.placeholder.com/50",
            commentText,
            time: "Just now",
          },
        ],
      }));

      // Update comment count in PostFeed
      setCommentCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: prevCounts[postId] ? prevCounts[postId] + 1 : 1,
      }));

      setNewComment((prevComment) => ({
        ...prevComment,
        [postId]: "",
      }));
    }
  };

  return (
    <div>
      <div className="comment-input-container">
        <input
          type="text"
          className="comment-input"
          placeholder="Write a comment..."
          value={newComment[post.id] || ""}
          onChange={(e) => handleCommentChange(e, post.id)}
        />
        <button
          className="comment-submit-button"
          onClick={() => handleCommentSubmit(post.id)}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
      <div className="comments-list">
        {(comments[post.id] || post.comments || []).map((comment, index) => (
          <div key={index} className="comment">
            <img
              src={comment.profilePic}
              alt="Profile"
              className="comment-profile-pic"
            />
            <div className="comment-content">
              <div className="comment-header">
                <p className="comment-username">{comment.name}</p>
                <p className="comment-time">{comment.time}</p>
              </div>
              <p>{comment.commentText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
