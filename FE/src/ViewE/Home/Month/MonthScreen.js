import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../../Url'; // Đảm bảo đường dẫn đúng

export default function MonthScreen() {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(null);
  const [notes, setNotes] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [showSummary, setShowSummary] = useState(true);

  // Lấy employee_id từ AsyncStorage
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

  // Fetch dữ liệu điểm danh từ API
  const fetchData = async () => {
    try {
      if (employeeId) {
        const response = await fetch(`${BASE_URL}/informationscheduleemployees?employee_id=${employeeId}`);
        const data = await response.json();
        setAttendance(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Sử dụng useFocusEffect để fetch dữ liệu khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      fetchEmployeeId().then(fetchData);
    }, [employeeId])
  );

  // Xử lý khi người dùng chọn một ngày
  const handleDayPress = (day) => {
    setSelectedDay(day);
    setShowSummary(false); // Tự động chuyển sang xem chi tiết ngày
  };

  // Xử lý thay đổi ghi chú
  const handleNoteChange = (text) => {
    setNotes({
      ...notes,
      [selectedDay]: text,
    });
  };

  // Render các ngày trong tháng
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
        <TouchableOpacity
          key={dayClone.format('DD-MM-YYYY')}
          style={dayStyle}
          onPress={() => handleDayPress(dayClone.format('YYYY-MM-DD'))}
        >
          <Text style={styles.dayText}>{dayClone.date()}</Text>
          {attendanceForDay && attendanceForDay.amount > 0 && (
            <Text style={styles.advanceText}>UT</Text>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  // Tính tổng số ngày công
  const calculateWorkdays = () => {
    return attendance.reduce((acc, att) => {
      if (moment(att.date).month() === currentMonth.month()) {
        if (att.attendance_status === 'Đủ') {
          return acc + 1;
        } else if (att.attendance_status === 'Nửa') {
          return acc + 0.5;
        }
      }
      return acc;
    }, 0);
  };

  // Tính tổng số tiền ứng
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
        <TouchableOpacity onPress={() => {
  if (showSummary) {
    // Khi đang ở tổng hợp, chuyển sang chi tiết ngày và đặt ngày hôm nay
    const today = moment().utcOffset(7).format('YYYY-MM-DD');
    setSelectedDay(today);
  } else {
    // Khi đang xem chi tiết ngày, chuyển về tổng hợp
    setSelectedDay(null);
  }
  setShowSummary(!showSummary);
}}>
  <Text style={styles.toggleButton}>
    {showSummary ? 'Xem chi tiết ngày' : 'Xem tổng hợp tháng'}
  </Text>
</TouchableOpacity>

      </View>

      {/* Hiển thị các ngày trong tuần */}
      <View style={styles.weekdays}>
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
          <Text key={index} style={styles.weekday}>{day}</Text>
        ))}
      </View>

      {/* Hiển thị lịch */}
      <View style={styles.calendar}>
        {renderDays()}
      </View>

      {/* Hiển thị thông tin tổng hợp hoặc chi tiết ngày */}
      <View style={styles.additionalInfo}>
        {showSummary ? (
          <>
            <Text style={styles.additionalInfoText}>
              Tổng số tiền ứng trong tháng: {advancePayments.toLocaleString('vi-VN')} VNĐ
            </Text>
            <Text style={styles.additionalInfoText}>
              Tổng số ngày công đã làm trong tháng này: {workdays} ngày
            </Text>
          </>
        ) : (
          <>
            {selectedDay && (
              <>
                <Text style={styles.additionalInfoText}>
                  Ngày: {selectedDay}
                </Text>
                {selectedAttendance && selectedAttendance.amount > 0 && (
                  <Text style={styles.additionalInfoText}>
    Số tiền ứng: {Number(selectedAttendance.amount).toLocaleString('vi-VN')} VNĐ
    </Text>
                )}
                {/* Hiển thị Check in và Check out */}
                {selectedAttendance && (
                  <>
                    <Text style={styles.additionalInfoText}>
                      Check in: {selectedAttendance.check_in_time || 'Chưa có'}
                    </Text>
                    {selectedAttendance.attendance_status === 'Nửa' && (
                      <Text style={styles.additionalInfoText}>
                        Check out: {selectedAttendance.check_out_time || 'Chưa có'}
                      </Text>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
// Styles
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
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
  },
  advanceText: {
    fontSize: 10,
    color: 'blue',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  additionalInfo: {
    marginTop: 20,
    padding: 16,
  },
  additionalInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  toggleButton: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginTop: 10,
  },
});