import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationTags = ({ navigation }) => {
  const initialNotifications = [
    { id: '2', employee_id: 'E1', amount: 1000, status: 'Pending', create_date: '37m ago', description_reason: 'Ungtien description that exceeds the limit...' },
    { id: '4', employee_id: 'E1', amount: 2000, status: 'Pending', create_date: '1h ago', description_reason: 'Another ungtien description that is very long...' },
    { id: '6', employee_id: 'E1', amount: 3000, status: 'Pending', create_date: '3h ago', description_reason: 'Extra ungtien description for testing scrolling...' },
    { id: '8', employee_id: 'E1', amount: 4000, status: 'Pending', create_date: '5h ago', description_reason: 'More ungtien descriptions for scrolling test...' },
    { id: '10', employee_id: 'E1', amount: 5000, status: 'Pending', create_date: '7h ago', description_reason: 'Additional test ungtien description...' },
    { id: '12', employee_id: 'E1', amount: 6000, status: 'Accepted', create_date: '9h ago', description_reason: 'Accepted ungtien description for testing...' },
    { id: '14', employee_id: 'E1', amount: 7000, status: 'Rejected', create_date: '11h ago', description_reason: 'Rejected ungtien description with detailed reason...' },
    { id: '16', employee_id: 'E1', amount: 8000, status: 'Accepted', create_date: '13h ago', description_reason: 'Another accepted ungtien description for further testing...' },
    { id: '18', employee_id: 'E1', amount: 9000, status: 'Rejected', create_date: '15h ago', description_reason: 'Rejected ungtien description with more details...' },
    { id: '20', employee_id: 'E1', amount: 10000, status: 'Accepted', create_date: '17h ago', description_reason: 'Final accepted ungtien description for comprehensive testing...' },
    { id: '22', employee_id: 'E1', amount: 11000, status: 'Rejected', create_date: '19h ago', description_reason: 'Final rejected ungtien description with thorough explanation...' }
  ];

  const [activeTab, setActiveTab] = React.useState('Notifications');
  const [notificationList, setNotificationList] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [selectedNotification, setSelectedNotification] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  useEffect(() => {
    const loadNotificationsAndHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('history');
        if (storedHistory !== null) {
          setHistory(JSON.parse(storedHistory));
        } else {
          setHistory([]);
        }

        const storedNotifications = await AsyncStorage.getItem('notifications');
        if (storedNotifications !== null) {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotificationList(parsedNotifications);
          console.log('Loaded notifications:', parsedNotifications);
        } else {
          setNotificationList(initialNotifications);
          await AsyncStorage.setItem('notifications', JSON.stringify(initialNotifications));
          console.log('Initialized with initialNotifications:', initialNotifications);
        }
      } catch (error) {
        console.error('Failed to load notifications and history from storage', error);
      }
    };

    loadNotificationsAndHistory();
  }, []);

  const handleNotificationPress = async (notification) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);
  };

const handleCloseModal = async () => {
  if (selectedNotification) {
    // Only remove notifications with statuses other than 'Pending'
    if (selectedNotification.status !== 'Pending') {
      // Remove the notification from the notifications list
      const updatedNotificationList = notificationList.filter(item => item.id !== selectedNotification.id);
      setNotificationList(updatedNotificationList);

      try {
        await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotificationList));
        console.log('Updated notifications:', updatedNotificationList);
      } catch (error) {
        console.error('Failed to update notifications in storage', error);
      }

      // Move notification to history
      const updatedHistory = [...history, selectedNotification];
      setHistory(updatedHistory);

      try {
        await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
        console.log(`Notification ${selectedNotification.id} saved to history`);
      } catch (error) {
        console.error('Failed to save history to storage', error);
      }
    }

    // If the status is 'Pending', do nothing with the notification list or history
    // Simply close the modal and clear the selected notification
    setSelectedNotification(null);
    setIsModalVisible(false);
  }
};
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Notifications' && styles.activeTab]}
          onPress={() => setActiveTab('Notifications')}
        >
          <Text style={styles.tabText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'History' && styles.activeTab]}
          onPress={() => setActiveTab('History')}
        >
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>
<ScrollView style={styles.scrollView}>
  {activeTab === 'Notifications' ? (
    notificationList.map((item) => (
      <TouchableOpacity
        key={item.id}
        style={styles.notificationContainer}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ứng tiền</Text>
        </View>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {item.description_reason}
        </Text>
        <View style={styles.timeStatusContainer}>
          <Text style={styles.time}>{item.create_date}</Text>
          <Text style={[styles.status, item.status === 'Pending' ? styles.pendingStatus : item.status === 'Accepted' ? styles.acceptedStatus : styles.rejectedStatus]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    ))
  ) : (
    history.map((item) => (
      <TouchableOpacity
        key={item.id}
        style={[styles.notificationContainer, styles.historyNotification]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ứng tiền</Text>
        </View>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {item.description_reason}
        </Text>
        <View style={styles.timeStatusContainer}>
          <Text style={styles.time}>{item.create_date}</Text>
          <Text style={[styles.status, item.status === 'Pending' ? styles.pendingStatus : item.status === 'Accepted' ? styles.acceptedStatus : styles.rejectedStatus]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    ))
  )}
</ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedNotification && (
              <>
                <Text style={styles.modalTitle}>Ứng tiền</Text>
                <Text style={styles.modalDescription}>{selectedNotification.description_reason}</Text>
                <Text style={styles.modalTime}>{selectedNotification.create_date}</Text>
                <TouchableOpacity onPress={handleCloseModal} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  notificationContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: '100%',
    maxWidth: 350,
    overflow: 'hidden',
  },
  historyNotification: {
    backgroundColor: '#e0e0e0', // Đổi màu nền cho thông báo trong lịch sử để dễ phân biệt
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
  status: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    fontStyle: 'italic',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'red',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  scrollView: {
    width: '100%',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalTime: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotificationTags;
