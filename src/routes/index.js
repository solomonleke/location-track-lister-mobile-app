import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

// Screens
import Onbording from '../screens/onbording';
import TrackList from '../screens/trackList';
import Home from '../screens/home';
import Profile from '../screens/profile';
import TrackDetail from '../screens/trackDetails';
import Settings from '../screens/settings';
import GetStarted from '../screens/getStarted';
import UsernameScreen from '../screens/login';
import SplashScreen from '../screens/splashScreen';
import HomePage from '../screens/homePage';
import Notification from '../screens/notification';
import Users from '../screens/users';
import AddressList from '../screens/listAddress';
import ShearDirection from '../screens/shearDirection';
import Directions from '../screens/directionDetails';
import SignupScreen from '../screens/signup';
import VerifyEmail from '../screens/emailOtp';
import UpdateProfileInfo from '../screens/userProfileInfo';

const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <CurvedBottomBar.Navigator
      type="DOWN"
      height={60}
      circleWidth={55}
      bgColor="#fff"
      initialRouteName="Home"
      borderTopLeftRight
      renderCircle={({ selectedTab, navigate }) => (
        <TouchableOpacity
          style={{
            width: 55,
            height: 55,
            borderRadius: 27.5,
            backgroundColor: '#622cfc',
            justifyContent: 'center',
            alignItems: 'center',
            top: -30,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 5,
            elevation: 5,
          }}
          onPress={() => navigate('Home')}
        >
          <Icon name="home-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
      tabBar={({ routeName, selectedTab, navigate }) => {
        let icon = '';
        if (routeName === 'notification') icon = 'notifications-outline';
        if (routeName === 'Shear') icon = 'move-outline';
        if (routeName === 'AddressList') icon = 'map-outline';
        if (routeName === 'Settings') icon = 'settings-outline';
        return (
          <TouchableOpacity
            onPress={() => navigate(routeName)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon
              name={icon}
              size={24}
              color={routeName === selectedTab ? '#622cfc' : 'gray'}
              style={{
                transform: [{ scale: routeName === selectedTab ? 1.2 : 1 }],
              }}
            />
          </TouchableOpacity>
        );
      }}
    > 
    <CurvedBottomBar.Screen name="AddressList" position="LEFT" component={AddressList} />
      <CurvedBottomBar.Screen name="Shear" position="LEFT" component={ShearDirection} />
      <CurvedBottomBar.Screen name="Home" component={HomePage} position="CENTER" />
      <CurvedBottomBar.Screen name="notification" position="RIGHT" component={Notification} />
      <CurvedBottomBar.Screen name="Settings" position="RIGHT" component={Settings} />
    </CurvedBottomBar.Navigator>
  );
}

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Directions" component={Directions} />
      <Stack.Screen name="login" component={UsernameScreen} />
      <Stack.Screen name="otp" component={VerifyEmail} />

      <Stack.Screen name="updateinfo" component={UpdateProfileInfo} />
      <Stack.Screen name="signup" component={SignupScreen} />
      <Stack.Screen name="GetStared" component={GetStarted} />
      <Stack.Screen  name="TrackList" component={TrackList} />
      <Stack.Screen name="TrackDetail" component={TrackDetail} />
      <Stack.Screen name="Onbording" component={Onbording} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
