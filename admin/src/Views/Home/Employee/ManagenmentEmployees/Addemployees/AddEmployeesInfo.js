import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Dimensions, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddEmployeesInfo = ({ navigation }) => {
  const route = useRoute();
  const { employeeData = {} } = route.params || {}; 
  const [fullName, setFullName] = useState(employeeData.fullName || '');
  const [idNumber, setIdNumber] = useState(employeeData.idNumber || '');
  const [dob, setDob] = useState(employeeData.dob || '');
  const [address, setAddress] = useState(employeeData.address || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');

    if (!fullName || !idNumber || !dob || !address) {
      setError('All fields are required');
      return;
    }

    navigation.navigate('AddEmployeesAuth', {
      employeeData: { ...employeeData, fullName, idNumber, dob, address }
    });
  };

  const handleQRScan = () => {
    navigation.navigate('QRScanner');
  };

  const handleCCCDScan = () => {
    // Add the action for the new icon here
    console.log("CCCD icon pressed");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Tên nhân viên"
        keyboardType="default"
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        value={idNumber}
        onChangeText={setIdNumber}
        placeholder="Số CMND"
        keyboardType="default"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={dob}
        onChangeText={setDob}
        placeholder="Ngày sinh"
        keyboardType="default"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Địa chỉ"
        keyboardType="default"
        autoCapitalize="none"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.addButton} onPress={handleNext}>
        <Text style={styles.addButtonText}>Tiếp tục</Text>
      </TouchableOpacity>

      <View style={styles.iconLayout}>
        <TouchableOpacity style={styles.qrButton} onPress={handleQRScan}>
          <Icon name="qr-code-scanner" size={100} color="#5e749e" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cccdButton} onPress={handleCCCDScan}>
          <Image source={require('./cccd.jpg')} style={styles.iconImage} />
        </TouchableOpacity>
      </View>
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
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    width: width * 0.66,
  },
  addButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#5e749e',
    borderRadius: 5,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  iconLayout: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  qrButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 14,
  },
  cccdButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 14,
  },
  iconImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain', // Ensure the image scales properly
  },
});

export default AddEmployeesInfo;
