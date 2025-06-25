import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ask for permission
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

// Get FCM token
const getFcmToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  await AsyncStorage.setItem('FCMToken', token);
  // Save/send to backend if needed
};

// Background / Quit handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Foreground handler
export const setupNotificationListeners = () => {
  messaging().onMessage(async remoteMessage => {
    Alert.alert(remoteMessage.notification?.title || '', remoteMessage.notification?.body || '');
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background:', remoteMessage.notification);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from quit state by notification:', remoteMessage.notification);
      }
    });
};
