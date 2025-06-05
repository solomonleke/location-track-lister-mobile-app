

import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
	useAnimatedScrollHandler,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const categories = ['Asia', 'Europe', 'South America', 'North America'];


const destinations = [
  {
    id: '1',
    title: 'Rio de Janeiro',
    country: 'Brazil',
    rating: 5.0,
    reviews: 143,
    image:
      'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
  },
  {
    id: '2',
    title: 'Machu Picchu',
    country: 'Peru',
    rating: 4.9,
    reviews: 210,
    image:
      'https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg',
  },
];

export default function Home({ navigation }) {
	const [activeCategory, setActiveCategory] = React.useState('South America');
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const scrollX = useSharedValue(0);
	// Add this inside your component
	const flatListRef = useRef(null);

	// Adjust this mapping to match your data dynamically
	const categoryToIndex = {
		Asia: 0,
		Europe: 1,
		'South America': 0,
		'North America': 1,
	};

	const handleCategoryPress = (category) => {
		setActiveCategory(category);

		const index = categoryToIndex[category] || 0;
		flatListRef.current?.scrollToIndex({ index, animated: true });
	};

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
		},
	});
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Vanessa 👋</Text>
          <Text style={styles.subGreeting}>Welcome to TripSlide</Text>
        </View>
        <Image
          source={require('../assets/benz.png')}
          style={styles.profileImage}
        />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#555" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
        <TouchableOpacity>
          <Icon name="options-outline" size={20} color="#fff" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
			{categories.map((cat) => (
					<TouchableOpacity
						key={cat}
						onPress={() => handleCategoryPress(cat)}
						style={[styles.categoryBtn, cat === activeCategory && styles.activeCategory]}>
						<Text style={[styles.categoryText, cat === activeCategory && styles.activeCategoryText]}>
							{cat}
						</Text>
					</TouchableOpacity>
				))}
      </ScrollView>

      {/* Image Slider */}
      <Animated.FlatList
				ref={flatListRef}
        data={destinations}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
  			scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.country}</Text>
              </View>
              <View style={styles.cardRating}>
                <Icon name="star" color="#FFD700" size={14} />
                <Text style={styles.cardRatingText}>{item.rating} • {item.reviews} reviews</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.cardButton}>
              <Text style={styles.cardButtonText}>See more</Text>
              <Icon name="chevron-forward-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F3F5',
    margin: 20,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#000',
  },
  filterIcon: {
    backgroundColor: '#622cfc',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  categoryTabs: {
    paddingHorizontal: 20,
  },
  categoryBtn: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: '#444',
    fontSize: 13,
  },
  activeCategory: {
    backgroundColor: '#622cfc',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    width: width - 40,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  
    marginBottom: 30,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardInfo: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cardRatingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  cardButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#622cfc',
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
