import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePasswordA = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      // Lấy admin_id từ AsyncStorage
      const adminId = await AsyncStorage.getItem('admin_id');
      if (!adminId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
        return;
      }

      // Gọi API đổi mật khẩu
      const response = await fetch('https://backendapperss.onrender.com/changepasswordadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: adminId, // Sử dụng admin_id lấy từ AsyncStorage
          password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', data.message);
        // Điều hướng đến HomeAdmin và chọn tab Day
        navigation.navigate('HomeAdmin', { initialRouteName: 'Day' });
      } else {
        Alert.alert('Lỗi', data.error || 'Đổi mật khẩu thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi Mật Khẩu</Text>

      {/* Mật khẩu cũ */}
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      {/* Mật khẩu mới */}
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Nhập lại mật khẩu mới */}
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu mới"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Nút Thay đổi */}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Thay đổi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 45,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#5e749e',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordA;
