import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
export default function AccountScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem('name');
      if (storedName) {
        setName(storedName);
      }
    };
    fetchName();
  }, []);

  const handleLogout = async () => {
    const admin_id = await AsyncStorage.getItem('admin_id');
    if (admin_id) {
      console.log('Removing Admin ID:', admin_id);
      await AsyncStorage.removeItem('admin_id');
    }
  
    const storedName = await AsyncStorage.getItem('name');
    if (storedName) {
      console.log('Removing Name:', storedName);
      await AsyncStorage.removeItem('name');
    }
  
    // Reset navigation stack và chuyển đến màn hình SelectRoll
    navigation.dispatch(
      CommonActions.reset({
        index: 0, // Đặt index về 0 để chỉ hiển thị màn hình đầu tiên trong stack
        routes: [{ name: 'SelectRoll' }], // Thay 'SelectRoll' bằng tên màn hình bạn muốn chuyển đến
      })
    );
  };
const handleChangepassword = async () => {
  navigation.navigate('ChangePasswordA');
}
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <FontAwesome name="user-circle" size={100} color="#5e749e" />
        <Text style={styles.headerText}>{name || 'Tài khoản'}</Text>
      </View>
      <ScrollView style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-circle-outline" size={24} color="#5e749e" />
          <Text style={styles.menuText}>Thông tin tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="language-outline" size={24} color="#5e749e" />
          <Text style={styles.menuText}>Ngôn ngữ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#5e749e" />
          <Text style={styles.menuText}>Bảo mật & Tính năng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="key-outline" size={24} color="#5e749e" />
          <Text style={styles.menuText}>Nhập mã kích hoạt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleChangepassword}>
          <Ionicons name="lock-closed-outline" size={24} color="#5e749e" />
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#5e749e" />
          <Text style={styles.menuText}>Hỗ trợ</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.container2}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng Xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    marginTop: 10,
    height: 210,
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
    backgroundColor: '#5e749e',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    width: 350,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
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
