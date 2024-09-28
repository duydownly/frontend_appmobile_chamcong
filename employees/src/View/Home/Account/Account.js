import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
export default function AccountScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    const employee_id = await AsyncStorage.getItem('employee_id');
    if (employee_id) {
      console.log('Removing employee_id:', employee_id); // Log the current employee_id
      await AsyncStorage.removeItem('employee_id');
      console.log('employee_id removed from AsyncStorage'); // Confirm removal
      navigation.navigate('Login');
    } else {
      console.log('No employee_id found in AsyncStorage'); // Log if no employee_id found
      navigation.navigate('Login');
    }
  };

 return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <FontAwesome name="user-circle" size={100} color="red" />
        <Text style={styles.headerText}>Trần Văn Thịnh</Text>
      </View>
      <ScrollView style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-circle-outline" size={24} color="red" />
          <Text style={styles.menuText}>Thông tin tài khoản</Text>
        </TouchableOpacity>
               <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="language-outline" size={24} color="red" />
          <Text style={styles.menuText}>Ngôn ngữ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="red" />
          <Text style={styles.menuText}>Bảo mật & Tính năng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="key-outline" size={24} color="red" />
          <Text style={styles.menuText}>Nhập mã kích hoạt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={24} color="red" />
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="red" />
          <Text style={styles.menuText}>Hỗ trợ</Text>
        </TouchableOpacity>


      </ScrollView>

<View style = {styles.container2}>
    <TouchableOpacity style={styles.logout}onPress={handleLogout}>
      <Text style={styles.logoutText}>Đăng Xuất</Text>
    </TouchableOpacity>
</View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },

  menuContainer: {
    marginHorizontal: 20,
    marginTop : 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  menuText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
logout: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom : 90,
    width : 350,
    height: 65,
    borderRadius:35,
    justifyContent: 'center', // Ensure contents are centered vertically and horizontally

    
  },
  logoutText: {
    color: 'white',
    fontSize: 25,
  },
   container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});