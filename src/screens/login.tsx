import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { AppleLogo, LockKeyOpen, LockKey, LockOpen, Lock, Eye, EyeSlash} from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginApi } from '../Utilities/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');

export default function UsernameScreen({ navigation }) {
	React.useLayoutEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [navigation]);
  const scaleFont = (size) => size * (width / 375); // scale to iPhone 11 width baseline

  //const [username, setUsername] = useState('francisdaniel140@gmail.com');
  //const [password, setPassword] = useState('francis1@male');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('username');
  const [Loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const navigation = useNavigation();

  const usernameOffset = useSharedValue(0);
  const passwordOffset = useSharedValue(width);

  const usernameAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: usernameOffset.value }],
    opacity: withTiming(step === 'username' ? 1 : 0),
  }));

  const passwordAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: passwordOffset.value }],
    opacity: step === 'password' ? 1 : 0,
  }));


// const token = await AsyncStorage.getItem('accessToken');
// console.log("Access Token:", token);


  const handleContinue = async () => {
    const fcmtoken = await AsyncStorage.getItem('FCMToken');
    if (step === 'username') {
      // const valid = /^[a-zA-Z0-9]{3,15}$/.test(username);
      // if (!valid) {
      //   Alert.alert('Invalid Username', '3-15 characters. Cannot include special characters.');
      //   return;
      // }
      usernameOffset.value = withTiming(-width);
      passwordOffset.value = withTiming(0);
      setStep('password');
    } else if (step === 'password') {
      if (password.length < 6) {
        Alert.alert('Weak Password', 'Password should be at least 6 characters.');
        return;
      }
      setLoading(true)
      if (username === "" || password === "") {
          Alert.alert("Please make sure all input fields are filled")
          return
      }
      try {
        let result = await LoginApi({
            email: username,
            password: password,
            deviceId: fcmtoken,
        })
        if (result.data.status === 200) {
          setLoading(false)
          console.log(result.data)
           const token = result.data.accessToken;
          // ✅ Save token to AsyncStorage
          await AsyncStorage.setItem('accessToken', token);
          navigation.navigate("Main");
        }
      }
      catch (e) {
        console.log("error", e.message)
        setLoading(false)
        Alert.alert(JSON.stringify(e.message))
      }
    }
  };


  return (
    <>
    <SafeAreaView style={{flex:1}}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // adjust if needed
    >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient colors={['#f0fff0', '#d3fcd5']} style={styles.container}>
           
            <Animated.View entering={FadeInUp.duration(800)} style={styles.avatarContainer}>
              <Image source={require('../assets/user1.png')} style={styles.centerAvatar} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.content}>
              <Text style={styles.title}>
                {step === 'username' ? 'Insert an Email' : 'Enter a password'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 'username'
                  ? 'This is how others will see you in class. You can always change it later.'
                  : 'Use a strong password to keep your account secure.'}
              </Text>

              {/* Fixed height area to hold animated inputs */}
              <View style={styles.inputWrapper}>
                <Animated.View style={[styles.inputSection, usernameAnimStyle]}>
                  <Text style={styles.inputLabel}>Your Email</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="info@JaneCooper.com"
                      placeholderTextColor="#aaa"
                      value={username}
                      onChangeText={setUsername} />
                  </View>
                  <Text style={styles.note}>3–15 characters. Cannot include special characters.</Text>
                </Animated.View>

                <Animated.View style={[styles.inputSection, passwordAnimStyle]}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="••••••••"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                    {showPassword ? (
                      <Eye size={22} color="#666" />
                    ) : (
                      <EyeSlash size={22} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.forgotContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.note}>Must be at least 6 characters.</Text>
              </Animated.View>

              </View>

              {/* Buttons stay fixed below */}
              <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={Loading}>
                <LockKeyOpen size={24} weight="bold" color="#fff" />
                <Text style={styles.buttonText}>
                  {step === 'username' ? 'Next' : 'Continue'}
                </Text>
                {Loading && <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />}
              </TouchableOpacity>


              <TouchableOpacity onPress={() => {
                if (step === 'password') {
                  usernameOffset.value = withTiming(0);
                  passwordOffset.value = withTiming(width);
                  setStep('username');
                } else {
                  navigation.navigate('GetStarted');
                }
              } }>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical:"30%"
  },
  avatarContainer: {
    alignItems: 'center',
		top:-15,
  },
  centerAvatar: {
		width: width * 0.8,
    // height: 400,
    resizeMode: 'contain',
  },
	content: {
		width: '90%',
		alignItems: 'center',
		// top: -40,
		// paddingBottom: 100,
	},
inputContainer: {
  backgroundColor: '#f0f0f0',
  borderRadius: 15,
  paddingHorizontal: 15,
  paddingVertical: 5,
  width: '100%',
  marginBottom: 5,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
forgotContainer: {
  alignSelf: 'flex-end',
  marginTop: 5,
},
forgotText: {
  color: '#36454F',
  fontSize: 12,
  fontWeight: '500',
},

  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  // inputContainer: {
  //   backgroundColor: '#f0f0f0',
  //   borderRadius: 15,
  //   paddingHorizontal: 15,
  //   paddingVertical: 5,
  //   width: '100%',
  //   marginBottom: 5,
  // },

	inputSection: {
		position: 'absolute', // <-- Important
		left: 0,
		right: 0,
		backgroundColor: '#fff',
		borderRadius: 15,
		padding: 10,
		width: '100%',
		marginBottom: 20,
	},
	inputWrapper: {
		height: 180, // adjust based on your content
		width: '100%',
		position: 'relative',
		marginBottom: 30,
	},
	
	inputLabel: {
		fontSize: 14,
		color: '#333',
		marginBottom: 8,
		fontWeight: '500',
	},
	
  input: {
    fontSize: 16,
    color: '#000',
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
		top:4,
  },
  button: {
    //backgroundColor: '#c7f464',
		backgroundColor: '#36454F',
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: '100%',
		flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
		marginTop:-40,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
		marginLeft: 10,
  },
  cancel: {
    color: '#aaa',
    fontSize: 14,
  },
});
