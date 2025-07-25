import React, { useState } from "react";
import "./PostUpload.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPoll,
  faFileAlt,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const PostUpload = () => {
  const [postContent, setPostContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(""); // Track type of media (image/video)
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([""]); // Start with one empty option
  const [showPoll, setShowPoll] = useState(false); // Toggle poll UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const characterLimit = 280;

  const handlePostChange = (e) => {
    if (e.target.value.length <= characterLimit) {
      setPostContent(e.target.value);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const type = file.type.split("/")[0];
      if (type === "image" || type === "video") {
        setMediaFile(URL.createObjectURL(file));
        setMediaType(type);
      } else {
        setError("Please upload a valid image or video file.");
        clearMedia();
      }
    } else {
      clearMedia();
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaType("");
  };

  const handlePostSubmit = async () => {
    setLoading(true);
    setError(null);

    if (postContent.trim() || mediaFile || pollQuestion) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setPostContent("");
        clearMedia();
        clearPoll();
      } catch (err) {
        setError("There was an error submitting your post. Please try again.");
      }
    } else {
      setError("Please add some content, media, or a poll before posting.");
    }
    setLoading(false);
  };

  const handlePollClick = () => {
    setShowPoll(!showPoll); // Toggle poll UI
  };

  const handlePollQuestionChange = (e) => {
    setPollQuestion(e.target.value);
  };

  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const removePollOption = (index) => {
    const updatedOptions = pollOptions.filter((_, i) => i !== index);
    setPollOptions(updatedOptions);
  };

  const clearPoll = () => {
    setPollQuestion("");
    setPollOptions([""]);
    setShowPoll(false);
  };

  return (
    <div className="post-upload-container">
      <textarea
        className="post-textarea"
        value={postContent}
        onChange={handlePostChange}
        placeholder="What's on your mind?"
      />
      <div
        className="character-count"
        style={{ color: postContent.length > characterLimit ? "red" : "black" }}
      >
        {postContent.length}/{characterLimit}
      </div>

      {mediaFile && (
        <div className="media-preview">
          {mediaType === "image" ? (
            <img src={mediaFile} alt="Preview" className="preview-image" />
          ) : (
            <video controls className="preview-video">
              <source src={mediaFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <button className="clear-media-button" onClick={clearMedia}>
            <FontAwesomeIcon icon={faTimesCircle} /> Clear Media
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="post-upload-options">
        <label className="option-button">
          <FontAwesomeIcon icon={faImage} /> Media
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="image-upload-input"
            style={{ display: "none" }}
          />
        </label>

        <button className="option-button" onClick={handlePollClick}>
          <FontAwesomeIcon icon={faPoll} /> Poll
        </button>

        <button className="option-button">
          <FontAwesomeIcon icon={faFileAlt} /> Write Article
        </button>
      </div>

      {showPoll && (
        <div className="poll-creation">
          <input
            type="text"
            placeholder="Enter poll question"
            value={pollQuestion}
            onChange={handlePollQuestionChange}
            className="poll-question-input"
          />
          {pollOptions.map((option, index) => (
            <div key={index} className="poll-option">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                className="poll-option-input"
              />
              {pollOptions.length > 1 && (
                <button
                  className="removeBtn"
                  onClick={() => removePollOption(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button className="addBtn" onClick={addPollOption}>
            Add Option
          </button>
        </div>
      )}

      <button
        className="post-button"
        onClick={handlePostSubmit}
        disabled={
          loading || (!postContent.trim() && !mediaFile && !pollQuestion)
        }
      >
        {loading ? <span className="loading-spinner"></span> : "Post"}
      </button>
    </div>
  );
};

export default PostUpload;
