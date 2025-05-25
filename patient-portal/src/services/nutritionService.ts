import axios from 'axios';

class NutritionService {
  async downloadNutritionGuide(): Promise<void> {
    try {
      const response = await axios.get('/nutrition/guide/download', {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'hospital-nutrition-guide.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading nutrition guide:', error);
      throw new Error('Failed to download nutrition guide');
    }
  }

  async getNutritionTips(): Promise<any[]> {
    try {
      const response = await axios.get('/nutrition/tips');
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition tips:', error);
      return [];
    }
  }
}

export const nutritionService = new NutritionService();
export default nutritionService;