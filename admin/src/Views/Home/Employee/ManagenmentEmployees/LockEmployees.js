import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url1234 } from '../../Url123';
import ActionSheet from 'react-native-actionsheet';

const Lockemployees = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [initialEmployeeInfo, setInitialEmployeeInfo] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  const actionSheetRef = useRef();

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
      const filteredData = data.map(({ id, name, active_status }) => ({ id, name, active_status }));
      setEmployees(filteredData);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSelectEmployee = (index) => {
    if (index !== employees.length) { // Check if not cancelled
      const employee = employees[index];
      setSelectedEmployee(employee.name);
      setEmployeeInfo(employee);
    }
  };

  const handleActivate = async () => {
    try {
      const updateData = {
        employee_id: employeeInfo.id,
      };

      const response = await fetch(`${url1234}/employeesactive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee status');
      }

      const result = await response.json();
      setEmployeeInfo(prevInfo => ({ ...prevInfo, active_status: 'active' }));
      setIsModified(false);
      Alert.alert('Thông báo', 'Nhân viên đã được kích hoạt.');
      fetchEmployees(); // Refresh employee list after update
    } catch (error) {
      console.error('Error updating employee status:', error);
    }
  };

  const handleUnactivate = async () => {
    try {
      const updateData = {
        employee_id: employeeInfo.id,
      };

      const response = await fetch(`${url1234}/employeesunactive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee status');
      }

      const result = await response.json();
      setEmployeeInfo(prevInfo => ({ ...prevInfo, active_status: 'unactive' }));
      setIsModified(false);
      Alert.alert('Thông báo', 'Nhân viên đã bị khóa.');
      fetchEmployees(); // Refresh employee list after update
    } catch (error) {
      console.error('Error updating employee status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => actionSheetRef.current.show()} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedEmployee || 'Chọn nhân viên'}
        </Text>
      </TouchableOpacity>

      {selectedEmployee && (
        <View style={styles.buttonContainer}>
          {employeeInfo.active_status !== 'active' && (
            <TouchableOpacity style={[styles.actionButton, styles.activateButton]} onPress={handleActivate}>
              <Text style={styles.buttonText}>Kích hoạt</Text>
            </TouchableOpacity>
          )}
          {employeeInfo.active_status !== 'unactive' && (
            <TouchableOpacity style={[styles.actionButton, styles.unactivateButton]} onPress={handleUnactivate}>
              <Text style={styles.buttonText}>Vô hiệu hóa</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ActionSheet
        ref={actionSheetRef}
        title={'Chọn nhân viên'}
        options={[...employees.map(emp => emp.name), 'Hủy']}
        cancelButtonIndex={employees.length}
        onPress={handleSelectEmployee}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activateButton: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  unactivateButton: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxHeight: '80%',
  },
  optionItem: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Lockemployees;
