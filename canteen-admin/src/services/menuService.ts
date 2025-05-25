import axios from 'axios';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  dietaryInfo: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    isNutFree: boolean;
  };
  isAvailable: boolean;
  orderCount?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

class MenuService {
  private baseURL = '/menu'; // Remove /api prefix

  async getAllMenuItems(filters?: { category?: string; search?: string; available?: boolean }) {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.available !== undefined) params.append('available', filters.available.toString());

      const response = await axios.get(`${this.baseURL}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }

  async getMenuItemById(id: string) {
    try {
      const response = await axios.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  }

  async createMenuItem(menuItemData: FormData) {
    try {
      const response = await axios.post(this.baseURL, menuItemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  }

  async updateMenuItem(id: string, menuItemData: FormData) {
    try {
      const response = await axios.put(`${this.baseURL}/${id}`, menuItemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  async deleteMenuItem(id: string) {
    try {
      const response = await axios.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await axios.get(`${this.baseURL}/categories/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
export default menuService;