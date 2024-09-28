import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { SlideToCheckOut } from '../../../../../components/SwipeButton/SwipeButton';
import { useNavigation } from '@react-navigation/native';
import Weather from '../../../../../components/Weather/WeatherScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendancePage3 = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [data, setData] = useState(null); // State to store fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employee_id = await AsyncStorage.getItem('employee_id');
        console.log('Employee ID:', employee_id); // Kiểm tra giá trị employee_id

        if (employee_id) {
          const response = await fetch(`https://backendapperss.onrender.com/informationemployeeattendance?employee_id=${employee_id}`, {
            method: 'GET', // Sử dụng GET
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const result = await response.json();
          console.log('Fetched data:', result); // Kiểm tra dữ liệu trả về

          if (result.length > 0) {
            setData(result[0]); // Lấy đối tượng đầu tiên trong mảng
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
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

  const handleCheckOut = () => {
    console.log("Checked Out");
    navigation.navigate('AttendancePage3');
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  if (!data) {
    return <Text>Loading...</Text>; // Hiển thị thông báo đang tải khi chưa có dữ liệu
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      {/* Weather Section */}
      <View style={styles.weatherContainer}>
        <Weather navigation={navigation} />
      </View>

      {/* Status Section */}
      <View style={styles.statusContainer}>
        <View style={styles.checkInOutContainer2}>
          <View style={styles.checkInOutContainer}>
            <Text style={styles.timeTitle}>Check In</Text>
            <Text style={styles.time}>{data.checkintime || 'Chưa có dữ liệu'}</Text>
          </View>
          <View style={styles.checkInOutContainer}>
            <Text style={styles.timeTitle}>Check Out</Text>
            <View style={styles.wrapper}>
              <Text style={styles.time}>{data.checkouttime || 'Chưa có dữ liệu'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Date Section */}
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDateTime(currentDateTime).split(', ')[0]}</Text>
        <Text style={styles.timeText}>{formatDateTime(currentDateTime).split(', ')[1]}</Text>
      </View>

      {/* Conditional Rendering */}
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
    padding: 16,
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
    fontSize: 18,
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

export default AttendancePage3;
