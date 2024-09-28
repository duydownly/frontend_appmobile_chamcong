import React, { useRef } from 'react';
import { View, Text, PanResponder, Animated } from 'react-native';
import styles from '../../src/View/Home/Attendance/styleattendance';

const H_SWIPE_RANGE = (styles.swipeButton.width - styles.swipeable.width)/1.1; // Sử dụng giá trị từ styles

const SwipeButton = ({ onSwipeSuccess, label, swipeText }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newTranslateX = gestureState.dx;
        translateX.setValue(newTranslateX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < H_SWIPE_RANGE) {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: H_SWIPE_RANGE,
            useNativeDriver: false,
          }).start(() => onSwipeSuccess());
        }
      },
    })
  ).current;

  const animatedStyle = {
    transform: [{ translateX }],
  };

  return (
    <View style={styles.container}>
      {/* Sử dụng styles.container để căn giữa thành phần SwipeButton */}
      <View style={styles.swipeButton}>
        <Text style={styles.text}>{label}</Text>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.swipeable, animatedStyle]}
        >
          <Text style={styles.swipeText}>{swipeText}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const SlideToCheckIn = ({ onSwipeSuccess }) => (
  <SwipeButton
    onSwipeSuccess={onSwipeSuccess}
    label="Slide to Check In"
    swipeText=">"
  />
);

const SlideToCheckOut = ({ onSwipeSuccess }) => (
  <SwipeButton
    onSwipeSuccess={onSwipeSuccess}
    label="Slide to Check Out"
    swipeText=">"
  />
);

export { SwipeButton, SlideToCheckIn, SlideToCheckOut };
