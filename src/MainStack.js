import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TurnSelectorScreen from './screens/TurnSelector';
import GameScreen from './screens/GameScreen';
import RulesScreen from './screens/RulesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TurnSelector" component={TurnSelectorScreen} options={{ title: 'Who Goes First?' }} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Rules" component={RulesScreen} />
      </Stack.Navigator>
  );
}