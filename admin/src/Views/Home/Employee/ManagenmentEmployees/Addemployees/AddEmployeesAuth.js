import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddEmployeesAuth = ({ route }) => {
  const { employeeData } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleAddEmployee = async () => {
    setError('');

    // Retrieve admin_id from AsyncStorage
    const admin_id = await AsyncStorage.getItem('admin_id');

    if (!admin_id) {
      setError('Admin ID is missing.');
      return;
    }

    // Validate required fields
    if (!phoneNumber || !password) {
      setError('All fields are required');
      return;
    }

    const completeEmployeeData = {
      ...employeeData,
      phoneNumber,
      password,
      admin_id,
    };

    navigation.navigate('PayrollCalculationMethod', { employeeData: completeEmployeeData });
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu"
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
        <Text style={styles.addButtonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
        backgroundColor: '#fff',

  },
  input: {
    height: 60,  // Increased height to 1.5 times the original 40
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10, // Space between text inputs
    paddingHorizontal: 10,
    fontSize: 14,
    width: width * 0.66, // 2/3 of the screen width
  },
  addButton: {
    position: 'absolute',
    top: 16,  // Position button at the top
    right: 16, // Align button to the right
    backgroundColor: '#5e749e',
    borderRadius: 5,
    width: 90,  // Width increased to 1.5 times the original 60
    height: 90, // Height increased to 1.5 times the original 60
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24, // Font size increased to fit the larger button
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default AddEmployeesAuth;
