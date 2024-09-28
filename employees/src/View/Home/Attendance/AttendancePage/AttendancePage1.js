import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SlideToCheckIn } from '../../../../../components/SwipeButton/SwipeButton';
import { useNavigation } from '@react-navigation/native';
import TypewriterText from '../../../../../components/Animation/TypewriterText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import timeManager from '../../../../../utils/TimeManager'; // Import timeManager

const AttendancePage1 = () => {
  const navigation = useNavigation();

  const handleCheckIn = async () => {
    console.log("Checked In");

    try {
      const employee_id = await AsyncStorage.getItem('employee_id');
      console.log('Stored Employee ID on check-in:', employee_id);

      if (employee_id) {
        const currentVietnamTime = timeManager.getCurrentVietnamTime();
        const currentDate = currentVietnamTime.format('YYYY-MM-DD');
        console.log('Formatted Date (VN):', currentDate);

        // Make the fetch request
        const response = await fetch('https://backendapperss.onrender.com/addAttendancefromemployee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employee_id: employee_id,
            date: currentDate,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text(); // Read response text for more details
          throw new Error(`Network response was not ok. Status: ${response.status}, Message: ${errorText}`);
        }

        const result = await response.json();
        console.log('Attendance added successfully:', result);
        navigation.navigate('AttendancePage2');
      } else {
        Alert.alert('Error', 'No employee ID found');
      }
    } catch (err) {
      console.error('Error adding attendance:', err.message);
      Alert.alert('Error', `Failed to add attendance: ${err.message}`);
    }
  };

  useEffect(() => {
    // Any initial setup can go here if needed
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      <View style={styles.messageContainer}>
        <TypewriterText 
          text="Vui lòng trượt nút bên dưới để hệ thống ghi nhận chấm công của bạn" 
          speed={40} 
          style={styles.typewriterText} 
        />
      </View>
      <View style={styles.checkInButtonContainer}>
        <SlideToCheckIn onSwipeSuccess={handleCheckIn} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'white', // Ensure the content container is white
  },
  scrollView: {
    backgroundColor: 'white', // Ensure the scroll view itself is white
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typewriterText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  checkInButtonContainer: {
    alignItems: 'center',
    marginBottom: 40, // Ensure there is space at the bottom
  },
});

export default AttendancePage1;
