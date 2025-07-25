import React, { useState, useEffect, useRef } from "react";
import "./PostFeed.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faCommentAlt,
  faShare,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import postsData from "./PostData.json";
import CommentsList from "./CommentsList";

const PostFeed = () => {
  const [likes, setLikes] = useState({});
  const [showComments, setShowComments] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [menuVisibility, setMenuVisibility] = useState({});
  const dropdownRefs = useRef({});
  const menuRefs = useRef({}); // Ref for the three-dot icons

  const handleLike = (postId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: !(postId in prevLikes) ? true : !prevLikes[postId],
    }));

    // Update like count
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [postId]: prevCounts[postId] ? prevCounts[postId] + 1 : 1,
    }));
  };

  const toggleCommentsVisibility = (postId) => {
    setShowComments((prevVisibility) => ({
      ...prevVisibility,
      [postId]: !prevVisibility[postId],
    }));
  };

  const toggleMenuVisibility = (postId) => {
    // Toggle the current menu visibility
    setMenuVisibility((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Open if closed, close if open
    }));
  };

  const handleEdit = (postId) => {
    alert(`Edit post ${postId}`);
    toggleMenuVisibility(postId); // Close the menu after selecting
  };

  const handleDelete = (postId) => {
    alert(`Delete post ${postId}`);
    toggleMenuVisibility(postId); // Close the menu after selecting
  };

  // Close the dropdown menu when clicking outside of it and the three-dot icon
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDropdown = Object.keys(menuVisibility).some(
        (postId) => {
          const dropdown = dropdownRefs.current[postId];
          return dropdown && dropdown.contains(event.target);
        }
      );

      const isClickInsideMenuIcon = Object.keys(menuVisibility).some(
        (postId) => {
          const menuIcon = menuRefs.current[postId];
          return menuIcon && menuIcon.contains(event.target);
        }
      );

      // Close dropdown if the click is outside both the dropdown and the menu icon
      if (!isClickInsideDropdown && !isClickInsideMenuIcon) {
        setMenuVisibility({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisibility]);

  return (
    <div className="post-feed-container">
      {postsData.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <p className="post-content">{post.content}</p>
            <p className="post-time">{post.time}</p>
            <div
              className="menu-icon"
              ref={(el) => (menuRefs.current[post.id] = el)} // Assign ref to menu icon
              onClick={() => toggleMenuVisibility(post.id)} // Toggle menu visibility
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </div>
            {menuVisibility[post.id] && (
              <div
                className="dropdown-menu"
                ref={(el) => (dropdownRefs.current[post.id] = el)}
              >
                <button onClick={() => handleEdit(post.id)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            )}
          </div>

          {post.image && (
            <img
              src={post.image}
              alt="Post Media"
              className="post-image"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

          {post.video && (
            <video controls className="post-video">
              <source src={post.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {post.article && <p className="post-article">{post.article}</p>}

          <div className="post-actions">
            <button
              className={`action-button like-button ${
                likes[post.id] ? "liked" : ""
              }`}
              onClick={() => handleLike(post.id)}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              {likes[post.id] ? "Liked" : "Like"} ({likeCounts[post.id] || 0})
            </button>
            <button
              className="action-button comment-button"
              onClick={() => toggleCommentsVisibility(post.id)}
            >
              <FontAwesomeIcon icon={faCommentAlt} />
              Comment ({commentCounts[post.id] || 0})
            </button>
            <button className="action-button share-button">
              <FontAwesomeIcon icon={faShare} />
              Share
            </button>
          </div>

          {showComments[post.id] && (
            <div className="comment-section">
              <CommentsList post={post} setCommentCounts={setCommentCounts} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
