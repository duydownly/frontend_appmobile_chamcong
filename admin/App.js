import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Hoặc thư viện icon khác tùy chọn
import Login from './src/Views/Login';
import Home from './src/Views/Home/Home';
import AddEmployeesInfo from './src/Views/Home/Employee/ManagenmentEmployees/Addemployees/AddEmployeesInfo';
import AddEmployeesAuth from './src/Views/Home/Employee/ManagenmentEmployees/Addemployees/AddEmployeesAuth';
import PayrollCalculationMethod from './src/Views/Home/Employee/ManagenmentEmployees/Addemployees/PayrollCalculationMethod';
import NotificationScreen from './src/Views/Home/Dayscreen/Notification/NotificationScreen';
import NotificationTags from './src/Views/Home/Dayscreen/Notification/NotificationsTags';
import UpdateEmployee from './src/Views/Home/Employee/ManagenmentEmployees/UpdateEmployee';
import Lockemployees from './src/Views/Home/Employee/ManagenmentEmployees/LockEmployees'
const Stack = createStackNavigator();
const BackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      marginLeft: 10,
      padding: 15, // Thay đổi giá trị này để tăng kích thước vùng bấm
      height: 50,
      width : 90,  // Thay đổi giá trị này để tăng chiều cao của nút
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

export default function App() {
  const navigationRef = React.createRef();

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const adminId = await AsyncStorage.getItem('adminId');
      
      if (adminId) {
        navigationRef.current?.navigate('Home');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerTitle: 'ERS', headerLeft: null }} // Ẩn nút quay lại trên màn hình 'Login'
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerTitle: 'ERS', headerLeft: null }} // Ẩn nút quay lại trên màn hình 'Login'
        />
        <Stack.Screen 
          name="AddEmployeesInfo" 
          component={AddEmployeesInfo} 
          options={{ headerTitle: 'Add Employee Info' }} 
        />
        <Stack.Screen 
          name="AddEmployeesAuth" 
          component={AddEmployeesAuth} 
          options={{ headerTitle: 'Add Employee Auth' }} 
        />
        <Stack.Screen 
          name="PayrollCalculationMethod" 
          component={PayrollCalculationMethod} 
          options={{ headerTitle: 'Payroll Calculation Method' }} 
        />
        <Stack.Screen 
          name="NotificationScreen" 
          component={NotificationScreen} 
          options={{ headerTitle: 'Notifications' }} 
        />
        <Stack.Screen 
          name="NotificationTags" 
          component={NotificationTags} 
          options={{ headerTitle: 'Notification Details' }} 
        />
        <Stack.Screen 
          name="UpdateEmployee" 
          component={UpdateEmployee} 
          options={{ headerTitle: 'Update Employee' }} 
        />
         <Stack.Screen 
          name="Lockemployees" 
          component={Lockemployees} 
          options={{ headerTitle: 'Lockemployees' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
