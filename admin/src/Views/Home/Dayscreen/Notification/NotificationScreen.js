import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    { id: '1', id_attendance: 'A1', id_ungtien: null, description: 'Attendance description that is quite long...', time: '33m ago' },
    { id: '2', id_attendance: null, id_ungtien: 'U1', description: 'Ungtien description that exceeds the limit...', time: '37m ago' },
    { id: '3', id_attendance: 'A2', id_ungtien: null, description: 'Another attendance description...', time: '57m ago' },
    { id: '4', id_attendance: null, id_ungtien: 'U2', description: 'Another ungtien description that is very long...', time: '1h ago' },
    { id: '5', id_attendance: 'A3', id_ungtien: null, description: 'Extra attendance description for testing scrolling..ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss.', time: '2h ago' },
    { id: '6', id_attendance: null, id_ungtien: 'U3', description: 'Extra ungtien description for testing scrolling...', time: '3h ago' },
    { id: '7', id_attendance: 'A4', id_ungtien: null, description: 'More attendance descriptions to check scrolling functionality...', time: '4h ago' },
    { id: '8', id_attendance: null, id_ungtien: 'U4', description: 'More ungtien descriptions for scrolling test...', time: '5h ago' },
    { id: '9', id_attendance: 'A5', id_ungtien: null, description: 'Additional test description for scrolling...', time: '6h ago' },
    { id: '10', id_attendance: null, id_ungtien: 'U5', description: 'Additional test ungtien description...', time: '7h ago' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % notifications.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [notifications.length]);

  const handleNotificationPress = () => {
    navigation.navigate('NotificationTags', {
      notifications,
    });
  };

  const renderNotification = () => {
    const notification = notifications[currentIndex];
    const title = notification.id_ungtien ? 'Ứng tiền' : 'Attendance';
    const truncatedDescription = notification.description.length > 20
      ? `${notification.description.slice(0, 20)}...`
      : notification.description;

    return (
      <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationContainer}>
            <Text style={styles.infoText}>Thông báo</Text>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
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
      {notifications.length > 0 ? renderNotification() : <Text>No notifications left.</Text>}
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
    backgroundColor: '#5e749e',
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
