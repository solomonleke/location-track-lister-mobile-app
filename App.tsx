import React from 'react';
import Routes from './src/routes';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
   return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Routes />
    </GestureHandlerRootView>
  );
}
