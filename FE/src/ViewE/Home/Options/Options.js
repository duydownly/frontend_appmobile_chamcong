import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import NotificationScreen from './Notification/NotificationScreenE'; // Adjust the import path as needed
import {useNavigation} from '@react-navigation/native'

export default function Employees() {
const navigation =useNavigation()
  const navigateToAmountSelection = () => {
    navigation.navigate('AmountSelectionScreen');
  };

  return (
    <View style={styles.container}>
    <View style={styles.notificationContainer}>
  <NotificationScreen />
</View>

      <TouchableOpacity style={styles.button} onPress={navigateToAmountSelection}>
        <Text style={styles.buttonText}>Ứng tiền</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Nộp tiền</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  button: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'red',
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



});
