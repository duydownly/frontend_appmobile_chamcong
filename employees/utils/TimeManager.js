// TimeManager.js
import moment from 'moment-timezone';

class TimeManager {
  constructor() {
    // Đặt múi giờ Việt Nam cho thời gian hiện tại
    this.currentTime = moment.tz('Asia/Ho_Chi_Minh');
    console.log('Initial Time (VN):', this.formatTime());
  }

  getCurrentTime() {
    return this.currentTime;
  }

  updateTime() {
    // Cập nhật lại thời gian với múi giờ Việt Nam
    this.currentTime = moment.tz('Asia/Ho_Chi_Minh');
    console.log('Updated Time (VN):', this.formatTime());
  }

  formatTime(format = 'YYYY-MM-DD HH:mm:ss') {
    return this.currentTime.format(format);
  }

  getCurrentVietnamTime() {
    return moment.tz('Asia/Ho_Chi_Minh');
  }
}

const timeManager = new TimeManager();
export default timeManager;
