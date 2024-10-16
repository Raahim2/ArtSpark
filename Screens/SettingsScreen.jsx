import React, { useState , useRef } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, ScrollView, TouchableOpacity , Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BottomNavigation from '../Components/BottomNavigation';
import UpperNavigation from '../Components/UpperNavigation';
import SideBar from '../Components/SideBar';
import { useColorContext } from '../assets/Variables/colors';
import { Ionicons } from '@expo/vector-icons';


const FoldableSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [colors] = useColorContext();
    const styles = createStyles(colors);
    return (
        <View style={styles.foldableContainer}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.headerContainer}>
                <Text style={styles.subHeader}>{title}</Text>
                <Ionicons name={isOpen ? 'chevron-down' : 'chevron-up'} size={24} color={colors.white} />
            </TouchableOpacity>
            {isOpen && <View style={styles.contentContainer}>{children}</View>}
        </View>
    );
};

const SettingsScreen = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarAnimation = useRef(new Animated.Value(0)).current;
    const [appTheme, setAppTheme] = useState('Light');
    const [language, setLanguage] = useState('English');
    const [watermark, setWatermark] = useState(false);
    const [colors, setColors] = useColorContext();
    const styles = createStyles(colors);
    const [selectedColor, setSelectedColor] = useState(colors.theme);


    const colorOptions = [
        { label: 'Theme 1', value: colors.theme1 },
        { label: 'Theme 2', value: colors.theme2 },
        { label: 'Theme 3', value: colors.theme3 },
        { label: 'Theme 4', value: colors.theme4 },
        { label: 'Theme 5', value: colors.theme5 },
        { label: 'Theme 6', value: colors.theme6 },
        { label: 'Theme 7', value: colors.theme7 },
        { label: 'Theme 8', value: colors.theme8 },
        { label: 'Theme 9', value: colors.theme9 },
        { label: 'Theme 10', value: colors.theme10 },
    ];

    const toggleSidebar = () => {
      const toValue = isSidebarOpen ? 0 : 1;
      Animated.timing(sidebarAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSidebarOpen(!isSidebarOpen);
    };

    const handleColorOptionPress = (color) => {
        setSelectedColor(color);
        setColors((prevColors) => ({
            ...prevColors,
            theme: color,
        }));
    };

    
    

    return (
        <>
            <UpperNavigation toggleSidebar={toggleSidebar} title={"Settings"} />
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

            <ScrollView style={styles.container}>
                <FoldableSection title="Customization Options">
                    <Text style={styles.optionLabel}>App Theme:</Text>
                    <View style={styles.colorOptionsContainer}>
                        {colorOptions.map((colorOption, index) => (
                            <React.Fragment key={colorOption.value}>
                                <TouchableOpacity
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: colorOption.value },
                                        selectedColor === colorOption.value && styles.selectedColorOption,
                                    ]}
                                    onPress={() => handleColorOptionPress(colorOption.value)}
                                />
                                {(index + 1) % 5 === 0 && <View style={{ flexBasis: '100%', height: 0 }} />} 
                            </React.Fragment>
                        ))}
                    </View>
                    <Text style={styles.optionLabel}>Language Settings:</Text>
                    <Picker
                        selectedValue={language}
                        onValueChange={(itemValue) => setLanguage(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="English" value="English" />
                        <Picker.Item label="Spanish" value="Spanish" />
                        <Picker.Item label="French" value="French" />
                    </Picker>
                    <View style={styles.watermarkContainer}>
                        <Text style={styles.optionLabel}>Watermark:</Text>
                        <Switch value={watermark} onValueChange={(value) => setWatermark(value)} />
                    </View>
                </FoldableSection>

               

               
            </ScrollView>

     
            <BottomNavigation target="Settings" />


        </>
    );
};

const createStyles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.lightGray,
        padding: 20,
        flex: 1,
    },
    foldableContainer: {
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: colors.white, // Use white background for better contrast
        elevation: 3, // Adds shadow on Android
        shadowColor: colors.black, // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.theme, // Highlight header with primary color
    },
    subHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
    },
    contentContainer: {
        padding: 15,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
        color: colors.text, // Use the defined text color
    },
    picker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.borderGray,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    watermarkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    colorOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.borderGray,
        margin: 5,
    },
    selectedColorOption: {
        borderColor: colors.theme,
        borderWidth: 3,
    },
});

export default SettingsScreen;
