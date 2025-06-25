import React, { useEffect } from 'react';
import Routes from './src/routes';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_PLACES_API_KEY , GOOGLE_DIRECTION_API_KEY } from './src/Utilities/Config';

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_DIRECTION_API_KEY, // from Google Console
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Routes />
    </GestureHandlerRootView>
  );
}
