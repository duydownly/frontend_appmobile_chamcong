import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, ScrollView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../../../Url';

const Payment = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [description, setDescription] = useState('');
  const navigation = useNavigation();
  const amountInputRef = useRef(null);

  const employeeActionSheet = useRef(null);
  const actionActionSheet = useRef(null);
  const actions = ['Trả lương', 'Thưởng thêm'];

  // Fetch admin_id từ AsyncStorage
  useEffect(() => {
    const fetchAdminId = async () => {
      const id = await AsyncStorage.getItem('admin_id');
      setAdminId(id);
    };
    fetchAdminId();
  }, []);

  // Fetch danh sách nhân viên và lịch sử thanh toán khi adminId thay đổi
  useEffect(() => {
    if (adminId) {
      fetchEmployees();
      fetchPaymentHistory();
    }
  }, [adminId]);

  // Hàm fetch danh sách nhân viên từ API
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${BASE_URL}/employeetabscreen?admin_id=${adminId}`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách nhân viên:', error);
    }
  };

  // Hàm fetch lịch sử thanh toán từ API
  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/historypayments?admin_id=${adminId}`);
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử thanh toán:', error);
    }
  };

  // Xử lý chọn nhân viên
  const handleSelectEmployee = (index) => {
    if (index < employees.length) {
      const selected = employees[index];
      setSelectedEmployee(selected.name);
      setBalance(selected.balance);
      actionActionSheet.current.show();
    }
  };

  // Xử lý chọn thao tác
  const handleSelectAction = (index) => {
    if (index < actions.length) {
      setSelectedAction(actions[index]);
      setShowAmountInput(true);
    }
  };

  // Xử lý thay đổi số tiền
  const handleAmountChange = (text) => {
    const sanitizedText = text.replace(/[^0-9]/g, '');
    const parsedNumber = parseFloat(sanitizedText);
    setAmount(isNaN(parsedNumber) ? '' : parsedNumber.toLocaleString('vi-VN'));
  };

  // Xử lý xác nhận thanh toán
  const handleConfirm = () => {
    const sanitizedAmount = amount.replace(/\./g, '').replace(/,/g, '');
    const numericAmount = parseInt(sanitizedAmount, 10);

    if (!numericAmount || numericAmount === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    let newBalance = balance;
    if (selectedAction === 'Trả lương') {
      newBalance -= numericAmount;
    } else if (selectedAction === 'Thưởng thêm') {
      newBalance += numericAmount;
    }

    Alert.alert(
      'Xác nhận',
      `Bạn đã chọn ${selectedAction} cho ${selectedEmployee} với số tiền: ${numericAmount.toLocaleString('vi-VN')} VND\nSố dư còn lại: ${newBalance.toLocaleString('vi-VN')} VND`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            setShowAmountInput(false);
            setShowDescriptionModal(true);
          },
        },
      ]
    );
  };

  // Xử lý submit thanh toán
  const handleSubmit = async () => {
    const sanitizedAmount = amount.replace(/\./g, '').replace(/,/g, '');
    let numericAmount = parseInt(sanitizedAmount, 10);
  
    if (selectedAction === 'Trả lương') {
      numericAmount = -numericAmount; // Nếu trả lương thì số tiền là số âm
    }
  
    const selectedEmployeeObj = employees.find(emp => emp.name === selectedEmployee);
    if (!selectedEmployeeObj) {
      Alert.alert('Lỗi', 'Không tìm thấy nhân viên.');
      return;
    }
  
    const payload = {
      employee_id: selectedEmployeeObj.id, // Lấy ID nhân viên từ danh sách
      amount: numericAmount,
      description: description.trim() || selectedAction,
    };
  
    try {
      const response = await fetch(`${BASE_URL}/adminrequestchangepayments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        Alert.alert('Thành công', 'Thao tác đã được xử lý thành công!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('HomeAdmin', { initialRouteName: 'Day' });
            },
          },
        ]);
        // Reset lại state sau khi gửi thành công
        setDescription('');
        setAmount('');
        setSelectedEmployee(null);
        setSelectedAction(null);
        setShowAmountInput(false);
      } else {
        throw new Error(responseData.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Gửi yêu cầu thất bại: ${error.message}`);
    }
  };
  
  // Lấy lịch sử thanh toán theo employee_id
  const getPaymentHistoryByEmployeeId = (employeeId) => {
    return paymentHistory.filter((payment) => payment.employee_id === employeeId);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.historyIcon}
        onPress={() => setShowHistoryModal(true)}
      >
        <Icon name="history" size={30} color="#000" />
      </TouchableOpacity>

      {/* Nút chọn nhân viên */}
      <TouchableOpacity
        onPress={() => employeeActionSheet.current.show()}
        style={styles.button1}
      >
        <Text style={styles.buttonText}>
          {selectedEmployee || 'Chọn nhân viên'}
        </Text>
      </TouchableOpacity>

      {/* Nút chọn thao tác */}
      {selectedEmployee && (
        <TouchableOpacity
          onPress={() => actionActionSheet.current.show()}
          style={styles.button2}
        >
          <Text style={styles.buttonText}>
            {selectedAction || 'Chọn thao tác'}
          </Text>
        </TouchableOpacity>
      )}
      <ActionSheet
        ref={employeeActionSheet}
        title={'Chọn nhân viên'}
        options={[...employees.map(emp => emp.name), 'Hủy']}
        cancelButtonIndex={employees.length}
        onPress={handleSelectEmployee}
      />

      <ActionSheet
        ref={actionActionSheet}
        title={'Chọn thao tác'}
        options={[...actions, 'Hủy']}
        cancelButtonIndex={actions.length}
        onPress={handleSelectAction}
      />

      {showAmountInput && (
        <View style={styles.amountContainer}>
          <Text style={styles.inputLabel}>Nhập số tiền (VNĐ)</Text>
          <TextInput
            key={showAmountInput.toString()}
            style={[styles.input, styles.amountDisplay]}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showHistoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lịch sử thanh toán</Text>
            <ScrollView>
  {paymentHistory.map((payment) => (
    <View key={payment.id} style={styles.paymentItem}>
      <Text style={styles.paymentText}>
        <Text style={styles.boldText}>Nhân viên:</Text> {employees.find((emp) => emp.id === payment.employee_id)?.name}
      </Text>
      <Text style={styles.paymentText}>
        <Text style={styles.boldText}>Số tiền:</Text> {Math.abs(payment.amount).toLocaleString('vi-VN')} VND
      </Text>
      <Text style={styles.paymentText}>
        <Text style={styles.boldText}>Hình thức:</Text> {payment.amount < 0 ? "Trả lương" : "Thưởng thêm"}
      </Text>
      <Text style={styles.paymentText}>
      <Text style={styles.boldText}>Ngày:</Text> {new Date(payment.date).toLocaleDateString('vi-VN')}
      </Text>
      <Text style={styles.paymentText}>
        <Text style={styles.boldText}>Mô tả:</Text> {payment.description}
      </Text>
    </View>
  ))}
</ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHistoryModal(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDescriptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDescriptionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mô tả</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mô tả"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setShowDescriptionModal(false);
                handleSubmit();
              }}
            >
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  button1: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 8,
    marginTop: 70,
  },
  button2: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 8,
  },
  buttonText: { fontSize: 16, color: '#000' },
  amountContainer: { marginTop: 20 },
  inputLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  input: {
    height: 70,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 24,
    marginBottom: 16,
  },
  amountDisplay: { fontSize: 32, fontWeight: 'bold', color: '#5e749e', marginBottom: 16 },
  confirmButton: {
    marginTop: 17,
    backgroundColor: '#5e749e',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 60,
  },
  confirmButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  historyIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  paymentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  paymentText: {
    fontSize: 16,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#5e749e',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Payment;