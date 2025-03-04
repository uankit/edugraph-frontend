const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchGraphData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/graph?mode=all`);
    if (!response.ok) {
      throw new Error('Failed to fetch graph data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching graph data:', error);
    throw error;
  }
};

export const fetchSubtopics = async (topic: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/graph/subtopics?topic=${topic}`);
    if (!response.ok) {
      throw new Error('Failed to fetch subtopics');
    }
    const data = await response.json();
    return data.subtopics || [];
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    throw error;
  }
};