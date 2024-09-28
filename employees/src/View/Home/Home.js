// Home.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AttendancePage1 from './Attendance/AttendancePage/AttendancePage1';
import AttendancePage2 from './Attendance/AttendancePage/AttendancePage2';
import AttendancePage3 from './Attendance/AttendancePage/AttendancePage3';
import MonthScreen from './Month/MonthScreen';
import AccountScreen from './Account/Account';
import Options from './Options/Options';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AttendanceNavigator = ({ initialPage }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialPage}>
      <Stack.Screen name="AttendancePage1" component={AttendancePage1} />
      <Stack.Screen name="AttendancePage2" component={AttendancePage2} />
      <Stack.Screen name="AttendancePage3" component={AttendancePage3} />
      {/* Removed InitialPage screen as it's not necessary */}
    </Stack.Navigator>
  );
};

export default function Home() {
  const [attendancePage, setAttendancePage] = useState('AttendancePage3'); // Default page
  const [loading, setLoading] = useState(true); // Loading state

  const fetchStatus = async () => {
    try {
      const employeeId = await AsyncStorage.getItem('employee_id');
      if (employeeId) {
        const response = await fetch(`https://backendapperss.onrender.com/employeestatuscurrendate?employee_id=${employeeId}`);
        if (response.ok) {
          const data = await response.json();
          setAttendancePage(data.status);
        } else {
          console.error('Network response was not ok:', response.statusText);
        }
      } else {
        console.error('No employee_id found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching status from API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Determine the initial page based on attendancePage status
  let initialPage;
  switch (attendancePage) {
    case 'Đủ':
      initialPage = 'AttendancePage2';
      break;
    case 'Nửa':
      initialPage = 'AttendancePage3';
      break;
    default:
      initialPage = 'AttendancePage1';
  }

  if (loading) {
    return null; // Optionally show a loading spinner or placeholder
  }

  return (
    <Tab.Navigator
      initialRouteName="Attendance"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Attendance':
              iconName = 'clipboard-check';
              break;
            case 'Month':
              iconName = 'calendar-month';
              break;
            case 'Options':
              iconName = 'cogs';
              break;
            case 'Account':
              iconName = 'account-circle';
              break;
            default:
              iconName = 'calendar-today';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        labelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Attendance"
        options={{ tabBarLabel: 'Chấm công' }}
      >
        {() => <AttendanceNavigator initialPage={initialPage} />}
      </Tab.Screen>
      <Tab.Screen
        name="Month"
        component={MonthScreen}
        options={{ tabBarLabel: 'Tháng' }}
      />
      <Tab.Screen
        name="Options"
        component={Options}
        options={{ tabBarLabel: 'Tùy chọn' }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarLabel: 'Tài khoản' }}
      />
    </Tab.Navigator>
  );
}
