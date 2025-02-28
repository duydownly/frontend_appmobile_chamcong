import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../../../Url'; // ✅ Đúng đường dẫn tương đối

const AmountSelectionScreen = () => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [inputAmount, setInputAmount] = useState('');
  const [employeeId, setEmployeeId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    // Lấy employee_id từ AsyncStorage
    const fetchEmployeeId = async () => {
      try {
        const storedId = await AsyncStorage.getItem('employee_id');
        if (storedId) {
          setEmployeeId(storedId);
        }
      } catch (error) {
        console.error('Error fetching employee_id:', error);
      }
    };
    fetchEmployeeId();
  }, []);

  const amounts = [200000, 300000, 500000, 1000000, 2000000, 5000000];

  const handleAmountPress = (amount) => {
    setSelectedAmount(amount);
    setInputAmount(amount.toLocaleString('vi-VN'));
  };

  const handleInputChange = (text) => {
    const sanitizedText = text.replace(/[^0-9]/g, '');
    const parsedNumber = parseFloat(sanitizedText);
    setInputAmount(isNaN(parsedNumber) ? '' : parsedNumber.toLocaleString('vi-VN'));
  };

  const handleConfirm = () => {
    const sanitizedAmount = inputAmount.replace(/\./g, '').replace(/,/g, ''); // Loại bỏ dấu . và ,
    const numericAmount = parseInt(sanitizedAmount, 10); // Chuyển thành số nguyên
  
    console.log("Số tiền sau khi xử lý:", numericAmount); // Debug log
  
    if (!numericAmount || numericAmount === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ.');
      return;
    }
  
    if (numericAmount % 10000 !== 0) {
      Alert.alert('Lỗi', 'Số tiền phải là bội số của 10,000.');
      return;
    }
  
    setModalVisible(true);
  };
  
  const handleSubmitRequest = async () => {
    const sanitizedAmount = inputAmount.replace(/\./g, '').replace(/,/g, '');
    const numericAmount = parseInt(sanitizedAmount, 10);
  
    if (!reason.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do bạn muốn ứng tiền.');
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/employee_advance_request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          amount: numericAmount , // Nhân 1000 trước khi gửi
          reason: reason.trim(),
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Thành công', 'Yêu cầu ứng tiền đã được gửi.');
        setModalVisible(false);
        setReason('');
      } else {
        Alert.alert('Lỗi', data.error || 'Gửi yêu cầu thất bại.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu, vui lòng thử lại.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>Nhập số tiền cần ứng (VNĐ)</Text>
      <TextInput
        style={[styles.input, styles.amountDisplay]}
        value={inputAmount}
        onChangeText={handleInputChange}
        placeholder="0"
        keyboardType="numeric"
      />
      <View style={styles.amountContainer}>
        {amounts.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.amountBox, selectedAmount === amount && styles.selectedAmountBox]}
            onPress={() => handleAmountPress(amount)}
          >
            <Text style={[styles.amountText, selectedAmount === amount && styles.selectedAmountText]}>
              {amount.toLocaleString('vi-VN')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>

      {/* Modal nhập lý do */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập lý do bạn muốn ứng tiền</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Hãy nhập lý do bạn muốn ứng tiền"
              value={reason}
              onChangeText={setReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRequest}>
                <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  amountContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  amountBox: {
    width: '45%',
    height: 80,
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAmountBox: { borderColor: 'red' },
  amountText: { fontSize: 18, color: '#000' },
  selectedAmountText: { color: 'red' },
  inputLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  input: { height: 70, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, fontSize: 24, marginBottom: 16 },
  amountDisplay: { fontSize: 32, fontWeight: 'bold', color: 'red', marginBottom: 16 },
  confirmButton: {
    marginTop: 17,
    backgroundColor: 'red',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 60,
  },
  confirmButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  // Modal styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, fontSize: 16, marginBottom: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: 'gray', padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
  cancelButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  submitButton: { backgroundColor: 'red', padding: 10, borderRadius: 5, flex: 1 },
  submitButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});

export default AmountSelectionScreen;
