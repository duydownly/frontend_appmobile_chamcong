import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SelectRoll from './src/SelectRoll'; // Trang chọn vai trò
import LoginAdmin from './src/ViewsA/LoginAdmin';
import LoginEmployee from './src/ViewE/LoginEmployee/LoginEmployee';
import HomeEmployee from './src/ViewE/Home/HomeEmployee';
import AddEmployeesInfo from './src/ViewsA/Home/Employee/ManagenmentEmployees/Addemployees/AddEmployeesInfo';
import AddEmployeesAuth from './src/ViewsA/Home/Employee/ManagenmentEmployees/Addemployees/AddEmployeesAuth';
import PayrollCalculationMethod from './src/ViewsA/Home/Employee/ManagenmentEmployees/Addemployees/PayrollCalculationMethod';
import NotificationScreenA from './src/ViewsA/Home/Dayscreen/Notification/NotificationScreenA';
import NotificationTagsA from './src/ViewsA/Home/Dayscreen/Notification/NotificationsTagsA';
import UpdateEmployee from './src/ViewsA/Home/Employee/ManagenmentEmployees/UpdateEmployee';
import Lockemployees from './src/ViewsA/Home/Employee/ManagenmentEmployees/LockEmployees';
import WeatherDetail from './components/Weather/WeatherDetail';
import WeatherScreen from './components/Weather/WeatherScreen';
import AmountSelectionScreen from './src/ViewE/Home/Options/AmountSelectionScreen/AmountSelectionScreen';
import AttendancePage1 from './src/ViewE/Home/Attendance/AttendancePage/AttendancePage1';
import AttendancePage2 from './src/ViewE/Home/Attendance/AttendancePage/AttendancePage2';
import AttendancePage3 from './src/ViewE/Home/Attendance/AttendancePage/AttendancePage3';
import Welcome from './src/ViewE/Welcome/Welcome';
import Payment from "./src/ViewsA/Home/Employee/Payment"; // Đã sửa lỗi chính tả
import NotificationScreenE from "./src/ViewE/Home/Options/Notification/NotificationScreenE"
import NotificationTagsE from "./src/ViewE/Home/Options/Notification/NotificationTagsE"
import ChangePasswordE from "./src/ViewE/Home/Account/ChangePassword/ChangePasswordE"
import ChangePasswordA from "./src/ViewsA/Home/AccountScreen/ChangePassword/ChangePasswordA"
import Employees from './src/ViewsA/Home/Employee/Employees';
import MonthScreen from './src/ViewsA/Home/MonthScreen/MonthScreen';
import DayScreen from './src/ViewsA/Home/Dayscreen/DayScreen';
import AccountScreenA from './src/ViewsA/Home/AccountScreen/AccountScreenA';
import AccountScreenE from './src/ViewE/Home/Account/AccountScreenE';
import BASE_URL from './src/Url';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      marginLeft: 10,
      padding: 15, // Thay đổi giá trị này để tăng kích thước vùng bấm
      height: 50,
      width: 90,  // Thay đổi giá trị này để tăng chiều cao của nút
      justifyContent: 'center', // Đảm bảo nội dung của nút căn giữa theo chiều dọc
    }}
  >
    <Icon name="arrow-back" size={24} color="#ffffff" />
  </TouchableOpacity>
);

const screenOptions = ({ route }) => {
  const isERS = route.name === 'Login'; // Thay đổi điều kiện theo tên màn hình cần ẩn nút back

  return {
    headerStyle: { backgroundColor: '#5e749e' },
    headerTintColor: '#ffffff', // Màu chữ tiêu đề
    headerTitleAlign: 'left', // Căn tiêu đề về bên trái
    headerLeft: isERS ? null : (props) => <BackButton {...props} />, // Ẩn nút quay lại trên màn hình 'Login'
  };
};

function Home() {
  const refreshBalance = async () => {
    try {
      const response = await fetch(`${BASE_URL}/refreshbalance`, {
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
          } else if (route.name === 'AccountScreenA') {
            iconName = 'account-circle';
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
        name="AccountScreenA" 
        component={AccountScreenA} 
        options={{ tabBarLabel: 'Tài khoản', headerShown: false }} 
      />
          
    </Tab.Navigator>
  );
}

export default function App() {
  const navigationRef = React.createRef();

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const admin_id = await AsyncStorage.getItem('admin_id');
      
      if (admin_id) {
        navigationRef.current?.navigate('HomeAdmin');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectRoll" screenOptions={screenOptions}>
        {/* Trang chọn vai trò */}
        <Stack.Screen
          name="SelectRoll"
          component={SelectRoll}
          options={{ headerShown: false }}
        />
        {/* Đăng nhập Admin */}
        <Stack.Screen
          name="LoginAdmin"
          component={LoginAdmin}
          options={{ headerTitle:  '  Công Xưởng' }} // Ẩn nút quay lại trên màn hình 'Login'
        />
        {/* Đăng nhập Nhân viên */}
        <Stack.Screen
          name="LoginEmployee"
          component={LoginEmployee}
          options={{
            headerTitle:  '  Công Xưởng',
            headerStyle: { backgroundColor: 'red' }, // Thay đổi màu header thành red
            headerTintColor: '#ffffff', // Màu chữ tiêu đề
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
            headerStyle: { backgroundColor: 'red' },
            headerTintColor: '#fff',
          }}
        />

        {/* Màn hình chính của Admin */}
        <Stack.Screen
          name="HomeAdmin"
          component={Home}
          options={{ headerShown: true,
            title: '  Công Xưởng'
           }}
        />
        {/* Màn hình chính của Nhân viên */}
        <Stack.Screen
          name="HomeEmployee"
          component={HomeEmployee}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: 'red' },
            headerTintColor: '#fff',
            title:  '  Công Xưởng',
            headerTitleAlign: 'left',
            headerLeft: () => null,
          }}
        />
        {/* Các màn hình khác */}
        <Stack.Screen name="AddEmployeesInfo" component={AddEmployeesInfo} options={{ headerTitle:  '  Công Xưởng' }} />
        <Stack.Screen name="AddEmployeesAuth" component={AddEmployeesAuth} options={{ headerTitle:  '  Công Xưởng' }} />
        <Stack.Screen name="PayrollCalculationMethod" component={PayrollCalculationMethod} options={{ headerTitle: '  Công Xưởng' }} />
        <Stack.Screen name="NotificationScreenA" component={NotificationScreenA} options={{ headerTitle: '  Công Xưởng' }} />
        <Stack.Screen name="NotificationTagsA" component={NotificationTagsA} options={{ headerTitle: '  Công Xưởng' }} />
        <Stack.Screen name="NotificationScreenE" component={NotificationScreenE} options={{ headerTitle: '  Công Xưởng' }} />
        <Stack.Screen name="NotificationTagsE" component={NotificationTagsE} options={{ headerTitle: '  Công Xưởng', headerStyle: { backgroundColor: 'red' } }} />
        <Stack.Screen name="UpdateEmployee" component={UpdateEmployee} options={{ headerTitle: '  Công Xưởng' }} />
        <Stack.Screen name="Lockemployees" component={Lockemployees} options={{ headerTitle: '  Công Xưởng' }} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} options={{ headerTitle: '  Công Xưởng' }} />
        <Stack.Screen name="WeatherDetail" component={WeatherDetail} options={{ headerTitle:  '  Công Xưởng' }} />
        <Stack.Screen name="AttendancePage1" component={AttendancePage1} options={{ headerShown: false }} />
        <Stack.Screen name="AttendancePage2" component={AttendancePage2} options={{ headerShown: false }} />
        <Stack.Screen name="AttendancePage3" component={AttendancePage3} options={{ headerShown: false }} />
        <Stack.Screen name="AmountSelectionScreen" component={AmountSelectionScreen} options={{ headerTitle:  '  Công Xưởng', headerStyle: { backgroundColor: 'red' }, }} />
        <Stack.Screen name="Payment" component={Payment} options={{ headerTitle:  '  Công Xưởng', headerStyle: { backgroundColor: '#5e749e' }, }} />
        <Stack.Screen name="ChangePasswordE" component={ChangePasswordE}options={{headerTitle: '  Công Xưởng',headerStyle: {backgroundColor:'red'}, }} />
        <Stack.Screen name="ChangePasswordA" component={ChangePasswordA}options={{headerTitle: '  Công Xưởng',headerStyle: {backgroundColor:'#5e749e'}, }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}