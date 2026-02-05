import axiosInstance from './axiosInstance';

export const getProducts = async () => {
    try {
        const response = await axiosInstance.get('/Products');
        return response.data;
    } catch (error) {
        console.error("Error occurred while fetching products:", error);
        throw error;
    }
};