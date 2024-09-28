import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import moment from 'moment';
import { url1234 } from './Url123'; // Import the base URL
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import Async Storage
import { useFocusEffect } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet'; // Import ActionSheet

export default function MonthScreen() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const actionSheetRef = useRef(null);

  const fetchEmployees = useCallback(async () => {
    try {
      const admin_id = await AsyncStorage.getItem('admin_id'); // Retrieve admin_id from async storage
      if (!admin_id) {
        throw new Error('admin_id not found in async storage');
      }

      const response = await fetch(`${url1234}/dayscreen?admin_id=${admin_id}`); // Include admin_id as a query parameter
      const data = await response.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error('Fetched data is not an array:', data);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, []);

  useFocusEffect(fetchEmployees);

  const selectEmployee = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setSelectedEmployee(employee);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.clone().subtract(1, 'months'));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.clone().add(1, 'months'));
  };

  const handleButtonPress = (buttonTitle) => {
    setSelectedButton(buttonTitle);
  };

  const handleDayPress = (day) => {
    const today = moment().startOf('day');
    const selectedDayStart = day.startOf('day');

    if (selectedDayStart.isAfter(today)) {
      Alert.alert('Xin lỗi', 'Ngày này chưa tới, bạn không thể thay đổi trạng thái');
      return;
    }

    if (selectedButton && selectedEmployee) {
      setSelectedDay(day);
      setConfirmModalVisible(true);
    }
  };

  const updateOrAddAttendance = async () => {
    const formattedDate = selectedDay.format('YYYY-MM-DD');
    console.log(`Updating or adding attendance for date: ${formattedDate} with status: ${selectedButton}`);

    const existingAttendance = selectedEmployee.attendance.find(att => att.date === formattedDate);

    const method = existingAttendance ? 'PUT' : 'POST';
    const endpoint = existingAttendance ? '/updateAttendance' : '/addAttendance';

    try {
      const response = await fetch(`${url1234}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          date: formattedDate,
          status: selectedButton,
          color: selectedButton === 'Đủ' ? 'green' : selectedButton === 'Vắng' ? 'red' : selectedButton === 'Nửa' ? 'yellow' : 'transparent',
        }),
      });

      if (response.ok) {
        const updatedAttendance = [...selectedEmployee.attendance];
        const attendanceIndex = updatedAttendance.findIndex(att => att.date === formattedDate);

        if (attendanceIndex > -1) {
          updatedAttendance[attendanceIndex] = {
            ...updatedAttendance[attendanceIndex],
            status: selectedButton,
            color: selectedButton === 'Đủ' ? 'green' : selectedButton === 'Vắng' ? 'red' : selectedButton === 'Nửa' ? 'yellow' : 'transparent',
          };
        } else {
          updatedAttendance.push({
            date: formattedDate,
            status: selectedButton,
            color: selectedButton === 'Đủ' ? 'green' : selectedButton === 'Vắng' ? 'red' : selectedButton === 'Nửa' ? 'yellow' : 'transparent',
          });
        }

        const updatedEmployee = { ...selectedEmployee, attendance: updatedAttendance };

        setSelectedEmployee(updatedEmployee);

        const employeeIndex = employees.findIndex(emp => emp.id === selectedEmployee.id);
        const updatedEmployees = [...employees];
        updatedEmployees[employeeIndex] = updatedEmployee;

        setEmployees(updatedEmployees);

        setConfirmModalVisible(false);
      } else {
        console.error(`Failed to update attendance. Server responded with ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const renderDays = () => {
    const startOfMonth = currentMonth.clone().startOf('month').startOf('week');
    const endOfMonth = currentMonth.clone().endOf('month').endOf('week');
    const days = [];

    let day = startOfMonth.clone().subtract(0, 'day');

    while (day.isBefore(endOfMonth, 'day')) {
      day = day.add(1, 'day');
      const dayClone = day.clone();
      const isCurrentMonth = day.month() === currentMonth.month();

      const attendance = selectedEmployee?.attendance.find(
        (att) => att.date === dayClone.format('YYYY-MM-DD')
      );

      const dayStyle = {
        ...styles.dayCell,
        backgroundColor: attendance ? attendance.color : 'transparent',
        opacity: isCurrentMonth ? 1 : 0.3,
      };

      days.push(
        <TouchableOpacity key={dayClone.format('DD-MM-YYYY')} style={dayStyle} onPress={() => handleDayPress(dayClone)}>
          <Text style={styles.dayText}>{dayClone.date()}</Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const handleModalClose = () => {
    setConfirmModalVisible(false);
  };

  const showEmployeeActionSheet = () => {
    if (!Array.isArray(employees) || employees.length === 0) {
      console.warn('No employees available for selection.');
      return;
    }

    const options = employees.map(employee => employee.name);
    options.push('Cancel');
    const cancelButtonIndex = options.length - 1;

    actionSheetRef.current?.show({
      options,
      cancelButtonIndex,
      title: 'Select Employee'
    }, (buttonIndex) => {
      if (buttonIndex !== cancelButtonIndex) {
        const selectedEmployee = employees[buttonIndex];
        selectEmployee(selectedEmployee.id);
      }
    });
  };

  return (
    <ScrollView style={styles.calendarContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.navButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>{currentMonth.format('MM/YYYY')}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekdays}>
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
          <Text key={index} style={styles.weekday}>{day}</Text>
        ))}
      </View>
      <View style={styles.calendar}>
        {renderDays()}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.statusButton, selectedButton === 'Đủ' && styles.selectedStatusButton]}
          onPress={() => handleButtonPress('Đủ')}
        >
          <Text style={[styles.statusButtonText, selectedButton === 'Đủ' && { color: 'green' }]}>Đủ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, selectedButton === 'Vắng' && styles.selectedStatusButton]}
          onPress={() => handleButtonPress('Vắng')}
        >
          <Text style={[styles.statusButtonText, selectedButton === 'Vắng' && { color: 'red' }]}>Vắng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, selectedButton === 'Nửa' && styles.selectedStatusButton]}
          onPress={() => handleButtonPress('Nửa')}
        >
          <Text style={[styles.statusButtonText, selectedButton === 'Nửa' && { color: 'yellow' }]}>Nửa</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickerContainer}>
        <TouchableOpacity onPress={showEmployeeActionSheet}>
          <Text style={styles.pickerText}>{selectedEmployee ? selectedEmployee.name : 'Chọn nhân viên'}</Text>
        </TouchableOpacity>
      </View>
      <ActionSheet
        ref={actionSheetRef}
        title={'Select Employee'}
  options={[...employees.map(emp => emp.name), 'Cancel']} // Include 'Cancel' option
        cancelButtonIndex={employees.length}
        onPress={(buttonIndex) => {
          if (buttonIndex !== employees.length) {
            const selectedEmployee = employees[buttonIndex];
            selectEmployee(selectedEmployee.id);
          }
        }}
      />
      {confirmModalVisible && (
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalMessage}>
              Bạn có chắc chắn muốn {selectedButton} cho ngày {selectedDay.format('DD-MM-YYYY')}?
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity onPress={updateOrAddAttendance} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleModalClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
 calendarContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekday: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14%',
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  dayText: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statusButton: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5e749e',
  },
  selectedStatusButton: {
    borderColor: 'transparent',
  },
  statusButtonText: {
    color: '#5e749e',
    fontSize: 16,
  },

  pickerContainer: {
    marginTop: 50,
    padding: 10,
    backgroundColor: '#5e749e',
    alignItems: 'center',
    height: 65,
    borderRadius:35,  
  borderColor: '#5e749e',
  color: 'white', // Thay đổi màu chữ thành trắng
  textAlign: 'center', // Căn giữa văn bản
  fontSize: 50,
},


  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmModalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  confirmModalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    padding: 15,
    backgroundColor: '#5e749e',
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    backgroundColor: 'grey',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textNormal: {
    fontSize: 16,
    color:'red',
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
    employeeModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  employeeModalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    maxHeight: '80%',
  },
  employeeItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  employeeText: {
    fontSize: 18,
  },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    alignItems: 'center',
  },
    pickerText: {
    color: 'white', // Text color
    fontSize: 25, // Kích thước chữ lớn hơn
    alignItems: 'center',
    marginTop:2,

  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
