import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url1234 } from '../Url123';
import NotificationScreen from './Notification/NotificationScreen';
import { useFocusEffect } from '@react-navigation/native';

export default function DayScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeStatuses, setEmployeeStatuses] = useState({});
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(moment().set({ hour: 11, minute: 59 }));

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [selectedDate])
  );

  useEffect(() => {
    updateEmployeeStatuses(selectedDate);
  }, [selectedDate, employees]);

  const fetchEmployees = async () => {
    try {
      const admin_id = await AsyncStorage.getItem('admin_id');
      if (!admin_id) {
        throw new Error('admin_id not found in async storage');
      }

      const response = await fetch(`${url1234}/dayscreen?admin_id=${admin_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const updateEmployeeStatuses = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const statuses = {};

    employees.forEach((employee) => {
      const attendance = employee.attendance.find(item => item.date === formattedDate);
      if (attendance) {
        statuses[employee.id] = {
          status: attendance.status,
          icon: getIconBasedOnStatus(attendance.status),
          color: attendance.color,
        };
      } else {
        statuses[employee.id] = {
          status: 'Offline',
          icon: 'cloud-off',
          color: 'gray',
        };
      }
    });

    setEmployeeStatuses(statuses);
  };

  const getIconBasedOnStatus = (status) => {
    switch (status) {
      case 'Đủ':
        return 'check-circle';
      case 'Vắng':
        return 'cancel';
      case 'Nửa':
        return 'access-time';
      default:
        return 'cloud-off';
    }
  };

  const handlePrevDay = () => {
    const newDate = selectedDate.clone().subtract(1, 'day');
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = selectedDate.clone().add(1, 'day');
    setSelectedDate(newDate);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };


  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    const selected = moment(time).set({ second: 0, millisecond: 0 });
    if (selected.hour() >= 6 && (selected.hour() < 23 || (selected.hour() === 23 && selected.minute() <= 59))) {
      setSelectedTime(selected);
    } else {
      alert('Please select a time between 6:00 AM and 11:59 PM.');
    }
    hideTimePicker();
  };

  const countEmployeesWithStatus = () => {
    return Object.values(employeeStatuses).filter(status => status.status === 'Đủ').length;
  };

  return (
    <View style={styles.container}>
      <NotificationScreen navigation={navigation} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevDay}>
          <Text style={styles.navButton}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={styles.dateText}>{selectedDate.format('DD/MM/YYYY')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextDay}>
          <Text style={styles.navButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Tổng số nhân viên đã chấm công:</Text>
        <Text style={styles.countText}>{countEmployeesWithStatus()}</Text>
      </View>


      <ScrollView style={styles.employeeList}>
        {employees.length === 0 ? (
          <Text style={styles.noEmployeesText}>Bạn chưa có nhân viên nào</Text>
        ) : (
          employees.map((employee) => (
            <View key={employee.id} style={styles.employeeContainer}>
              <View style={styles.partOne}>
                <Text style={styles.employeeName}>{employee.name}</Text>
              </View>
              <View style={styles.partTwo}>
                <View style={styles.statusContainer}>
                  <Text style={[styles.employeeStatus, { color: employeeStatuses[employee.id]?.color }]}>
                    {employeeStatuses[employee.id]?.status}
                  </Text>
                  <Icon
                    name={employeeStatuses[employee.id]?.icon}
                    size={20}
                    color={employeeStatuses[employee.id]?.color}
                    style={styles.statusIcon}
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

     
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#5e749e',
    padding: 12, // Increase padding
    borderRadius: 15,
  },
  navButton: {
    fontSize: 36,
    color: '#fff',
  },
  dateText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 16,
  },
  summaryContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  summaryText: {
    fontSize: 18,
    textAlign: 'center',
  },
  countText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#5e749e',
  },
  employeeList: {
    flex: 1,
  },
  employeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#white',
  },
  partOne: {
    flex: 1,
    maxWidth: 209,
  },
  partTwo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  employeeName: {
    fontSize: 16,
  },
  employeeStatus: {
    fontSize: 14,
    marginRight: 8,
  },
  statusIcon: {
    marginLeft: 8,
  },
  noEmployeesText: {
  fontSize: 18,
  textAlign: 'center',
  color: 'gray',
  marginTop: 20,
  },



});
