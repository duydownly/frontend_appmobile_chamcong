import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationTagsE = ({ route, navigation }) => {
  const { notifications } = route.params;
  const [activeTab, setActiveTab] = useState('Notifications');
  const [notificationList, setNotificationList] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays === 2) return 'Hôm kia';
    return date.toLocaleDateString('vi-VN');
  };

  // Hàm chuyển đổi trạng thái sang tiếng Việt và trả về kiểu (style) tương ứng
  const getStatusTextAndStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return { text: 'Thành công', style: { color: 'white', fontWeight: 'bold', fontSize: 20 } };
      case 'Reject':
        return { text: 'Từ chối', style: { color: 'white', fontWeight: 'bold', fontSize: 20 } };
      case 'Pending':
        return { text: 'Đang xử lý', style: { color: 'white', fontWeight: 'normal', fontSize: 20 } };
      default:
        return { text: status, style: { color: 'white', fontWeight: 'normal', fontSize: 20 } };
    }
  };

  // Lọc thông báo chưa xem và đã xem
  useEffect(() => {
    const unviewed = notifications.filter((item) => !item.is_viewed_by_employee);
    const viewed = notifications.filter((item) => item.is_viewed_by_employee);
    setNotificationList(unviewed);
    setHistory(viewed);
  }, [notifications]);

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);

    // Chỉ cập nhật trạng thái nếu thông báo thuộc tab Notifications và status không phải là Pending
    if (activeTab === 'Notifications' && notification.status !== 'Pending') {
      updateNotificationStatus(notification.id);
    }
  };

  const updateNotificationStatus = async (id) => {
    try {
      const response = await fetch('https://backendapperss.onrender.com/notificationemployeeadvanceview', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id.toString() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification status');
      }

      const data = await response.json();
      console.log('Notification status updated:', data);
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const handleCloseModal = async () => {
    if (selectedNotification && activeTab === 'Notifications') {
      // Chỉ cập nhật và lưu trữ nếu status không phải là Pending
      if (selectedNotification.status !== 'Pending') {
        // Gọi API để cập nhật trạng thái
        await updateNotificationStatus(selectedNotification.id);

        // Cập nhật trạng thái đã xem trong ứng dụng
        const updatedNotificationList = notificationList.map((item) =>
          item.id === selectedNotification.id ? { ...item, is_viewed_by_employee: true } : item
        );
        setNotificationList(updatedNotificationList.filter((item) => !item.is_viewed_by_employee));
        setHistory([...history, { ...selectedNotification, is_viewed_by_employee: true }]);

        // Lưu vào AsyncStorage (nếu cần)
        await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotificationList));
        await AsyncStorage.setItem('history', JSON.stringify([...history, selectedNotification]));
      } else {
        // Nếu status là Pending, không làm gì cả, giữ nguyên thông báo trong Notification
        console.log('Notification with Pending status remains unchanged.');
      }
    }
    setIsModalVisible(false);
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
        {(activeTab === 'Notifications' ? notificationList : history).map((item) => {
          const statusInfo = getStatusTextAndStyle(item.status);
          const truncatedReason = item.reason.length > 20 ? `${item.reason.slice(0, 20)}...` : item.reason;
          const truncatedRejectionReason = item.rejection_reason
            ? item.rejection_reason.length > 15
              ? `${item.rejection_reason.slice(0, 15)}...`
              : item.rejection_reason
            : '';

          return (
            <TouchableOpacity
              key={item.id} // Đảm bảo key là duy nhất
              style={[styles.notificationContainer, activeTab === 'History' && styles.historyNotification]}
              onPress={() => handleNotificationPress(item)}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  Ứng tiền: <Text style={statusInfo.style}>{statusInfo.text}</Text>
                </Text>
                <Text style={styles.amount}>Số tiền: {item.amount} VND</Text>
                <Text style={styles.reason}>Lý do: {truncatedReason}</Text>
                {item.status === 'Reject' && (
                  <Text style={styles.rejectionReason}>Lý do từ chối: {truncatedRejectionReason}</Text>
                )}
              </View>
              <Text style={styles.created_at}>Ngày tạo: {formatDate(item.created_at)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {selectedNotification && (
                  <>
                    <Text style={styles.modalTitle}>Ứng tiền: {getStatusTextAndStyle(selectedNotification.status).text}</Text>
                    <Text style={styles.modalDescription}>Số tiền: {selectedNotification.amount} VND</Text>
                    <Text style={styles.modalDescription}>Lý do: {selectedNotification.reason}</Text>
                    {selectedNotification.status === 'Reject' && (
                      <Text style={styles.modalDescription}>Lý do từ chối: {selectedNotification.rejection_reason}</Text>
                    )}
                    <Text style={styles.modalTime}>Ngày tạo: {formatDate(selectedNotification.created_at)}</Text>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
    backgroundColor: '#e0e0e0',
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
  amount: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  reason: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  rejectionReason: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    fontStyle: 'italic',
  },
  created_at: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
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
});

export default NotificationTagsE;