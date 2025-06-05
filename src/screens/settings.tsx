import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function Settings({ navigation }) {
  const [rememberLogin, setRememberLogin] = useState(true);
  const [useFaceID, setUseFaceID] = useState(false);
  const [accountRecovery, setAccountRecovery] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const SettingItem = ({ title, description, icon, toggle, value, onValueChange, hasArrow }) => (
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
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Security Settings</Text>
      <Text style={styles.subHeader}>
        Your health privacy matters. Control and own your disclosures.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingItem
          title="Enable Pin Code"
          description="Shake your phone to unlock/view your account balances."
          icon="lock"
          toggle
          value={false}
          onValueChange={() => {}}
        />
        <SettingItem
          title="Biometric Login"
          description="Shake your phone to unlock/view your account balances."
          icon="shield"
          hasArrow
        />
        <SettingItem
          title="Remember Login"
          icon="refresh-ccw"
          toggle
          value={rememberLogin}
          onValueChange={setRememberLogin}
        />
        <SettingItem
          title="Use FaceID"
          icon="smile"
          toggle
          value={useFaceID}
          onValueChange={setUseFaceID}
        />
        <SettingItem
          title="Account Recovery"
          icon="refresh-cw"
          toggle
          value={accountRecovery}
          onValueChange={setAccountRecovery}
        />
        <SettingItem
          title="Log Out From All Devices"
          description="Shake your phone to unlock/view your account balances."
          icon="log-out"
          hasArrow
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
