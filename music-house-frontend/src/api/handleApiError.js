

export const handleApiError = (error) => {
    throw error.response?.data;
  };