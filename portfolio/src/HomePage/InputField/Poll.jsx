import React, { useState } from "react";
import "./Poll.css";

const Poll = ({ question, options }) => {
  const [votes, setVotes] = useState(Array(options.length).fill(0)); // Initialize vote counts for each option
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleVote = () => {
    if (selectedOption !== null) {
      const updatedVotes = [...votes];
      updatedVotes[selectedOption] += 1;
      setVotes(updatedVotes);
      setSubmitted(true);
    }
  };

  const handleOptionChange = (index) => {
    setSelectedOption(index);
  };

  const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);

  return (
    <div className="poll-container">
      <h2 className="poll-question">{question}</h2>
      {!submitted ? (
        <div className="poll-options">
          {options.map((option, index) => (
            <div key={index} className="poll-option">
              <label>
                <input
                  type="radio"
                  name="poll"
                  checked={selectedOption === index}
                  onChange={() => handleOptionChange(index)}
                />
                {option}
              </label>
            </div>
          ))}
          <button className="submit-button" onClick={handleVote}>
            Submit Vote
          </button>
        </div>
      ) : (
        <div className="poll-results">
          {options.map((option, index) => (
            <div key={index} className="result-bar">
              <span>{option}</span>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width:
                      totalVotes > 0
                        ? `${(votes[index] / totalVotes) * 100}%`
                        : "0%",
                  }}
                ></div>
              </div>
              <span>
                {votes[index]} votes (
                {totalVotes > 0
                  ? ((votes[index] / totalVotes) * 100).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Poll;
