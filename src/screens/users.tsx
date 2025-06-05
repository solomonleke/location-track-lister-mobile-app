
import React from 'react';
import { Text, View } from 'react-native';

export default function Users({ navigation }) {
	React.useLayoutEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [navigation]);

	return (
		<View>
				<Text>Users</Text>
		</View>
	);
}
