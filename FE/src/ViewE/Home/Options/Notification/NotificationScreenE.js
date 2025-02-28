import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreenE = () => {
  const navigation = useNavigation();
  const [allNotifications, setAllNotifications] = useState([]);
  const [unviewedNotifications, setUnviewedNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

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

  // Hàm fetch thông báo
  const fetchNotifications = async () => {
    try {
      const employee_id = await AsyncStorage.getItem('employee_id') || '993543873203666945';
      const response = await fetch(
        `https://backendapperss.onrender.com/notificationemployeeadvance?employee_id=${employee_id}`
      );
      const data = await response.json();
      setAllNotifications(data);

      // Lọc thông báo chưa xem
      const unviewed = data.filter((item) => !item.is_viewed_by_employee);
      setUnviewedNotifications(unviewed);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Không thể tải thông báo');
    }
  };

  // Load lại khi màn hình focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  // Hiển thị thông báo luân phiên
  useEffect(() => {
    if (unviewedNotifications.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % unviewedNotifications.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [unviewedNotifications.length]);
  const handleNotificationPress = () => {
    navigation.navigate('NotificationTagsE', { notifications: allNotifications });
  };

  // Hàm chuyển đổi trạng thái sang tiếng Việt và trả về kiểu (style) tương ứng
  const getStatusTextAndStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return { text: 'Thành công', style: { color: 'white', fontWeight: 'bold',fontSize:25 } };
      case 'Reject':
        return { text: 'Từ chối', style: { color: 'white', fontWeight: 'bold',fontSize:25 } };
      case 'Pending':
        return { text: 'Đang xử lý', style: { color: 'white', fontWeight: 'normal' },fontSize:25 };
      default:
        return { text: status, style: { color: 'white', fontWeight: 'normal' } };
    }
  };

  // Hàm giới hạn độ dài văn bản
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const renderNotification = () => {
    if (unviewedNotifications.length === 0) {
      return (
        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationContainer}>
          <Text style={styles.infoText}>Thông báo</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chưa có thông báo</Text>
          </View>
        </TouchableOpacity>
      );
    }
  
    const notification = unviewedNotifications[currentIndex];
    if (!notification) {
      return (
        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationContainer}>
          <Text style={styles.infoText}>Thông báo</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Không có thông báo nào</Text>
          </View>
        </TouchableOpacity>
      );
    }
  
    const statusInfo = getStatusTextAndStyle(notification.status); // Lấy thông tin trạng thái
    const truncatedReason = truncateText(notification.reason, 20); // Giới hạn lý do
    const truncatedRejectionReason = truncateText(notification.rejection_reason || '', 15); // Giới hạn lý do từ chối
  
    return (
      <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationContainer}>
        <Text style={styles.infoText}>Thông báo</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ứng tiền: <Text style={statusInfo.style}>{statusInfo.text}</Text></Text>
          <Text style={styles.amount}>Số tiền: {notification.amount} VND</Text>
          <Text style={styles.reason}>Lý do: {truncatedReason}</Text>
          {/* Hiển thị lý do từ chối nếu trạng thái là "Từ chối" */}
          {notification.status === 'Reject' && (
            <Text style={styles.rejectionReason}>Lý do từ chối: {truncatedRejectionReason}</Text>
          )}
        </View>
        <Text style={styles.created_at}>Ngày tạo: {formatDate(notification.created_at)}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {error ? (
        <Text>{error}</Text>
      ) : unviewedNotifications.length > 0 ? (
        renderNotification()
      ) : (
        renderNotification()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: 'auto',
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
    color: '#fff', // Màu mặc định
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
    color: 'white', // Màu đỏ cho lý do từ chối
    marginTop: 5,
    fontStyle: 'italic', // In nghiêng
  },
  created_at: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 30,
    marginTop: -20,
  },
});

export default NotificationScreenE;