import 'react-native-gesture-handler'; // Importante para o Drawer funcionar corretamente
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawerNavigator from './src/navigation/DrawerNavigator';


export default function App() {
  return (
    <NavigationContainer>
      <AppDrawerNavigator />
    </NavigationContainer>
  );
}