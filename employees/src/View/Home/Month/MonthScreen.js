import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MonthScreen() {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(null);
  const [notes, setNotes] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);

  const fetchEmployeeId = async () => {
    try {
      const id = await AsyncStorage.getItem('employee_id');
      if (id) {
        setEmployeeId(id);
      }
    } catch (error) {
      console.error('Error fetching employee ID:', error);
    }
  };

  const fetchData = async () => {
    try {
      if (employeeId) {
        const response = await fetch(`https://backendapperss.onrender.com/informationscheduleemployees?employee_id=${employeeId}`);
        const data = await response.json();
        setAttendance(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEmployeeId().then(fetchData);
    }, [employeeId])
  );

  const handleDayPress = (day) => {
    setSelectedDay(day);
  };

  const handleNoteChange = (text) => {
    setNotes({
      ...notes,
      [selectedDay]: text,
    });
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

      const attendanceForDay = attendance.find(
        (att) => att.date === dayClone.format('YYYY-MM-DD')
      );

      const dayStyle = {
        ...styles.dayCell,
        backgroundColor: attendanceForDay ? attendanceForDay.color : 'transparent',
        opacity: isCurrentMonth ? 1 : 0.3,
      };

      days.push(
        <TouchableOpacity key={dayClone.format('DD-MM-YYYY')} style={dayStyle} onPress={() => handleDayPress(dayClone.format('YYYY-MM-DD'))}>
          <Text style={styles.dayText}>{dayClone.date()}</Text>
          {attendanceForDay && attendanceForDay.amount > 0 && (
            <Text style={styles.advanceText}>UT</Text>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

const calculateWorkdays = () => {
  return attendance.reduce((acc, att) => {
    if (moment(att.date).month() === currentMonth.month()) {
      if (att.status === 'Đủ') {
        return acc + 1;
      } else if (att.status === 'Nửa') {
        return acc + 0.5;
      }
    }
    return acc;
  }, 0);
};


  const calculateAdvancePayments = () => {
    return attendance.reduce((acc, att) => {
      if (att.amount > 0 && moment(att.date).month() === currentMonth.month()) {
        return acc + parseInt(att.amount, 10);
      }
      return acc;
    }, 0);
  };

  const workdays = calculateWorkdays();
  const advancePayments = calculateAdvancePayments();

  const selectedAttendance = attendance.find(att => att.date === selectedDay);

  return (
    <ScrollView style={styles.calendarContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentMonth(prev => prev.clone().subtract(1, 'months'))}>
          <Text style={styles.navButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>{currentMonth.format('MM/YYYY')}</Text>
        <TouchableOpacity onPress={() => setCurrentMonth(prev => prev.clone().add(1, 'months'))}>
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
      <View style={styles.additionalInfo}>
        {selectedDay ? (
          <>
            <Text style={styles.additionalInfoText}>
              Ngày: {selectedDay}
            </Text>
            {selectedAttendance && selectedAttendance.amount > 0 && (
              <Text style={styles.additionalInfoText}>
                Số tiền ứng: {selectedAttendance.amount} VNĐ
              </Text>
            )}
            <TextInput
              style={styles.noteInput}
              placeholder="Ghi chú"
              value={notes[selectedDay] || ''}
              onChangeText={handleNoteChange}
            />
          </>
        ) : (
          <>
            <Text style={styles.additionalInfoText}>
              Tổng số tiền ứng trong tháng: {advancePayments} VNĐ
            </Text>
            <Text style={styles.additionalInfoText}>
              Tổng số ngày công đã làm: {workdays}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    padding: 29,
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
    position: 'relative', // Added to enable absolute positioning within the cell
  },
  dayText: {
    fontSize: 16,
  },
  advanceText: {
    fontSize: 10,
    color: 'blue',
    position: 'absolute', // Positioning absolute within the cell
    bottom: 0 , // Positioned at the bottom
    left: 0, // Positioned at the left
  },
  additionalInfo: {
    marginTop: 20,
    padding: 16,
  },
  additionalInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
