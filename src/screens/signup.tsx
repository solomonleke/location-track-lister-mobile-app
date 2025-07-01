import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
	FadeInUp,
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';
import { AppleLogo } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterApi } from '../Utilities/ApiCalls';

const { width } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
	React.useLayoutEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [navigation]);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [step, setStep] = useState('name');
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState('');

	const nameOffset = useSharedValue(0);
	const emailOffset = useSharedValue(width);
	const passwordOffset = useSharedValue(width * 2);

	const nameAnimStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: nameOffset.value }],
		opacity: withTiming(step === 'name' ? 1 : 0),
	}));

	const emailAnimStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: emailOffset.value }],
		opacity: withTiming(step === 'email' ? 1 : 0),
	}));

	const passwordAnimStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: passwordOffset.value }],
		opacity: withTiming(step === 'password' ? 1 : 0),
	}));

	const handleContinue = async () => {
		if (step === 'name') {
			if (!firstName || !lastName) {
				Alert.alert('Please enter your full name');
				return;
			}
			nameOffset.value = withTiming(-width);
			emailOffset.value = withTiming(0);
			setStep('email');
		} else if (step === 'email') {
			if (!email || !email.includes('@')) {
				Alert.alert('Please enter a valid email');
				return;
			}
			emailOffset.value = withTiming(-width);
			passwordOffset.value = withTiming(0);
			setStep('password');
		} else if (step === 'password') {
			if (password.length < 6) {
				Alert.alert('Password should be at least 6 characters');
				return;
			}
			setLoading(true);
			try {
				let result = await RegisterApi({
					email: email,
					password: password,
					firstName: firstName,
					lastName: lastName,
					username: username,
				});
				console.log(result,"hle")
				if (result.data.status === 201 || result.data.success) {
					setLoading(false);
					// await AsyncStorage.setItem('accessToken', result.data.accessToken);
					navigation.navigate("otp",{
            name: email,
						type: 'verify-email'
          });
				} else {
					throw new Error(result.data.message || 'Signup failed');
				}
			} catch (e) {
				setLoading(false);
				Alert.alert('Error', e.message);
			}
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
		>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
				<LinearGradient colors={['#f0fff0', '#d3fcd5']} style={styles.container}>
					<Animated.View entering={FadeInUp.duration(800)} style={styles.avatarContainer}>
						<Image source={require('../assets/user1.png')} style={styles.centerAvatar} />
					</Animated.View>

					<Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.content}>
						<Text style={styles.title}>
							{step === 'name' ? 'What’s your name?' : step === 'email' ? 'Insert an Email' : 'Create a password'}
						</Text>
						<Text style={styles.subtitle}>
							{step === 'name'
								? 'Your first and last name helps others recognize you.'
								: step === 'email'
								? 'We’ll use this to send you updates and sign you in.'
								: 'Use a strong password to secure your account.'}
						</Text>

						<View style={styles.inputWrapper}>
							<Animated.View style={[styles.inputSection, nameAnimStyle]}>
								<Text style={styles.inputLabel}>First Name</Text>
								<View style={styles.inputContainer}>
									<TextInput
										style={styles.input}
										placeholder="John"
										value={firstName}
										onChangeText={setFirstName}
									/>
								</View>
								<Text style={styles.inputLabel}>Last Name</Text>
								<View style={styles.inputContainer}>
									<TextInput
										style={styles.input}
										placeholder="Doe"
										value={lastName}
										onChangeText={setLastName}
									/>
								</View>
							</Animated.View>

							<Animated.View style={[styles.inputSection, emailAnimStyle]}>
								<Text style={styles.inputLabel}>Email</Text>
								<View style={styles.inputContainer}>
									<TextInput
										style={styles.input}
										placeholder="you@example.com"
										value={email}
										onChangeText={setEmail}
										keyboardType="email-address"
										autoCapitalize="none"
									/>
								</View>

								<Text style={styles.inputLabel}>Username</Text>
								<View style={styles.inputContainer}>
									<TextInput
										style={styles.input}
										placeholder="johndoe123"
										value={username}
										onChangeText={setUsername}
										autoCapitalize="none"
									/>
								</View>
							</Animated.View>


							<Animated.View style={[styles.inputSection, passwordAnimStyle]}>
								<Text style={styles.inputLabel}>Password</Text>
								<View style={styles.inputContainer}>
									<TextInput
										style={styles.input}
										placeholder="••••••••"
										secureTextEntry
										value={password}
										onChangeText={setPassword}
									/>
								</View>
								<Text style={styles.note}>Must be at least 6 characters.</Text>
							</Animated.View>
						</View>

						<TouchableOpacity style={styles.button} onPress={handleContinue}>
							<AppleLogo size={24} weight="bold" color="#fff" />
							<Text style={styles.buttonText}>{step !== 'password' ? 'Next' : loading ? 'Signing up...' : 'Continue'}</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => navigation.navigate('login')}>
							<Text style={styles.cancel}>Already have an account? Login</Text>
						</TouchableOpacity>
					</Animated.View>
				</LinearGradient>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	avatarContainer: {
		alignItems: 'center',
		top: -20,
	},
	centerAvatar: {
		width: width * 0.8,
		resizeMode: 'contain',
	},
	content: {
		width: '90%',
		alignItems: 'center',
		top: -60,
		paddingBottom: 100,
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
	inputContainer: {
		backgroundColor: '#f0f0f0',
		borderRadius: 15,
		paddingHorizontal: 15,
		paddingVertical: 5,
		width: '100%',
		marginBottom: 15,
	},
	inputSection: {
		position: 'absolute',
		left: 0,
		right: 0,
		backgroundColor: '#fff',
		borderRadius: 15,
		padding: 10,
		width: '100%',
	},
	inputWrapper: {
		height: 240,
		width: '100%',
		position: 'relative',
		marginBottom: 30,
	},
	inputLabel: {
		fontSize: 13.5,
		color: '#333',
		marginBottom: 5,
		fontWeight: '500',
	},
	input: {
		fontSize: 16,
		color: '#000',
	},
	note: {
		fontSize: 12,
		color: '#999',
		marginTop: 5,
	},
	button: {
		backgroundColor: '#36454F',
		borderRadius: 20,
		paddingVertical: 13,
		top:-50,
		paddingHorizontal: 20,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
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
		marginTop: -50,
	},
});
