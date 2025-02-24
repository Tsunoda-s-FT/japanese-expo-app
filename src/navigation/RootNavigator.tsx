import React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Easing } from 'react-native';
import MainNavigator, { MainStackParamList } from './MainNavigator';
import SessionNavigator, { SessionStackParamList } from './SessionNavigator';
import { navigationTheme } from '../theme/theme';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Session: NavigatorScreenParams<SessionStackParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}>
        <RootStack.Screen name="Main" component={MainNavigator} />
        <RootStack.Screen
          name="Session"
          component={SessionNavigator}
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
