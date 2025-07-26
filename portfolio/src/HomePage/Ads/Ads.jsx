import React from "react";
import "../../Css/Main.css";

const Ads = ({ ads }) => {
  return (
    <div className="adds">
      <h2>Sponsored Ads</h2>
      {ads.length === 0 ? (
        <p>No ads available</p>
      ) : (
        ads?.map((ad) => (
          <div key={ad._id} className="adds-item">
            <span className="adds-label">Ads</span> {/* Added label */}
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              ssss ss ss
              <img
                src={`data:image/png;base64,${ad.image}`}
                alt="Ad"
                className="adds-image"
              />
            </a>
            <p>s s s s {ad.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Ads;
