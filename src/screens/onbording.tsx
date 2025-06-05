import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import Page, { PAGE_WIDTH } from '../components/Page';
import { BACKGROUND_COLOR, PAGES } from '../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import Dot from '../components/Dot';
import { useNavigation } from '@react-navigation/native';

export default function Onbording() {
  const navigation = useNavigation<any>();
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translateX.value = event.contentOffset.x;
    },
  });

  const activeIndex = useDerivedValue(() => {
    return Math.round(translateX.value / PAGE_WIDTH);
  });

  const scrollRef = useAnimatedRef<ScrollView>();

  const onIconPress = useCallback(() => {
    if (activeIndex.value === PAGES.length - 1) {
      // Navigate to "GetStarted" if on last page
      navigation.navigate('GetStared');
    } else {
      // Scroll to the next page
      scrollRef.current?.scrollTo({ x: PAGE_WIDTH * (activeIndex.value + 1), animated: true });
    }
  }, [activeIndex.value, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef as any}
        style={{ flex: 1 }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {PAGES.map((page, index) => (
          <Page
            key={index.toString()}
            page={page}
            translateX={translateX}
            index={index}
          />
        ))}
      </Animated.ScrollView>
      <View style={styles.footer}>
        {/* Paginator */}
        <View style={[styles.fillCenter, { flexDirection: 'row' }]}>
          {PAGES.map((_, index) => {
            return (
              <Dot
                key={index.toString()}
                index={index}
                activeDotIndex={activeIndex}
              />
            );
          })}
        </View>
        {/* Text Container */}
        <View style={styles.fillCenter}>
          <Text style={styles.text}>View Board</Text>
        </View>
        {/* iconContainer */}
        <View style={styles.fillCenter}>
          <Icon
            name="arrowright"
            size={24}
            color="black"
            onPress={onIconPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  footer: {
    height: 50,
    marginBottom: 15,
    flexDirection: 'row',
  },
  fillCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:20,
  },
  text: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.7,
    fontWeight: '500',
  },
});
