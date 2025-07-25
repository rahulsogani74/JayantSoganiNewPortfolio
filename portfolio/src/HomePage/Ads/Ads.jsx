import React from "react";
import "../../Css/Main.css";

const Ads = ({ ads }) => {
  return (
    <div className="ads">
      <h2>Sponsored Ads</h2>
      {ads.length === 0 ? (
        <p>No ads available</p>
      ) : (
        ads?.map((ad) => (
          <div key={ad._id} className="ad-item">
            <span className="ad-label">Ads</span> {/* Added label */}
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              <img
                src={`data:image/png;base64,${ad.image}`}
                alt="Ad"
                className="ad-image"
              />
            </a>
            <p>{ad.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Ads;
