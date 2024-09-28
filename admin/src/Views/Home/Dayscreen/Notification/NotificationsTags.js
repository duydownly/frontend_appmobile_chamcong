import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationTags = ({ route, navigation }) => {
  const { notifications } = route.params;
  const [activeTab, setActiveTab] = React.useState('Notifications');
  const [notificationList, setNotificationList] = React.useState(notifications);
  const [history, setHistory] = React.useState([]);
  const [selectedNotification, setSelectedNotification] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [notificationStatus, setNotificationStatus] = React.useState('');

  const data = activeTab === 'Notifications' ? notificationList : history;

  const handleNotificationPress = (notification) => {
    if (activeTab === 'History') return; // Không cho phép nhấn vào thông báo trong History
    setSelectedNotification(notification);
    setIsModalVisible(true);
  };

  const updateNotificationStatus = (status) => {
    if (selectedNotification) {
      setNotificationList(notificationList.filter(item => item.id !== selectedNotification.id));
      setHistory([...history, { ...selectedNotification, status }]);
      setNotificationStatus(status); // Cập nhật trạng thái thông báo
      setSelectedNotification(null);
      setIsModalVisible(false);
      Alert.alert(status);
    }
  };

  const handleAccept = () => {
    updateNotificationStatus('Accepted');
  };

  const handleReject = () => {
    updateNotificationStatus('Rejected');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeIcon}>
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>
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
        {data.map((item) => {
          const title = item.id_ungtien ? 'Ứng tiền' : 'Attendance';
          const isHistory = activeTab === 'History';

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.notificationContainer, isHistory && styles.historyNotification]}
              onPress={() => handleNotificationPress(item)}
              disabled={isHistory} // Vô hiệu hóa nhấn vào thông báo trong History
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>
              <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                {item.description}
              </Text>
              <Text style={styles.time}>{item.time}</Text>
              {activeTab === 'History' && <Text style={styles.status}>{item.status}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedNotification && (
              <>
                <Text style={styles.modalTitle}>{selectedNotification.id_ungtien ? 'Ứng tiền' : 'Attendance'}</Text>
                <Text style={styles.modalDescription}>{selectedNotification.description}</Text>
                <Text style={styles.modalTime}>{selectedNotification.time}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={handleAccept} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleReject} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
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
    borderBottomColor: '#5e749e',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  scrollView: {
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
    backgroundColor: '#5e749e',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotificationTags;
