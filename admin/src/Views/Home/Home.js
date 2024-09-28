import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Employees from './Employee/Employees';
import MonthScreen from './MonthScreen';
import DayScreen from './Dayscreen/DayScreen';
import AccountScreen from './AccountScreen';

const Tab = createBottomTabNavigator();

export default function Home() {
  const refreshBalance = async () => {
    try {
      const response = await fetch('https://backendapperss.onrender.com/refreshbalance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Balance refreshed successfully');
      } else {
        console.error('Failed to refresh balance');
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Day"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Day') {
            iconName = 'calendar-today';
          } else if (route.name === 'Home') {
            iconName = 'account-group';
          } else if (route.name === 'Month') {
            iconName = 'calendar-month';
          } else if (route.name === 'Account') {
            iconName = 'account-settings';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#5e749e',
        inactiveTintColor: 'gray',
        labelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen 
        name="Day" 
        component={DayScreen} 
        options={{ tabBarLabel: 'Ngày', headerShown: false }} 
      />
      <Tab.Screen 
        name="Home" 
        component={Employees} 
        options={{ 
          tabBarLabel: 'Nhân viên', 
          headerShown: false,
          listeners: {
            tabPress: async () => {
              await refreshBalance(); // Call API when the tab is pressed
              // Additional logic to refresh employees data if needed
            },
          },
        }} 
      />
      <Tab.Screen 
        name="Month" 
        component={MonthScreen} 
        options={{ tabBarLabel: 'Tháng', headerShown: false }} 
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen} 
        options={{ tabBarLabel: 'Tài khoản', headerShown: false }} 
      />
    </Tab.Navigator>
  );
}
