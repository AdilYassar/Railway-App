//import libraries



import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from '../utils/Navigation';
import { FC } from 'react';
import React from 'react';

import IntroductionScreen from '../screens/IntroductionScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SplashScreen from '../screens/SplashScreen';




const Stack = createNativeStackNavigator();

// create a component
const Navigation: FC = () => {
    return (
     
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName="SplashScreen" // Correct placement
                screenOptions={{
                    headerShown: false, // Correct placement and syntax
                }}
            >
                 <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="IntroductionScreen" component={IntroductionScreen} />
               
             
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
              








            </Stack.Navigator>
        </NavigationContainer>
  
    );
};

// define your styles

//make this component available to the app
export default Navigation;
