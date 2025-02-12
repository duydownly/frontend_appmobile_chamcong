import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [secureText, setSecureText] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const admin_id = await AsyncStorage.getItem('admin_id');
      console.log('Stored Admin ID on startup:', admin_id);

      if (admin_id) {
        navigation.navigate('Home');
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    setError('');

    if (!phoneNumber || !password) {
      setError('Phone number and password are required');
      return;
    }

    try {
      const response = await fetch('https://backendapperss.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('admin_id', data.admin.id);
        navigation.navigate('Home');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'An unexpected error occurred');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Feather name={secureText ? 'eye-off' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 45,
    marginTop: 32,
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
  loginButton: {
    marginTop: 25,
    width: '97%',
    height: 60,
    backgroundColor: '#5e749e',
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
