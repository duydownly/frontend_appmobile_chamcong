import { StyleSheet, Dimensions } from 'react-native';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 100;
const BUTTON_HEIGHT = 80;
const SWIPEABLE_DIMENSIONS = 69;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative', // Thêm thuộc tính này để đảm bảo checkInButtonContainer có thể đặt ở cuối trang
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
        marginTop :50,

  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  employeeId: {
    fontSize: 16,
    color: '#888',
  },
  statusContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  checkInOutContainer: {
    alignItems: 'center',
    width: '45%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
        marginBottom: Platform.OS === 'ios' ? 10 : 20,

  },
  timeTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
        fontWeight: '1000', // Use fontWeight instead of size

  },
  time: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500', // Use fontWeight instead of size
        marginBottom: 5,

  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  date: {
    fontSize: 16,
    color: '#f00',
  },
  timeText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  checkInButtonContainer: {
    position: 'absolute',
    bottom: 40, // Dịch lên trên 40 pixel, bạn có thể điều chỉnh giá trị này
    right: 20,  // Dịch sang phải 20 pixel, bạn có thể điều chỉnh giá trị này
    alignItems: 'center',
  },
  swipeButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: 'red',
    borderRadius: 90,
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginBottom: 30, // Thêm dòng này
    alignSelf: 'center', // Căn giữa theo chiều ngang
    transform: [{ translateX: -7 }], // Dịch sang bên trái 20 đơn vị

  },
  swipeable: {
    width: SWIPEABLE_DIMENSIONS,
    height: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
  },
  swipeText: {
    fontSize: 200,
    color: 'red',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginLeft:35,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffff', // Màu nền của container
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTextLarge: {
    fontSize: 28, // Cỡ chữ lớn
    textAlign: 'center', // Căn giữa theo chiều ngang
    marginBottom: 10, // Khoảng cách dưới bottom
  },
  employeeIdLarge: {
    fontSize: 24, // Cỡ chữ lớn hơn
    textAlign: 'center', // Căn giữa theo chiều ngang
  },
   switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  switchText: {
    fontSize: 16,
  },
  switch: {
    marginLeft: 10,
  },
  boldText: {
    fontWeight: 'bold',
        marginLeft: 28, // hoặc giá trị pixel mà bạn muốn
    fontSize : 20,
  },
  largeRedText: {
    fontSize: 3 * 16, // 3 times the default font size
    color: 'red',
    textAlign: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  content: {
    fontSize: 18,
    marginRight: 10,
  },
  containerss: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  calendarContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',

  },
  headerss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
        marginTop: 70,

  },
  navButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekday: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // Adjusted width to fit 7 columns
    aspectRatio: 1, // Ensure the cell is square
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Adjust margin as needed
    padding: 8, // Adjust padding as needed
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dayText: {
    fontSize: 16,
  },
});

export default styles;
