import axiosInstance from './axiosInstance';

const pipelineService = {
  // Create a new pipeline
  async createPipeline(projectId, pipelineData) {
    try {
      const response = await axiosInstance.post(`/pipelines`, {
        projectId,
        ...pipelineData,
      });
      return response.data.pipeline;
    } catch (error) {
      console.error('Error creating pipeline:', error);
      throw error;
    }
  },

  // Get all pipelines for a project
  async getPipelinesByProject(projectId) {
    try {
      const response = await axiosInstance.get(`/pipelines/${projectId}`);
      return response.data.pipelines;
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      throw error;
    }
  },

  // Get a single pipeline
  async getPipeline(pipelineId) {
    try {
      const response = await axiosInstance.get(`/pipelines/detail/${pipelineId}`);
      return response.data.pipeline;
    } catch (error) {
      console.error('Error fetching pipeline:', error);
      throw error;
    }
  },

  // Update a pipeline
  async updatePipeline(pipelineId, updateData) {
    try {
      const response = await axiosInstance.put(`/pipelines/${pipelineId}`, updateData);
      return response.data.pipeline;
    } catch (error) {
      console.error('Error updating pipeline:', error);
      throw error;
    }
  },

  // Delete a pipeline
  async deletePipeline(pipelineId) {
    try {
      const response = await axiosInstance.delete(`/pipelines/${pipelineId}`);
      return true;
    } catch (error) {
      console.error('Error deleting pipeline:', error);
      throw error;
    }
  },
};

export default pipelineService;
