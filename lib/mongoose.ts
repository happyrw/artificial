import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    mongoose.set('strictQuery', true,);

    if (!process.env.MONGODB_URL) {
        console.log('MONGODB_URL not found');
        return;
    };

    if (isConnected) {
        console.log('Already connected to MongoDB');
        return;
    };

    try {
        await mongoose.connect(process.env.MONGODB_URL)
            .then(() => console.log('MongoDB connected successfully'))
            .catch(err => console.log('MongoDB connection error:', err));
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('MongoDB connection error');
    }
};
