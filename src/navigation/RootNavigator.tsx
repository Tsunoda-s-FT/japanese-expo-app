import React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator, { MainStackParamList } from './MainNavigator';
import SessionNavigator, { SessionStackParamList } from './SessionNavigator';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Session: NavigatorScreenParams<SessionStackParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainNavigator} />
        <RootStack.Screen name="Session" component={SessionNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
