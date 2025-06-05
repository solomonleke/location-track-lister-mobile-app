
import React from 'react';
import { Text, View } from 'react-native';

export default function Profile({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

	return (
		<View>
				<Text>Profile</Text>
		</View>
	);
}
