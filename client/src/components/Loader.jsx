import React from 'react';
import '../css/Loader.css'; // Create this CSS file

/**
 * Reusable loading spinner component.
 */
const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;