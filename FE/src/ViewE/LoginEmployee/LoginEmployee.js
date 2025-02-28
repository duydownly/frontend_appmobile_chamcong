import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import BASE_URL from '../../Url'; // ✅ Đúng đường dẫn tương đối

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true); // State để bật/tắt hiển thị mật khẩu
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    setError('');
    if (!phoneNumber || !password) {
      setError('Phone number and password are required');
      return;
    }

    try {
      console.log('Sending login request with:', { phoneNumber, password });
      const response = await fetch(`${BASE_URL}/logine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data);

        await AsyncStorage.setItem('employee_id', data.employee.id.toString());
        console.log('Stored employee_id in AsyncStorage:', data.employee.id);

        const status = data.attendance.length > 0 ? data.attendance[0].status : null;
        if (status !== null) {
          await AsyncStorage.setItem('status', status);
          console.log('Stored status in AsyncStorage:', status);
        } else {
          await AsyncStorage.removeItem('status');
          console.log('Removed status from AsyncStorage');
        }

        console.log('Navigating to Welcome');
        navigation.navigate('Welcome');
      } else {
        const errorData = await response.json();
        console.log('API error response data:', errorData);
        setError(errorData.error || 'An unexpected error occurred');
      }
    } catch (err) {
      console.log('Network or server error:', err);
      setError('Failed to connect to the server');
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const employee_id = await AsyncStorage.getItem('employee_id');
      console.log('Stored Employee ID on startup:', employee_id);
      if (employee_id) {
        console.log('Navigating to Welcome page due to existing employee ID');
        navigation.navigate('Welcome');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
          <Feather name={secureText ? 'eye-off' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Vào</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    marginTop: 100,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 40,
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    marginTop: 25,
    width: '97%',
    height: 60,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;