import React, { useState, createContext, useContext } from 'react';

const ColorContext = createContext();

export const useColorContext = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
    const [colors, setColors] = useState({
        theme: '#9D00FF',
        light: '#A9A9A9',
        white: '#FFFFFF',
        black: '#000000',
        gray: '#666666',
        darkGray: '#444444',
        lightGray: '#f8f8f8',
        borderGray: '#e0e0e0',
        sidebarBackground: '#222',
        iconColor: '#000',
        durationBackground: 'rgba(0, 0, 0, 0.7)',
        primary: '#9D00FF', 
        danger: '#FF3333',
        theme1: '#9D00FF',
        theme2: '#000000',
        theme3: '#FF3333',
        theme4: '#3357FF',
        theme5: '#FF33A1',
        theme6: '#0D7377',
        theme7: '#0F52BA',
        theme8: '#4ECCA3',
        theme9: '#1A8B9D',
        theme10: '#D8A7B1',
    });

    return (
        <ColorContext.Provider value={[colors, setColors]}>
            {children}
        </ColorContext.Provider>
    );
};
