import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Scale Animation
    scale.value = withSequence(
      withTiming(0.7, { duration: 700 }),     // zoom out
      withTiming(1.2, { duration: 700 }),     // zoom in
      withTiming(1, { duration: 200 })        // normalize
    );

    // Slide Animation
    translateX.value = withDelay(
      1600,
      withSequence(
        withTiming(-500, { duration: 600 }),  // slide out left
        withTiming(0, { duration: 600 }),     // slide back in
        withDelay(300, withTiming(0, { duration: 200 }, (finished) => {
          if (finished) runOnJS(navigation.navigate)('Onbording');
        }))
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Image
          source={require('../assets/logo.png')} // Replace with your logo
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#e5fdf4',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
