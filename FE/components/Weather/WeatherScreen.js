import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const WeatherScreen = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/forecast?lat=21.0285&lon=105.8542&units=metric&lang=vi&appid=ddc3ad863082bac602f6c884b772afb1'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Raw data:', data);

        const currentTime = new Date();
        const adjustedHour = (currentTime.getUTCHours() + 7) % 24;

        const filteredData = data.list.filter((item) => {
          const itemDate = new Date(item.dt * 1000);
          return itemDate.getUTCHours() === adjustedHour;
        });

        let finalData = filteredData;
        if (filteredData.length === 0) {
          console.log('No data for current hour, trying next available hour');
          const availableHours = [
            ...new Set(
              data.list.map((item) => new Date(item.dt * 1000).getUTCHours())
            ),
          ];
          const nextHour =
            availableHours.length > 0 ? availableHours[0] : adjustedHour;
          finalData = data.list.filter(
            (item) => new Date(item.dt * 1000).getUTCHours() === nextHour
          );
          if (finalData.length === 0) {
            setError('No data available for any hour');
            setLoading(false);
            return;
          }
        }

        setWeatherData(finalData);
        setLoading(false);

        const uniqueDates = getUniqueDates(finalData);
        if (uniqueDates.length > 0) {
          setCurrentDate(uniqueDates[0]);

          const interval = setInterval(() => {
            setCurrentDate((prevDate) => {
              const nextDate = getNextDate(prevDate, uniqueDates);
              return nextDate;
            });
          }, 5000);

          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getUniqueDates = (data) => {
    const uniqueDates = new Set();
    data.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('vi-VN');
      uniqueDates.add(date);
    });
    return [...uniqueDates];
  };

  const getNextDate = (currentDate, datesArray) => {
    const currentIndex = datesArray.indexOf(currentDate);
    return datesArray[(currentIndex + 1) % datesArray.length];
  };

  const getWeatherForDate = (date) => {
    return weatherData.filter(
      (item) => new Date(item.dt * 1000).toLocaleDateString('vi-VN') === date
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      </View>
    );
  }

  if (!weatherData.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Dữ liệu không khả dụng</Text>
      </View>
    );
  }

  const currentWeather = getWeatherForDate(currentDate);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('WeatherDetail', {
            weather: currentWeather,
          })
        }
        style={styles.weatherContainer}>
        <Text style={styles.infoText}>Thời tiết</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentDate}</Text>
        </View>
        {currentWeather.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.description}>
              <Icon name="clock-o" size={16} color="#555" />{' '}
              Thời gian:{' '}
              {new Date(item.dt * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={styles.description}>
              <Icon name="cloud" size={16} color="#555" />{' '}
              Tình trạng: {item.weather[0].description}
            </Text>
            <Text style={styles.description}>
              <Icon name="thermometer-half" size={16} color="#555" />{' '}
              Nhiệt độ: {item.main.temp}°C
            </Text>
            <Text style={styles.description}>
              <Icon name="tint" size={16} color="#555" />{' '}
              Độ ẩm: {item.main.humidity}%
            </Text>
          </View>
        ))}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
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
  infoText: {
    fontSize: 16,
    marginVertical: 30,
    marginTop: -20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default WeatherScreen;
