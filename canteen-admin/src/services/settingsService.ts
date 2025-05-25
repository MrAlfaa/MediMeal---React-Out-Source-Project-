import axios from 'axios';

export interface SystemSettings {
  appName: string;
  hospitalName: string;
  contactEmail: string;
  deliveryFee: number;
  taxRate: number;
  orderTimeLimit: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  orderAlerts: boolean;
  dailyReports: boolean;
  systemUpdates: boolean;
  smsNotifications: boolean;
}

class SettingsService {
  private baseURL = '/admin/settings';

  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const response = await axios.get(`${this.baseURL}/system`);
      return response.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  async updateSystemSettings(settings: SystemSettings): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/system`, settings);
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await axios.get(`${this.baseURL}/notifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/notifications`, settings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/change-password`, {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async exportData(type: string): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/export/${type}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async createBackup(): Promise<void> {
    try {
      const response = await axios.post(`${this.baseURL}/backup`);
      return response.data;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  async cleanupDatabase(): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/cleanup`);
    } catch (error) {
      console.error('Error cleaning up database:', error);
      throw error;
    }
  }

  async getAccessLogs(limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/access-logs?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching access logs:', error);
      return [];
    }
  }
}

export const settingsService = new SettingsService();
export default settingsService;