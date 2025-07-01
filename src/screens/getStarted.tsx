import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleLogo, GooglePodcastsLogo } from 'phosphor-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { requestUserPermission, setupNotificationListeners } from '../Utilities/firebase';
import { GoogleLoginApi } from '../Utilities/ApiCalls';

const { width } = Dimensions.get('window');

export default function GetStarted() {
	const navigation = useNavigation<any>();
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
      GoogleSignin.configure({
        webClientId: '105422903683-u49m4bgnemgn5bgabhobi78271buo1nu.apps.googleusercontent.com',
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
        iosClientId: '105422903683-064223qn9g0n30j55i36bnv9359bs3fb.apps.googleusercontent.com',
      });
  }, []);
  

 const handleGoogleLogin = async () => {
  const fcmtoken = await AsyncStorage.getItem('FCMToken');
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('userInfo:', userInfo.data);
    const idToken = userInfo.data?.idToken;
    const tokens = await GoogleSignin.getTokens();
    const accessToken = tokens.accessToken;
    console.log(idToken,'idToken');
    console.log(accessToken,'accessToken');
    let result = await GoogleLoginApi({
      accessToken: accessToken,
      deviceId: fcmtoken,
    });
    console.log(result,'yui')
    if (result.data.status === 200) {
      setLoading(false);
      const token = result.data.accessToken;
      await AsyncStorage.setItem('accessToken', token);
      navigation.navigate('Main');
    }
  } catch (error) {
    console.error('Google Sign-In error:', error);
    setLoading(false);
    Alert.alert(JSON.stringify(error.message));
    await GoogleSignin.signOut(); 
  }
};

useEffect(() => {
  requestUserPermission();
  setupNotificationListeners();
}, []);
  return (
    <SafeAreaView style={{flex:1}}>
    <LinearGradient colors={['#e4fce8','#e5fdf4','#112642']} style={styles.container}>
      <Animated.Image
        source={require('../assets/bg2.png')} // make sure this image exists
        style={styles.image}
        entering={FadeInUp.duration(700).delay(100)}
      />

      <View style={styles.bottomSheet}>
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <Text style={styles.title}>It's Go Time</Text>
          <Text style={styles.description}>
            From yoga to outdoor running to gym workouts. No peakForm equipment required.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.buttonGroup}>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <GoogleLogo size={24} weight="bold" color="#000" />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> navigation.navigate('login')} style={styles.appleButton}>
            <GooglePodcastsLogo size={24} weight="bold" color="#fff" />
            <Text style={styles.appleText}>Sign in with Auth</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <TouchableOpacity onPress={()=> navigation.navigate("signup")}>
          <Text style={styles.footerText}>
            {/* Already have an Account{' '} */}
             Don't have an Account{' '}
            <Text style={styles.signInLink}>Sign up</Text>
          </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient></SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    width: width * 0.8,
    // height: 500,
    resizeMode: 'contain',
    position: 'absolute',
    top: "2%",
    alignItems:'center',
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },
  buttonGroup: {
    marginTop: 24,
    gap: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  googleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#36454F',
    paddingVertical: 12,
    borderRadius: 30,
  },
  appleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    marginTop: 24,
  },
  signInLink: {
    color: '#16a34a',
    fontWeight: '600',
  },
});
