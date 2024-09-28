import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();


  const handleLogin = async () => {
  setError(''); // Clear any previous errors

  if (!phoneNumber || !password) {
    setError('Phone number and password are required');
    return;
  }

  try {
    console.log('Sending login request with:', { phoneNumber, password });
    const response = await fetch('https://backendapperss.onrender.com/logine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API response data:', data);

      await AsyncStorage.setItem('employee_id', data.employee.id.toString()); // Store employee ID in AsyncStorage
      console.log('Stored employee_id in AsyncStorage:', data.employee.id);

      const status = data.attendance.length > 0 ? data.attendance[0].status : null;
      if (status !== null) {
        await AsyncStorage.setItem('status', status); // Store status in AsyncStorage
        console.log('Stored status in AsyncStorage:', status);
      } else {
        await AsyncStorage.removeItem('status'); // Remove status from AsyncStorage if null
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
    // Handle network errors or other issues
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
      <View style={styles.header}></View>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
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
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;

