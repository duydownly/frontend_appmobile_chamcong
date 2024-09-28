import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url1234 } from '../../Url123';
import ActionSheet from 'react-native-actionsheet';

const UpdateEmployee = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [initialEmployeeInfo, setInitialEmployeeInfo] = useState({});
  const [selectedField, setSelectedField] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [temporaryValue, setTemporaryValue] = useState('');
  const [isSalaryFocused, setIsSalaryFocused] = useState(false); // Track focus state for salary field

  const fields = ['name', 'phone', 'password', 'cmnd', 'birth_date', 'address', 'salary'];
  const fieldLabels = {
    name: 'Tên',
    phone: 'Số điện thoại',
    password: 'Mật khẩu',
    cmnd: 'CMND',
    birth_date: 'Ngày sinh',
    address: 'Địa chỉ',
    salary: 'Lương'
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const selected = employees.find(emp => emp.name === selectedEmployee);
      if (selected) {
        setInitialEmployeeInfo({ ...selected });
        setEmployeeInfo({ ...selected });
      }
    }
  }, [selectedEmployee, employees]);

  useEffect(() => {
    if (initialEmployeeInfo) {
      setIsModified(JSON.stringify(employeeInfo) !== JSON.stringify(initialEmployeeInfo));
    }
  }, [employeeInfo, initialEmployeeInfo]);

  const fetchEmployees = async () => {
    try {
      const admin_id = await AsyncStorage.getItem('admin_id');
      if (!admin_id) {
        throw new Error('Admin ID not found in AsyncStorage');
      }

      const response = await fetch(`${url1234}/employees?admin_id=${admin_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSelectEmployee = (index) => {
    setSelectedEmployee(employees[index]?.name);
  };

  const handleSelectField = (index) => {
    const selectedFieldKey = fields[index];
    setSelectedField(selectedFieldKey);
  };

  const formatSalary = (value) => {
    const num = value.replace(/[^0-9]/g, '');
    if (num) {
      return Number(num).toLocaleString();
    }
    return '';
  };

  const handleInputChange = (value) => {
    if (selectedField === 'salary') {
      setEmployeeInfo(prevInfo => ({ ...prevInfo, [selectedField]: formatSalary(value) }));
    } else {
      setEmployeeInfo(prevInfo => ({ ...prevInfo, [selectedField]: value }));
    }
  };

  const handleConfirm = async () => {
    try {
      const updateData = {
        employee_id: employeeInfo.id,
        field: selectedField,
        value: selectedField === 'salary' 
          ? parseFloat(employeeInfo[selectedField].replace(/[^0-9]/g, ''))
          : employeeInfo[selectedField],
      };

      console.log('Data to be sent:', updateData);

      const response = await fetch(`${url1234}/updateEmployee`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee information');
      }

      const result = await response.json();
      console.log('Update successful:', result);

      setIsModified(false);
      Alert.alert('Thông báo', 'Cập nhật thông tin thành công.');

    } catch (error) {
      console.error('Error updating employee information:', error);
    }
  };

  let employeeActionSheet = useRef(null);
  let fieldActionSheet = useRef(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => employeeActionSheet.current.show()} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedEmployee || 'Chọn nhân viên'}
        </Text>
      </TouchableOpacity>

      {selectedEmployee && (
        <>
          <TouchableOpacity onPress={() => fieldActionSheet.current.show()} style={styles.button}>
            <Text style={styles.buttonText}>
              {selectedField ? fieldLabels[selectedField] : 'Chọn thông tin nhân viên'}
            </Text>
          </TouchableOpacity>

          {selectedField && (
            <View style={styles.inputContainer}>
              <View style={styles.salaryInputContainer}>
                <TextInput
                  style={styles.input}
                  value={employeeInfo[selectedField]?.toString()}
                  onChangeText={handleInputChange}
                  onFocus={() => setIsSalaryFocused(true)}
                  onBlur={() => setIsSalaryFocused(false)}
                  keyboardType={selectedField === 'salary' ? 'numeric' : 'default'}
                />
                {selectedField === 'salary' && isSalaryFocused && (
                  <Text style={styles.currencyText}>VND</Text>
                )}
              </View>
            </View>
          )}

          {isModified && (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <ActionSheet
        ref={employeeActionSheet}
        title={'Chọn nhân viên'}
        options={[...employees.map(emp => emp.name), 'Hủy']}
        cancelButtonIndex={employees.length}
        onPress={handleSelectEmployee}
      />

      <ActionSheet
        ref={fieldActionSheet}
        title={'Chọn thông tin nhân viên'}
        options={[...fields.map(field => fieldLabels[field]), 'Hủy']}
        cancelButtonIndex={fields.length}
        onPress={handleSelectField}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#5e749e',
  },
  inputContainer: {
    marginBottom: 12,
  },
  salaryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  currencyText: {
    marginLeft: 10,
    color: '#5e749e',
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#5e749e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
export default UpdateEmployee;
