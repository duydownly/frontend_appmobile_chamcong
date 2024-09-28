// AttendanceNav.js
import React, { useState, useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import timeManager from '../../../../utils/TimeManager';
import AttendancePage1 from './AttendancePage/AttendancePage1';
import AttendancePage2 from './AttendancePage/AttendancePage2';
import AttendancePage3 from './AttendancePage/AttendancePage3';

const Stack = createStackNavigator();

const AttendanceNav = () => {
  const [status, setStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const employeeId = await AsyncStorage.getItem('employee_id');
      if (employeeId) {
        const response = await fetch(`https://backendapperss.onrender.com/employeestatuscurrendate?employee_id=${employeeId}`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data.status);
        } else {
          console.error('Network response was not ok:', response.statusText);
        }
      } else {
        console.error('No employee_id found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching status from API:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStatus();
    }, [])
  );

  const resetPageAtMidnight = () => {
    const now = timeManager.getCurrentTime();
    const midnight = now.clone().startOf('day').add(1, 'day');
    const timeToMidnight = midnight.diff(now);

    setTimeout(() => {
      fetchStatus();
      resetPageAtMidnight();
    }, timeToMidnight);
  };

  useEffect(() => {
    resetPageAtMidnight();
  }, []);

  return (
    <Stack.Navigator>
      {status === 'Nửa' ? (
        <Stack.Screen
          name="AttendancePage3"
          component={AttendancePage3}
          options={{ headerShown: false }}
        />
      ) : status === 'Đủ' ? (
        <Stack.Screen
          name="AttendancePage2"
          component={AttendancePage2}
          options={{ headerShown: false }}
        />
      ) : status === 'nodata' ? (
        <>
          <Stack.Screen
            name="AttendancePage1"
            component={AttendancePage1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AttendancePage2"
            component={AttendancePage2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AttendancePage3"
            component={AttendancePage3}
            options={{ headerShown: false }}
          />
        </>
      ) : null}
    </Stack.Navigator>
  );
};

export default AttendanceNav;
