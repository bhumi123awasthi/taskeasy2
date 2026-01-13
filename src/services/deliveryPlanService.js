import axiosInstance from './axiosInstance';

export const deliveryPlanService = {
  // Get all delivery plans for a project
  getAllPlans: async (projectId) => {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/delivery-plans`
      );
      return response.data.plans;
    } catch (error) {
      console.error('Error fetching delivery plans:', error);
      throw error;
    }
  },

  // Get single delivery plan
  getPlan: async (projectId, planId) => {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/delivery-plans/${planId}`
      );
      return response.data.plan;
    } catch (error) {
      console.error('Error fetching delivery plan:', error);
      throw error;
    }
  },

  // Create a new delivery plan
  createPlan: async (projectId, planData) => {
    try {
      const response = await axiosInstance.post(
        `/projects/${projectId}/delivery-plans`,
        planData
      );
      return response.data.plan;
    } catch (error) {
      console.error('Error creating delivery plan:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Update delivery plan
  updatePlan: async (projectId, planId, planData) => {
    try {
      const response = await axiosInstance.patch(
        `/projects/${projectId}/delivery-plans/${planId}`,
        planData
      );
      return response.data.plan;
    } catch (error) {
      console.error('Error updating delivery plan:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Delete delivery plan
  deletePlan: async (projectId, planId) => {
    try {
      const response = await axiosInstance.delete(
        `/projects/${projectId}/delivery-plans/${planId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting delivery plan:', error);
      throw error;
    }
  },
};
