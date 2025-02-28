import React, { useRef } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 100;
const BUTTON_HEIGHT = 110;
const SWIPEABLE_DIMENSIONS = 69;
const H_SWIPE_RANGE = (BUTTON_WIDTH - SWIPEABLE_DIMENSIONS) / 1.1;

const SwipeButton = ({ onSwipeSuccess, label, swipeText }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
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

  return (
    <View style={styles.container}>
      <View style={styles.swipeButton}>
        <Text style={styles.text}>{label}</Text>
        <Animated.View {...panResponder.panHandlers} style={[styles.swipeable, { transform: [{ translateX }] }]}>
          <Text style={styles.swipeText}>{swipeText}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const SlideToCheckIn = ({ onSwipeSuccess }) => (
  <SwipeButton onSwipeSuccess={onSwipeSuccess} label="Slide to Check In" swipeText=">" />
);

const SlideToCheckOut = ({ onSwipeSuccess }) => (
  <SwipeButton onSwipeSuccess={onSwipeSuccess} label="Slide to Check Out" swipeText=">" />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative',
  },
  swipeButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: 'red',
    borderRadius: 70,
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginBottom: 30,
    alignSelf: 'center',
    transform: [{ translateX: -7 }],
  },
  swipeable: {
    width: SWIPEABLE_DIMENSIONS + 30,
    height: SWIPEABLE_DIMENSIONS + 30,
    borderRadius: SWIPEABLE_DIMENSIONS,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 35,
  },
  swipeText: {
    fontSize: 15,
    color: 'red',
  },
});

export { SwipeButton, SlideToCheckIn, SlideToCheckOut };
