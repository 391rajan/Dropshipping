const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    // Fallback image if none is provided
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Handles both 'uploads/...' and just the filename
  const path = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
  return `${API_URL}/${path}`;
};

export default getImageUrl;