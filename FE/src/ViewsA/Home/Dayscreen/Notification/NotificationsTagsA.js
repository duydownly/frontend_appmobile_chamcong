import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Alert, TextInput, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationTagsA = ({ route, navigation }) => {
  const { notifications } = route.params;

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

  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const initialNotifications = sortedNotifications.filter((item) => item.id && !item.is_viewed_by_admin);
  const initialHistory = sortedNotifications.filter((item) => item.is_viewed_by_admin);

  const [activeTab, setActiveTab] = React.useState('Notifications');
  const [notificationList, setNotificationList] = React.useState(initialNotifications);
  const [history, setHistory] = React.useState(initialHistory);
  const [selectedNotification, setSelectedNotification] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');

  const data = activeTab === 'Notifications' ? notificationList : history;

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);
  };

  const handleAccept = async () => {
    if (!selectedNotification) return;

    try {
      const response = await fetch('https://backendapperss.onrender.com/admin_accept_request', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedNotification.id }),
      });

      if (response.ok) {
        updateNotificationStatus('Accepted');
        Alert.alert('Thành công', 'Yêu cầu đã được chấp nhận.');
        navigation.navigate('Day'); // Chuyển hướng đến trang Day

      } else {
        Alert.alert('Lỗi', 'Không thể chấp nhận yêu cầu.');
      }
    } catch (error) {
      console.error('Lỗi khi chấp nhận yêu cầu:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chấp nhận yêu cầu.');
    }
  };

  const handleReject = () => {
    setIsModalVisible(false);
    setIsRejectModalVisible(true);
  };

  const confirmReject = async () => {
    if (!selectedNotification || !rejectionReason) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do từ chối.');
      return;
    }

    try {
      const response = await fetch('https://backendapperss.onrender.com/admin_reject_request', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedNotification.id,
          rejection_reason: rejectionReason,
        }),
      });

      if (response.ok) {
        updateNotificationStatus('Rejected');
        Alert.alert('Thành công', 'Yêu cầu đã bị từ chối.');
        setIsRejectModalVisible(false);
        navigation.navigate('HomeAdmin', { initialRouteName: 'Day' });

      } else {
        Alert.alert('Lỗi', 'Không thể từ chối yêu cầu.');
      }
    } catch (error) {
      console.error('Lỗi khi từ chối yêu cầu:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi từ chối yêu cầu.');
    }
  };

  const updateNotificationStatus = (status) => {
    if (selectedNotification) {
      const updatedNotification = {
        ...selectedNotification,
        status,
        rejection_reason: status === 'Rejected' ? rejectionReason : null,
      };

      setNotificationList(notificationList.filter((item) => item.id !== selectedNotification.id));
      setHistory([...history, updatedNotification]);
      setSelectedNotification(null);
      setIsModalVisible(false);
      setRejectionReason('');
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const closeRejectModal = () => {
    setIsRejectModalVisible(false);
    setRejectionReason('');
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
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.notificationContainer, activeTab === 'History' && styles.historyNotification]}
            onPress={() => handleNotificationPress(item)}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ứng tiền: {item.name}</Text>
              <Text style={styles.amount}>Số tiền: {item.amount} VND</Text>
            </View>
            <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
              Lý do: {item.reason}
            </Text>
            <Text style={styles.time}>Ngày tạo: {formatDate(item.created_at)}</Text>
            {activeTab === 'History' && (
              <>
                <Text style={styles.status}>
                  {item.status === 'Accepted' ? 'Đã chấp nhận' : item.status === 'Reject' ? 'Đã từ chối' : item.status}
                </Text>
                {item.status === 'Reject' && (
                  <Text style={styles.rejectionReason}>Lý do từ chối: {item.rejection_reason}</Text>
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal chi tiết */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {selectedNotification && (
                  <>
                    <Text style={styles.modalTitle}>Ứng tiền: {selectedNotification.name}</Text>
                    <Text style={styles.modalDescription}>Số tiền: {selectedNotification.amount} VND</Text>
                    <Text style={styles.modalDescription}>Lý do: {selectedNotification.reason}</Text>
                    <Text style={styles.modalDescription}>Lý do từ chối: {selectedNotification.rejection_reason}</Text>
                    <Text style={styles.modalTime}>Ngày tạo: {formatDate(selectedNotification.created_at)}</Text>
                    {activeTab === 'Notifications' && (
                      <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={handleAccept} style={styles.modalButton}>
                          <Text style={styles.modalButtonText}>Chấp nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleReject} style={[styles.modalButton, styles.cancelButton]}>
                          <Text style={styles.modalButtonText}>Từ chối</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal từ chối */}
      <Modal
        visible={isRejectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRejectModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập lý do từ chối</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Nhập lý do từ chối"
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={confirmReject} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeRejectModal} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#e0e0e0',
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
  amount: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
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
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reasonInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default NotificationTagsA;