import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelectRoll = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn Vai Trò</Text>
      
      <TouchableOpacity 
        style={styles.buttonAdmin} 
        onPress={() => navigation.navigate('LoginAdmin')}
      >
        <Text style={styles.buttonText}>Quản lý</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.buttonEmployee} 
        onPress={() => navigation.navigate('LoginEmployee')}
      >
        <Text style={styles.buttonText}>Thợ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonAdmin: {
    width: '90%',
    padding: 95,
    backgroundColor: '#5e749e',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 50,
  },
  buttonEmployee: {
    width: '90%',
    padding: 95,
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SelectRoll;
