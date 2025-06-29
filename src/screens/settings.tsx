import React, { useLayoutEffect, useState } from 'react';
import {
  View, Text, Switch, ScrollView, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeleteAccount } from '../Utilities/ApiCalls';

export default function Settings({ navigation }) {
  const [rememberLogin, setRememberLogin] = useState(true);
  const [useFaceID, setUseFaceID] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogoutAllDevices = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('GetStared');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while logging out.');
    }
  };

  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await DeleteAccount(token);
      // Replace with your actual delete API call
      if (res.status === 200 || res.status === 201) {
        await AsyncStorage.clear();
        navigation.navigate('GetStared');
      } else {
        Alert.alert('Failed', 'Account deletion failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Are you sure?',
      'This action will permanently delete your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Delete', onPress: deleteAccount, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const SettingItem = ({ title, description, icon, button, toggle, value, onValueChange, hasArrow, onPress }) => (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={styles.settingItem}>
        <View style={styles.iconTitleContainer}>
          <View style={styles.iconWrapper}>
            <Icon name={icon} size={20} color="#4F46E5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>{title}</Text>
            {description ? <Text style={styles.settingDescription}>{description}</Text> : null}
          </View>
        </View>
        {toggle ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#ccc', true: '#4F46E5' }}
            thumbColor="#fff"
          />
        ) : hasArrow ? (
          <Icon name="chevron-right" size={22} color="#999" />
        ) : <Icon name="delete" size={22} color="red" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Security Settings</Text>
      <Text style={styles.subHeader}>
        Your health privacy matters. Control and own your disclosures.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingItem
          title="Change Password"
          description="Change your phone passcode unlock/view your account detils."
          icon="lock"
          hasArrow
          onPress={() => navigation.navigate("changepassword")}
        />
        <SettingItem
          title="Account Update info"
          description="Shake your phone to unlock/view your account balances."
          icon="shield"
          hasArrow
          onPress={()=>navigation.navigate("updateinfo")}
        />
        <SettingItem
          title="Passcode Auth Login"
          icon="refresh-ccw"
          toggle
          value={rememberLogin}
          onValueChange={setRememberLogin}
        />
        <SettingItem
          title="Google Auth Login"
          icon="smile"
          toggle
          value={useFaceID}
          onValueChange={setUseFaceID}
        />
        <SettingItem
          title="Delete my Account"
          icon="trash"
          button
          onPress={handleDeleteAccount}
        />
        <SettingItem
          title="Log Out From All Devices"
          description="Shake your phone to unlock/view your account balances."
          icon="log-out"
          hasArrow
          onPress={handleLogoutAllDevices}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  settingItem: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconWrapper: {
    backgroundColor: '#E0E7FF',
    padding: 10,
    borderRadius: 30,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});
