import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // You can also directly fetch notifications from NotificationTags if needed.

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % 5); // Update to match the number of notifications in NotificationTags
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationPress = () => {
    navigation.navigate('NotificationTags'); // No need to pass notifications as they're inside NotificationTags
  };

  const renderNotification = () => {
    // Example static notification for display
    const notification = { description: 'Ungtien description...', time: '37m ago' };

    const truncatedDescription = notification.description.length > 20
      ? `${notification.description.slice(0, 20)}...`
      : notification.description;

    return (
      <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationContainer}>
        <Text style={styles.infoText}>Thông báo</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ứng tiền</Text>
        </View>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {truncatedDescription}
        </Text>
        <Text style={styles.time}>{notification.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {renderNotification()}
    </View>
  );
};


const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: '#000', // Add black border
    borderWidth: 1, // Border width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: 'auto', // Set width to auto to fill available space
  },
  titleContainer: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  time: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
    infoText: {
    fontSize: 16,
    marginVertical: 30,
    marginTop:-20,
     
  },
});

export default NotificationScreen;
