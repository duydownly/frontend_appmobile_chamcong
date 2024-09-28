// TypewriterText.js
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypewriterText = ({ text, speed, style }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, currentIndex]);

  return (
    <Text style={style}>
      {displayedText}
    </Text>
  );
};

export default TypewriterText;
