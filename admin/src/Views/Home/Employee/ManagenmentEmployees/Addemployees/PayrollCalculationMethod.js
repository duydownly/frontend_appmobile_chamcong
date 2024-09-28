import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';

const PayrollCalculationMethod = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { employeeData } = route.params;

  const [payMethod, setPayMethod] = useState('');
  const [salary, setSalary] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('VND');

  const payMethods = ['Ngày', 'Cancel'];
  const currencies = ['VND', 'Cancel'];

  const actionSheetRef = useRef();
  const currencySheetRef = useRef();

  const handleSelectPayMethod = (index) => {
    if (payMethods[index] === 'Ngày') {
      setPayMethod(payMethods[index]);
    }
  };

  const handleSelectCurrency = (index) => {
    if (currencies[index] !== 'Cancel') {
      setSelectedCurrency(currencies[index]);
    }
  };

  const formatSalary = (value) => {
    const num = value.replace(/[^0-9]/g, '');
    if (num) {
      return Number(num).toLocaleString();
    }
    return '';
  };

  const handleSalaryChange = (value) => {
    setSalary(formatSalary(value));
  };

  const handleComplete = async () => {
    const numericSalary = parseFloat(salary.replace(/[^0-9]/g, ''));
    if (!salary || isNaN(numericSalary)) {
      console.error('Invalid salary:', salary);
      return;
    }

    if (
      !employeeData.fullName ||
      !employeeData.phoneNumber ||
      !employeeData.password ||
      !employeeData.idNumber ||
      !employeeData.dob ||
      !employeeData.address ||
      !employeeData.admin_id
    ) {
      console.error('Employee data is incomplete:', employeeData);
      return;
    }

    const payrollData = {
      type: payMethod === 'Tháng' ? 'Tháng' : 'Ngày',
      salary: numericSalary,
      currency: selectedCurrency,
    };

    const dataToSend = {
      fullName: employeeData.fullName,
      phoneNumber: employeeData.phoneNumber,
      password: employeeData.password,
      idNumber: employeeData.idNumber,
      dob: employeeData.dob,
      address: employeeData.address,
      payrollType: payrollData.type,
      salary: payrollData.salary,
      currency: payrollData.currency,
      admin_id: employeeData.admin_id,
    };

    console.log('Data to send:', JSON.stringify(dataToSend, null, 2));

    try {
      const response = await fetch('https://backendapperss.onrender.com/aeas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Employee and salary added successfully:', result);
        navigation.navigate('Home');
      } else {
        console.error('Failed to add employee and salary:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => actionSheetRef.current.show()} style={styles.openModalButton}>
        <Text style={styles.whiteText}>{payMethod ? payMethod : 'Chọn cách tính công'}</Text>
      </TouchableOpacity>
      
      <ActionSheet
        ref={actionSheetRef}
        title={'Chọn cách tính công'}
        options={payMethods}
        cancelButtonIndex={1}
        onPress={(index) => handleSelectPayMethod(index)}
      />

      {payMethod && (
        <View style={styles.salaryContainer}>
          <Text style={styles.label}>{payMethod === 'Tháng' ? 'Lương theo tháng' : 'Lương theo ngày'}</Text>
          <View style={styles.salaryInputContainer}>
            <TextInput
              style={styles.input}
              value={salary}
              onChangeText={handleSalaryChange}
              keyboardType="numeric"
              placeholder="0"
            />
            <TouchableOpacity onPress={() => currencySheetRef.current.show()} style={styles.currencySelector}>
              <Text style={styles.whiteText}>{selectedCurrency}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ActionSheet
        ref={currencySheetRef}
        title={'Chọn đơn vị tiền tệ'}
        options={currencies}
        cancelButtonIndex={1}
        onPress={(index) => handleSelectCurrency(index)}
      />

      {salary && payMethod && (
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Hoàn thành</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  openModalButton: {
    padding: 10,
    backgroundColor: '#5e749e',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
  },
  currencyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  salaryContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  salaryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
 input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    width: 250,
  },
  currencySelector: {
    padding: 10,
    backgroundColor: '#5e749e',
    borderRadius: 5,
    alignItems: 'center',
        height: 60,
    width: 90,
    marginBottom: 10,

  },
  completeButton: {
    padding: 20,
    backgroundColor: '#5e749e',
    borderRadius: 13,
    alignItems: 'center',
    width: 300,
    marginBottom :40,

  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
   whiteText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PayrollCalculationMethod;
