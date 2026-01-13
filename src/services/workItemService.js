import axiosInstance from './axiosInstance';
import projectContext from './projectContext';

function ensureActiveProject(providedId) {
  const active = projectContext.getActiveProjectId();
  if (!active) throw new Error('No active project set');
  if (providedId && providedId !== active) throw new Error('projectId mismatch with active project');
  return active;
}

export const createWorkItem = async (projectId, workItemData) => {
  try {
    const active = ensureActiveProject(projectId);
    const response = await axiosInstance.post(
      `/projects/${active}/workitems`,
      workItemData,
      {
        headers: { 'x-project-id': active },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create work item:', error);
    throw error;
  }
};

export const fetchWorkItems = async (projectId, filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const active = ensureActiveProject(projectId);
    const response = await axiosInstance.get(
      `/projects/${active}/workitems${params ? '?' + params : ''}`,
      {
        headers: { 'x-project-id': active },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch work items:', error);
    throw error;
  }
};

export const updateWorkItem = async (projectId, workItemId, updates) => {
  try {
    const active = ensureActiveProject(projectId);
    const response = await axiosInstance.patch(
      `/projects/${active}/workitems/${workItemId}`,
      updates,
      {
        headers: { 'x-project-id': active },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update work item:', error);
    throw error;
  }
};

export const deleteWorkItem = async (projectId, workItemId) => {
  try {
    const active = ensureActiveProject(projectId);
    const response = await axiosInstance.delete(
      `/projects/${active}/workitems/${workItemId}`,
      {
        headers: { 'x-project-id': active },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete work item:', error);
    throw error;
  }
};
