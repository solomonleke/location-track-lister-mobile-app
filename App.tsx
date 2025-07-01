import React, { useEffect } from 'react';
import Routes from './src/routes';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_PLACES_API_KEY , GOOGLE_DIRECTION_API_KEY } from './src/Utilities/Config';

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '105422903683-u49m4bgnemgn5bgabhobi78271buo1nu.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: '105422903683-064223qn9g0n30j55i36bnv9359bs3fb.apps.googleusercontent.com',
    });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Routes />
    </GestureHandlerRootView>
  );
}