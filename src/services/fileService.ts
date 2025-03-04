const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Analysis Failed. Too small pdf");
  }

  return response.json();
};