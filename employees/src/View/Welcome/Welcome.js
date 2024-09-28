import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native';
import TypewriterText from '../../../components/Animation/TypewriterText';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();
  const [animation] = useState(new Animated.Value(1)); // Initial opacity value

  useEffect(() => {
    // Start animation sequence after component mounts
    Animated.timing(animation, {
      toValue: 0, // Fade out to an opacity of 0
      duration: 1500, // Animation duration in milliseconds
      useNativeDriver: true, // Optimize performance using native driver
      delay: 1500, // Wait for 1.5 seconds before starting the animation
    }).start(() => {
      // Navigate to Home screen after animation completes
      navigation.navigate('Home');
    });
  }, []);

  const screenWidth = Dimensions.get('window').width;

  return (
    <Animated.View style={[styles.container, { opacity: animation }]}>
      <View style={styles.header}>
        <TypewriterText text="Welcome" speed={100} style={[styles.welcomeText, { fontSize: Math.min(screenWidth * 0.1, 65) }]} />
        <TypewriterText text="Nguyễn Văn Hiệp" speed={50} style={styles.employeeId} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // White background
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: -30, // Move up a bit
    width: '100%', // Ensure the header takes the full width of the screen
  },
  welcomeText: {
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Georgia',
    textAlign: 'center', // Center the text horizontally
    letterSpacing: -1, // Adjust letter spacing to fit text on one line
  },
  employeeId: {
    fontSize: 40,
    color: '#555',
    marginTop: 20, // Move down 20 units
    textAlign: 'center', // Center the text horizontally
  },
});

export default Welcome;
