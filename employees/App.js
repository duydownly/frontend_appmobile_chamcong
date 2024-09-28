// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './src/View/Welcome/Welcome';
import Login from './src/View/Login/Login';
import Home from './src/View/Home/Home';
import WeatherDetail from './components/Weather/WeatherDetail';
import WeatherScreen from './components/Weather/WeatherScreen';
import NotificationTags from './src/View/Home/Options/Notification/NotificationsTags';
import NotificationScreen from './src/View/Home/Options/Notification/NotificationScreen';
import AmountSelectionScreen from './src/View/Home/Options/AmountSelectionScreen/AmountSelectionScreen';
import AttendancePage1 from './src/View/Home/Attendance/AttendancePage/AttendancePage1'; // Import AttendancePage1
import AttendancePage2 from './src/View/Home/Attendance/AttendancePage/AttendancePage2'; // Import AttendancePage1
import AttendancePage3 from './src/View/Home/Attendance/AttendancePage/AttendancePage3'; // Import AttendancePage1

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: 'red' },
            headerTintColor: '#fff',
            title: 'ERS',
            headerTitleAlign: 'left',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: 'red' },
            headerTintColor: '#fff',
            title: 'ERS',
            headerTitleAlign: 'left',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="WeatherScreen"
          component={WeatherScreen}
          options={{ title: 'Weather Screen' }}
        />
        <Stack.Screen
          name="WeatherDetail"
          component={WeatherDetail}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: 'red' },
            headerTintColor: '#fff',
            headerTitle: 'ERS',
          }}
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
        <Stack.Screen
          name="AttendancePage1" // Update the name here
          component={AttendancePage1} // Use AttendancePage1 component
          options={{ headerShown: false }} // Hide the header for AttendancePage1
        />
        <Stack.Screen
          name="NotificationTags"
          component={NotificationTags}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: 'red' },
            headerTintColor: '#fff',
            headerTitle: 'ERS',
          }}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: 'red' },
            headerTitleAlign: 'left',
          }}
        />
        <Stack.Screen
          name="AmountSelectionScreen"
          component={AmountSelectionScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: 'red' },
            headerTintColor: '#fff',
            headerTitle: 'ERS',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
