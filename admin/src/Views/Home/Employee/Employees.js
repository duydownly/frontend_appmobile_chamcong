import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Employees() {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [managementModalVisible, setManagementModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

  const refreshBalance = async () => {
    try {
      const response = await fetch('https://backendapperss.onrender.com/refreshbalance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Balance refreshed successfully');
      } else {
        console.error('Failed to refresh balance');
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      await refreshBalance();
      const admin_id = await AsyncStorage.getItem('admin_id');
      if (admin_id) {
        const response = await fetch(`https://backendapperss.onrender.com/employeetabscreen?admin_id=${admin_id}`);
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
          calculateTotalBalance(data);
        } else {
          console.error('Failed to fetch employees');
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEmployees();
    }, [])
  );

  const calculateTotalBalance = (employees) => {
    const total = employees.reduce((sum, employee) => sum + (parseFloat(employee.balance) || 0), 0);
    setTotalBalance(total);
  };

  const categorizeEmployees = (employees) => {
    const monthlyEmployees = employees.filter(employee => employee.type === 'Tháng');
    const dailyEmployees = employees.filter(employee => employee.type === 'Ngày');
    return { monthlyEmployees, dailyEmployees };
  };

  const { monthlyEmployees, dailyEmployees } = categorizeEmployees(employees);

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

  const handleSalaryDetail = () => {
    navigation.navigate('SalaryDetail');
    setModalVisible(false);
  };

  const formatNumber = (number) => {
    return number.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
  };
  return (
    <View style={styles.container}>
            <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>TỔNG PHẢI TRẢ</Text>
        <View style={styles.amountValueContainer}>
          <Text style={styles.amountValue}>{formatNumber(totalBalance)} VND</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={openManagementModal}>
        <Text style={styles.buttonText}>Quản lý</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
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
                  <Text style={styles.categoryHeader}>NHÂN VIÊN NGÀY ({dailyEmployees.length})</Text>
                  {dailyEmployees.map((employee) => (
                    <TouchableOpacity
                      key={employee.id}
                      style={styles.employeeContainer}
                      onPress={() => handleEmployeeSelect(employee)}
                    >
                      <Text style={styles.employeeName}>{employee.name}</Text>
                      <Text style={styles.employeeBalance}>Số dư {formatNumber(parseFloat(employee.balance) || 0)}</Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.categoryHeader}>NHÂN VIÊN THÁNG ({monthlyEmployees.length})</Text>
                  {monthlyEmployees.map((employee) => (
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
                <TouchableOpacity style={styles.salaryDetailButton} onPress={handleSalaryDetail}>
                  <Text style={styles.buttonText}>Chi tiết</Text>
                </TouchableOpacity>
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
      {selectedEmployee && (
        <View style={styles.selectedEmployeeContainer}>
          <Text style={styles.selectedEmployeeText}>Tên: {selectedEmployee.name}</Text>
          <Text style={styles.selectedEmployeeText}>Số dư: {selectedEmployee.balance}</Text>
          <Text style={styles.selectedEmployeeText}>Loại: {selectedEmployee.type}</Text>
        </View>
      )}
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
  salaryDetailButton: {
    backgroundColor: '#5e749e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    marginTop: 16,
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
