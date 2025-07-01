import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
  ScrollView,
  Modal,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ShieldCheck } from 'phosphor-react-native';
import OTP from 'react-native-otp-form';
import { VerifyOTPApi } from '../Utilities/ApiCalls';

const { width } = Dimensions.get('window');

export default function VerifyEmail({ navigation, route }) {
  const { name, type } = route.params || 'francisdaniel140@gmail.com';

  console.log(name, type, 'name, type')
  const [Otp, setOtp] = useState('');
  const [ShowOtp, setShowOtp] = useState(false);
  const [Success, setSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [NewUser, setNewUser] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
    getEmail();
  }, []);

  const getEmail = () => {
    let arrUser = name.split('');
    for (let i = 2; i <= 7; i++) arrUser[i] = '*';
    setNewUser(arrUser.join(''));
  };

	// const getEmail = () => {
  //   setNewUser(name);
  // };

  const handleSendCode = () => {
    setSuccess(true);
    setTimeout(() => setShowOtp(true), 1500);
  };

  const handleVerify = async () => {
    try {
      const result = await VerifyOTPApi({
        token: parseInt(Otp),
        reason: type,
      });
      console.log(result.data.accessToken,"this the result")
      if (result.data.status === 200) {
        if(type === "forgot-password"){
          navigation.navigate('forgotpassword', {
            code: result.data.accessToken,
          });
        }
        setModalVisible(true);
      }
    } catch (e) {
      Alert.alert('Verification Error', e.message);
    }
  };

  const handleDone = () => {
    setModalVisible(false);
    navigation.push('login');
  };

  const onFinish = (code) => {
    setOtp(code);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient colors={['#f0fff0', '#d3fcd5']} style={styles.container}>
            <Animated.View entering={FadeInUp.duration(800)} style={styles.avatarContainer}>
              <Image source={require('../assets/benz.png')} style={styles.centerAvatar} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.content}>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                {ShowOtp
                  ? 'Enter the 4-digit code sent to your email.'
                  : 'Thank you for signing up. Tap below to verify your email.'}
              </Text>

              <Text style={styles.emailText}>{NewUser}</Text>

              {!ShowOtp ? (
                <>
                  {Success && (
                    <Text style={styles.successText}>A verification code has been sent</Text>
                  )}
                  <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                    <ShieldCheck size={24} weight="bold" color="#fff" />
                    <Text style={styles.buttonText}>Send Code</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <OTP
                    codeCount={4}
                    containerStyle={{ marginVertical: 24 }}
                    otpStyles={styles.otpBox}
                    keyboardType="numeric"
                    onFinish={onFinish}
                  />
                  <TouchableOpacity style={styles.button} onPress={handleVerify}>
                    <ShieldCheck size={24} weight="bold" color="#fff" />
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                  <Text style={styles.resendText} onPress={() => Alert.alert('Resend not yet implemented')}>
                    Resend Code
                  </Text>
                </>
              )}
            </Animated.View>
          </LinearGradient>

          {/* ✅ Success Modal */}
          <Modal transparent visible={modalVisible} animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <Image source={require('../assets/benz.png')} />
                <Text style={styles.modalTitle}>Verified</Text>
                <Text style={styles.subtitle}>Hi user, your email has been successfully verified.</Text>
                <TouchableOpacity style={styles.button} onPress={handleDone}>
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  centerAvatar: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  content: {
    marginTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  emailText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 16,
  },
  successText: {
    textAlign: 'center',
    color: 'green',
    marginBottom: 8,
  },
  otpBox: {
    backgroundColor: '#fff',
    borderColor: '#aaa',
    borderWidth: 2,
    padding: 10,
    fontSize: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resendText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000055',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 28,
    borderRadius: 18,
    alignItems: 'center',
    gap: 16,
    width: '80%',
    shadowColor: '#000',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
});
