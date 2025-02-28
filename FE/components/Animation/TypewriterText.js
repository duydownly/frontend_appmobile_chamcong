// TypewriterText.js
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypewriterText = ({ text, speed, style }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText(''); // Reset text khi `text` thay đổi
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1)); // Cắt text thay vì cộng chuỗi
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <Text style={style}>{displayedText}</Text>;
};

export default TypewriterText;
