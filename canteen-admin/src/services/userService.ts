import axios from 'axios';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin' | 'patient';
  wardNumber: string;
  bedNumber: string;
  patientId: string;
  contactNumber: string;
  dietaryRestrictions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  usersByRole: Array<{ _id: string; count: number }>;
}

class UserService {
  private baseURL = '/admin/users';

  async getAllUsers(filters?: { role?: string; limit?: number; page?: number; search?: string }) {
    try {
      const params = new URLSearchParams();
      if (filters?.role) params.append('role', filters.role);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await axios.get(`${this.baseURL}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return default structure to prevent crashes
      return {
        users: [],
        totalUsers: 0,
        totalPages: 0,
        currentPage: 1
      };
    }
  }

  async getUserById(id: string) {
    try {
      const response = await axios.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(userData: Partial<User>) {
    try {
      const response = await axios.post(this.baseURL, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>) {
    try {
      const response = await axios.put(`${this.baseURL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const response = await axios.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await axios.get(`${this.baseURL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Return default stats to prevent crashes
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersToday: 0,
        usersByRole: []
      };
    }
  }

  async toggleUserStatus(id: string, isActive: boolean) {
    try {
      const response = await axios.patch(`${this.baseURL}/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;