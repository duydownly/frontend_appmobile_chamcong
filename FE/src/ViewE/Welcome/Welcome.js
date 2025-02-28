import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions, ActivityIndicator } from 'react-native';
import TypewriterText from '../../../components/Animation/TypewriterText';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../Url'; // ✅ Đường dẫn tương đối chính xác

const Welcome = () => {
  const navigation = useNavigation();
  const [animation] = useState(new Animated.Value(1)); // Initial opacity value
  const [employeeName, setEmployeeName] = useState('');
  const [loading, setLoading] = useState(true); // State để kiểm soát khi nào hiển thị tên nhân viên

  useEffect(() => {
    const checkEmployeeId = async () => {
      const employeeId = await AsyncStorage.getItem('employee_id'); // Lấy employee_id từ AsyncStorage
      if (!employeeId) {
        // Nếu không có employee_id, chuyển hướng về trang Login
        navigation.navigate('LoginEmployee');
        return;
      }

      // Nếu có employee_id, tiếp tục lấy tên nhân viên
      fetchEmployeeName(employeeId);
    };

    const fetchEmployeeName = async (employeeId) => {
      try {
        const response = await fetch(`${BASE_URL}/employeename?employee_id=${employeeId}`);
        const data = await response.json();

        if (response.ok) {
          setEmployeeName(data.name);
        } else {
          setEmployeeName('Không tìm thấy');
        }
      } catch (error) {
        console.error('Lỗi khi lấy tên nhân viên:', error);
        setEmployeeName('Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };

    checkEmployeeId();

    // Animation chuyển màn hình
    Animated.timing(animation, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
      delay: 1500,
    }).start(() => {
      navigation.navigate('HomeEmployee');
    });
  }, []);

  const screenWidth = Dimensions.get('window').width;

  return (
    <Animated.View style={[styles.container, { opacity: animation }]}>
      <View style={styles.header}>
        <TypewriterText text="Welcome" speed={100} style={[styles.welcomeText, { fontSize: Math.min(screenWidth * 0.1, 65) }]} />
        
        {loading ? (
          <ActivityIndicator size="large" color="#555" />
        ) : (
          <TypewriterText text={employeeName} speed={50} style={styles.employeeId} />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: -30,
    width: '100%',
  },
  welcomeText: {
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Georgia',
    textAlign: 'center',
    letterSpacing: -1,
  },
  employeeId: {
    fontSize: 40,
    color: '#555',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Welcome;