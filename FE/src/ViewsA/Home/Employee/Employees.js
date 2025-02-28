import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../../Url'; // ✅ Đường dẫn tương đối chính xác

export default function Employees() {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [managementModalVisible, setManagementModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

  const refreshBalance = async () => {
    try {
      const response = await fetch(`${BASE_URL}/refreshbalance`, { // Sửa dấu nháy đơn thành backtick
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Balance refreshed successfully');
      } else {
        console.error('Failed to refresh balance, Status:', response.status);
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };
  

  const fetchEmployees = async () => {
    try {
      await refreshBalance();
      const admin_id = await AsyncStorage.getItem('admin_id');
      console.log('Admin ID:', admin_id); // Log admin_id để kiểm tra
  
      if (admin_id) {
        const url = `${BASE_URL}/employeetabscreen?admin_id=${admin_id}`;
        console.log('Fetching URL:', url); // Log URL để kiểm tra
  
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Data:', data); // Log dữ liệu nhận được
          setEmployees(data);
          calculateTotalBalance(data);
        } else {
          console.error('Failed to fetch employees, Status:', response.status);
        }
      } else {
        console.warn('No admin_id found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  

  // Correct useFocusEffect format
  useFocusEffect(
    useCallback(() => {
      fetchEmployees();

      // Cleanup function (optional)
      return () => {
        console.log('Screen is unfocused, cleanup if needed');
      };
    }, [])
  );

  const calculateTotalBalance = (employees) => {
    const total = employees.reduce((sum, employee) => sum + (parseFloat(employee.balance) || 0), 0);
    setTotalBalance(total);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(false);
  };

  const openManagementModal = () => {
    setManagementModalVisible(true);
  };

  const closeManagementModal = () => {
    setManagementModalVisible(false);
  };

  const handleAddEmployee = () => {
    navigation.navigate('AddEmployeesInfo');
    closeManagementModal();
  };

  const handleUpdateEmployee = () => {
    navigation.navigate('UpdateEmployee');
    closeManagementModal();
  };

  const handleLockEmployee = () => {
    navigation.navigate('Lockemployees');
    closeManagementModal();
  };

  const handleDeleteEmployee = () => {
    closeManagementModal();
  };

  const formatNumber = (number) => {
    return number.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.amountContainer} onPress={() => setModalVisible(true)}>
        <Text style={styles.amountLabel}>TỔNG PHẢI TRẢ</Text>
        <View style={styles.amountValueContainer}>
          <Text style={styles.amountValue}>{formatNumber(totalBalance)} VND</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={openManagementModal}>
        <Text style={styles.buttonText}>Quản lý</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment')}>
        <Text style={styles.buttonText}>Thanh Toán</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <ScrollView style={styles.scrollContainer}>
                  <Text style={styles.categoryHeader}>DANH SÁCH NHÂN VIÊN ({employees.length})</Text>
                  {employees.map((employee) => (
                    <TouchableOpacity
                      key={employee.id}
                      style={styles.employeeContainer}
                      onPress={() => handleEmployeeSelect(employee)}
                    >
                      <Text style={styles.employeeName}>{employee.name}</Text>
                      <Text style={styles.employeeBalance}>Số dư {formatNumber(parseFloat(employee.balance) || 0)}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={managementModalVisible}
        onRequestClose={closeManagementModal}
      >
        <TouchableWithoutFeedback onPress={closeManagementModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.managementModalView}>
                <TouchableOpacity style={styles.managementButton} onPress={handleAddEmployee}>
                  <Text style={styles.buttonText}>Thêm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.managementButton} onPress={handleUpdateEmployee}>
                  <Text style={styles.buttonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.managementButton} onPress={handleLockEmployee}>
                  <Text style={styles.buttonText}>Khóa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.managementButton} onPress={handleDeleteEmployee}>
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  amountContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 37,
    padding: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    backgroundColor: '#5e749e',
    color: 'white',
    padding: 8,
    borderRadius: 50,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '75%',
    marginTop: 15,
  },
  amountValueContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  amountValue: {
    color: '#5e749e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#5e749e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  managementModalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 20,
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    color: '#5e749e',
  },
  employeeContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  employeeBalance: {
    fontSize: 14,
  },
  selectedEmployeeContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 16,
    marginTop: 20,
  },
  selectedEmployeeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  managementButton: {
    width: '48%',
    padding: 40,
    backgroundColor: '#5e749e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
});