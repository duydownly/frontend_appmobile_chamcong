import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library

const WeatherDetail = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/forecast?lat=21.0285&lon=105.8542&units=metric&lang=vi&appid=ddc3ad863082bac602f6c884b772afb1'
        );
        const data = await response.json();
        setWeatherData(data.list);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeatherData();
  }, []);

  const groupByDay = () => {
    const grouped = {};
    weatherData.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const findClosestToEightAM = (dayData) => {
    return dayData.reduce((closest, current) => {
      const currentTime = new Date(current.dt * 1000).getHours();
      if (currentTime === 8 || (currentTime < 8 && current.dt > closest.dt)) {
        return current;
      }
      return closest;
    }, dayData[0]);
  };

  const groupedData = groupByDay();
  const days = Object.keys(groupedData);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setModalVisible(true);
  };

  const renderDayItem = ({ item }) => {
    const closestToEightAM = findClosestToEightAM(groupedData[item]);
    return (
      <TouchableOpacity onPress={() => handleDaySelect(item)}>
        <View style={styles.dayItem}>
          <Text style={styles.dayText}>{item}</Text>
          <View style={styles.iconContainer}>
            <Icon name="thermometer" size={20} color="#000" />
            <Text>{closestToEightAM.main.temp}°C</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="weather-cloudy" size={20} color="#000" />
            <Text>{closestToEightAM.weather[0].description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHourlyDetail = ({ item }) => (
    <View style={styles.hourItem}>
      <View style={styles.iconContainer}>
        <Icon name="clock" size={20} color="#000" />
        <Text>{new Date(item.dt * 1000).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon name="thermometer" size={20} color="#000" />
        <Text>{item.main.temp}°C</Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon name="weather-cloudy" size={20} color="#000" />
        <Text>{item.weather[0].description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          data={days}
          renderItem={renderDayItem}
          keyExtractor={(item) => item}
        />
      </ScrollView>

      {selectedDay && (
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          transparent={true}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <ScrollView>
                    {groupedData[selectedDay].map((hourData, index) => (
                      <View key={index} style={styles.hourItem}>
                        <View style={styles.iconContainer}>
                          <Icon name="clock" size={20} color="#000" />
                          <Text>{new Date(hourData.dt * 1000).toLocaleTimeString()}</Text>
                        </View>
                        <View style={styles.iconContainer}>
                          <Icon name="thermometer" size={20} color="#000" />
                          <Text>{hourData.main.temp}°C</Text>
                        </View>
                        <View style={styles.iconContainer}>
                          <Icon name="weather-cloudy" size={20} color="#000" />
                          <Text>{hourData.weather[0].description}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0', // Set background color to white
  },
  dayItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
  },
  dayText: {
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim the background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff', // Modal content background color
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  hourItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },

});

export default WeatherDetail;
