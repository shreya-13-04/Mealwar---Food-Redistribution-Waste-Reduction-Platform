import React, { createContext, useContext, useState } from 'react';

const ListingsContext = createContext();

// Mock data for now - will connect to backend later
const mockListings = [
    {
        id: 1,
        foodName: 'Garden Fresh Tomatoes',
        foodType: 'fresh_produce',
        quantity: 10,
        unit: 'kg',
        redistributionMode: 'donation',
        hygieneStatus: 'excellent',
        preparationTime: 'immediate',
        description: 'Fresh organic tomatoes from our local community garden.',
        location: 'Downtown Community Center',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'active',
        imageUrl: '/food-images/fresh_vegetables_1770067863652.png'
    },
    {
        id: 2,
        foodName: 'Assorted Morning Pastries',
        foodType: 'bakery_item',
        quantity: 15,
        unit: 'pieces',
        redistributionMode: 'discounted',
        hygieneStatus: 'good',
        preparationTime: 'today',
        description: 'Mixed croissants and muffins baked early this morning.',
        location: 'Main Street Bakery',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        status: 'active',
        imageUrl: '/food-images/bread_bakery_1770067879302.png'
    },
    {
        id: 3,
        foodName: 'Vegetarian Biryani Bowls',
        foodType: 'prepared_meal',
        quantity: 20,
        unit: 'portions',
        redistributionMode: 'donation',
        hygieneStatus: 'excellent',
        preparationTime: '2hours',
        description: 'Nutritious vegetable biryani, perfectly packed and ready to eat.',
        location: 'City Kitchen',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago - EXPIRED
        status: 'expired',
        imageUrl: '/food-images/cooked_meals_1770067899735.png'
    }
];

export const ListingsProvider = ({ children }) => {
    const [listings, setListings] = useState(mockListings);

    const addListing = (newListing) => {
        setListings((prev) => [newListing, ...prev]);
    };

    return (
        <ListingsContext.Provider value={{ listings, setListings, addListing }}>
            {children}
        </ListingsContext.Provider>
    );
};

export const useListings = () => {
    const context = useContext(ListingsContext);
    if (!context) {
        throw new Error('useListings must be used within a ListingsProvider');
    }
    return context;
};
