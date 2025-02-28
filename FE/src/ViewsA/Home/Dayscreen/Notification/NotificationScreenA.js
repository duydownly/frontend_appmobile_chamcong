  import React, { useEffect, useState, useCallback } from 'react';
  import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
  import { useFocusEffect } from '@react-navigation/native';
  import BASE_URL from '../../../../Url'; // Điều chỉnh đường dẫn nếu cần
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const NotificationScreenA = ({ navigation }) => {
    const [allNotifications, setAllNotifications] = useState([]); // Lưu toàn bộ dữ liệu từ API
    const [unviewedNotifications, setUnviewedNotifications] = useState([]); // Lưu thông báo chưa xem
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

      if (diffDays === 0) {
        return 'Hôm nay';
      } else if (diffDays === 1) {
        return 'Hôm qua';
      } else if (diffDays === 2) {
        return 'Hôm kia';
      } else {
        return date.toLocaleDateString('vi-VN');
      }
    };

    // Hàm fetch dữ liệu từ API
    const fetchNotifications = async () => {
      try {
        const admin_id = await AsyncStorage.getItem('admin_id'); // Lấy admin_id từ AsyncStorage
        if (!admin_id) {
          setError('Không tìm thấy Admin ID');
          return;
      }
        const response = await fetch(
          `${BASE_URL}/notification_advance_admin?admin_id=${admin_id}`
        );
        const data = await response.json();

        // Lưu toàn bộ dữ liệu từ API
        setAllNotifications(data);

        // Lọc ra những thông báo chưa xem (is_viewed_by_admin === false)
        const unviewed = data.filter((item) => !item.is_viewed_by_admin);
        setUnviewedNotifications(unviewed);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to fetch notifications');
      }
    };

    // Sử dụng useFocusEffect để load lại dữ liệu khi màn hình được focus
    useFocusEffect(
      useCallback(() => {
        fetchNotifications();
      }, [])
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % unviewedNotifications.length);
      }, 5000);

      return () => clearInterval(interval);
    }, [unviewedNotifications.length]);

    const handleNotificationPress = () => {
      navigation.navigate('NotificationTagsA', {
        notifications: allNotifications, // Truyền toàn bộ dữ liệu cho màn hình History
      });
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
      const title = `Ứng tiền: ${notification.name}`;
      const truncatedDescription = notification.reason.length > 20
        ? `${notification.reason.slice(0, 20)}...`
        : notification.reason;

      return (
        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationContainer}>
          <Text style={styles.infoText}>Thông báo</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.amount}>Số tiền: {notification.amount} VND</Text>
          </View>
          <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
            Lý do : {truncatedDescription}
          </Text>
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
          renderNotification() // Hiển thị "Chưa có thông báo" khi không có thông báo chưa xem
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

  export default NotificationScreenA;