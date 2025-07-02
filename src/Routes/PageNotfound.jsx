import React from 'react';
import { useNavigate } from 'react-router-dom';

function PageNotfound() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src="https://cdn3.vectorstock.com/i/1000x1000/53/87/404-error-page-not-found-isometric-lost-vector-48055387.jpg"
        alt="404 Error"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <button
        onClick={goBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#ffffffcc',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        ⬅ Go Back
      </button>
    </div>
  );
}

export default PageNotfound;
