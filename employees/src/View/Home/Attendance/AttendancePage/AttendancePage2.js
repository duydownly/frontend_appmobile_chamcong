import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { SlideToCheckOut } from '../../../../../components/SwipeButton/SwipeButton';
import { useNavigation } from '@react-navigation/native';
import WeatherScreen from '../../../../../components/Weather/WeatherScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import timeManager from   '../../../../../utils/TimeManager';

const AttendancePage2 = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(timeManager.getCurrentVietnamTime().toDate());
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employee_id = await AsyncStorage.getItem('employee_id');
        console.log('Employee ID:', employee_id);

        if (employee_id) {
          const response = await fetch(`https://backendapperss.onrender.com/informationemployeeattendance?employee_id=${employee_id}`);
          const result = await response.json();
          console.log('Fetched data:', result);
          if (result.length > 0) {
            setData(result[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setCurrentDateTime(timeManager.getCurrentVietnamTime().toDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (date) => {
    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(date).replace('lúc', '');
  };

  const handleCheckOut = async () => {
    console.log("Checked Out");
    try {
      const employee_id = await AsyncStorage.getItem('employee_id');
      const now = timeManager.getCurrentVietnamTime();
      const formattedDate = now.format('YYYY-MM-DD');

      console.log('Current Date in Vietnam time zone:', formattedDate);

      if (employee_id) {
        const response = await fetch('https://backendapperss.onrender.com/Updateattendancetohalf', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employee_id: employee_id,
            date: formattedDate,
          }),
        });

        if (response.ok) {
          console.log('Attendance updated successfully');
          navigation.navigate('AttendancePage3');
        } else {
          console.error('Failed to update attendance');
        }
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      <View style={styles.weatherContainer}>
        <WeatherScreen navigation={navigation} />
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.checkInOutContainer2}>
          <View style={styles.checkInOutContainer}>
            <Text style={styles.timeTitle}>Check In</Text>
            <Text style={styles.time}>{data.checkintime || 'Chưa có dữ liệu'}</Text>
          </View>
          <View style={styles.checkInOutContainer}>
            <Text style={styles.timeTitle}>Check Out</Text>
            <View style={styles.wrapper}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDateTime(currentDateTime).split(', ')[0]}</Text>
        <Text style={styles.timeText}>{formatDateTime(currentDateTime).split(', ')[1]}</Text>
      </View>

      {isEnabled ? (
        <View style={styles.checkInButtonContainer}>
          <SlideToCheckOut onSwipeSuccess={handleCheckOut} />
        </View>
      ) : (
        <View style={styles.workDaysContainer}>
          <Text style={styles.boldText}>
            Số ngày công bạn đã làm được trong tháng này :
          </Text>
          <Text style={[styles.largeRedText, styles.centerText]}>
            {"\n"}
            {data.totalworkday || 'Chưa có dữ liệu'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  statusContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  checkInOutContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
 checkInOutContainer: {
    alignItems: 'center',
    width: '45%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  timeTitle: {
    fontSize: 14,
    color: 'bold',
    marginBottom: 5,
    fontWeight: '1000',
  },
  time: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    marginBottom: 5,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
  },
  wrapper: {
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
    marginLeft: 28,
    fontSize: 20,
  },
  largeRedText: {
    color: 'red',
    fontSize: 3 * 16, // 3 times the default font size
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
  },
  checkInButtonContainer: {
    marginBottom: 16,
  },
  weatherContainer: {
    marginBottom: 16, // Thay vì marginTop, sử dụng marginBottom để thêm khoảng cách dưới cùng
    backgroundColor: 'white',
  },
    scrollView: {
    backgroundColor: 'white', // Ensure the scroll view itself is white
  },
});

export default AttendancePage2;
