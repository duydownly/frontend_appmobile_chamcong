import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
const AmountSelectionScreen = () => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [inputAmount, setInputAmount] = useState(selectedAmount.toString());

  const amounts = [200000, 300000, 500000, 1000000, 2000000, 5000000];

  const handleAmountPress = (amount) => {
    setSelectedAmount(amount);
    setInputAmount(amount.toLocaleString('vi-VN'));
  };

  const formatNumberWithCommas = (number) => {
    const parsedNumber = parseFloat(number.replace(/,/g, ''));
    return isNaN(parsedNumber) ? '' : parsedNumber.toLocaleString('vi-VN');
  };

  const handleInputChange = (text) => {
    // Remove non-numeric characters except commas
    const sanitizedText = text.replace(/[^0-9]/g, '');
    setInputAmount(formatNumberWithCommas(sanitizedText));
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
      
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  amountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
   amountBox: {
    width: '45%',  // Increase width to make the box larger
    height: 80,   // Set height to match the width to create a square
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',  // Center the content vertically
  },
  selectedAmountBox: {
    borderColor: 'red',
  },
  amountText: {
    fontSize: 18,  // Increase font size for better readability
    color: '#000',
  },
  selectedAmountText: {
    color: 'red',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 70, // Increased height to make the input larger
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 24, // Increased font size
    marginBottom: 16,
  },
  amountDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 16,
  },
confirmButton: {
  marginTop:17,
  backgroundColor: 'red',
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center', // Center the text vertically
  alignSelf: 'center', // Center the button horizontally
  width: '100%',  // Increase width to make the button larger
  height: 162,   // Set height to 100
  borderRadius:10,
},
confirmButtonText: {
  color: '#fff',
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center', // Ensure the text is centered
},
});

export default AmountSelectionScreen;
