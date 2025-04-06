'use client';

import React, {useState, useEffect} from 'react';

export default function ShowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Set dimensions once mounted in client
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <p>
      window dimensions: {dimensions.width} x {dimensions.height}
    </p>
  );
}
