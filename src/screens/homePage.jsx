import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
	ScrollView,
	TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import { getMovies } from '../components/api';
import Genres from '../components/Genres';
import Rating from '../components/Rating';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { GetUserProfile } from '../Utilities/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

const Backdrop = ({ movies, scrollX }) => {
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
      <FlatList
        data={movies.reverse()}
        keyExtractor={(item) => item.key + '-backdrop'}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
            // extrapolate:'clamp'
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: 'absolute',
                width: translateX,
                height,
                overflow: 'hidden',
              }}
            >
              <Image
                source={item.backdrop }
								blurRadius={0.9}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                }}
              />
            </Animated.View>
          );
        }}
      />
			<LinearGradient
				colors={['#4c669f', '#3b5998', '#192f6a']}
				style={{ flex: 1, borderRadius: 5 }}
			>
				{/* <Text style={{ color: 'white', height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0, }}>Hello Gradient!</Text> */}
			</LinearGradient>
    </View>
  );
};
export default function HomePage({ navigation }) {
	const [activeCategory, setActiveCategory] = React.useState('South America');
	const [search, setSearch] = React.useState('');
  const [DraggableMarker, setDraggableMarker] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [userdata, setUserData] = React.useState('');
  const [showBackdrop, setShowBackdrop] = React.useState(true);
  const [rawMovies, setRawMovies] = React.useState([]);


	React.useLayoutEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [navigation]);
  const [movies, setMovies] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
	const flatListRef = React.useRef(null);

  const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (hasPermission) return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const UserProfile = async()=>{
  const userToken = await AsyncStorage.getItem('accessToken');
  try{
    const result = await GetUserProfile(userToken)
    if(result.status === 200){
      setUserData(result.data.user)
    }
  }catch(e){
    console.log(e.message)
  }
}

  React.useEffect(() => {
    requestLocationPermission()
    UserProfile()
    const fetchData = async () => {
      const movies = await getMovies();
      setRawMovies(movies);
      setMovies([{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]);
    };


    if (movies.length === 0) {
      fetchData(movies);
    }
  }, [movies]);

  if (movies.length === 0) {
    return <Loading />;
  }
		// Adjust this mapping to match your data dynamically
    const movieTitles = (movies || [])
    .filter((movie) => movie && movie.title)
    .map((movie) => movie.title);


    const handleCategoryPress = (title) => {
      setActiveCategory(title);
      const actualIndex = rawMovies.findIndex((m) => m.title === title);
      if (actualIndex !== -1) {
        // Offset by 1 to skip "empty-left"
        flatListRef.current?.scrollToIndex({ index: actualIndex, animated: true });
    }
};
  return (
    <View style={styles.container}>
      {showBackdrop && <Backdrop movies={movies} scrollX={scrollX} />}

      <StatusBar hidden />
			 {/* Header */}
						<View style={styles.header} blurRadius={5}>
							<View>
								<Text style={styles.greeting}>Hello, {userdata.username} 👋</Text>
								<Text style={styles.subGreeting}>Welcome to EzypGps</Text>
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
								value={search}
								onChangeText={(text) => {
									setSearch(text);
									const matchIndex = rawMovies.findIndex((m) =>
										m.title?.toLowerCase().includes(text.toLowerCase())
									);
									if (matchIndex !== -1) {
										flatListRef.current?.scrollToIndex({ index: matchIndex, animated: true });
										setActiveCategory(rawMovies[matchIndex].title);
									}
								}}
								style={styles.searchInput}
							/>

							<TouchableOpacity onPress={() => setShowBackdrop(prev => !prev)}>
                <Icon name="options-outline" size={20} color="#622cfc" style={styles.filterIcon} />
              </TouchableOpacity>

						</View>

						{/* Category Tabs */}
						<View style={{height:'4.5%'}}>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
						{movieTitles.map((title) => (
								<TouchableOpacity
								key={title}
								onPress={() => handleCategoryPress(title)}
								style={[styles.categoryBtn, title === activeCategory && styles.activeCategory]}>
								<Text style={[styles.categoryText, title === activeCategory && styles.activeCategoryText]}>
									{title}
								</Text>
							</TouchableOpacity>							
							))}
						</ScrollView>
						</View>
      <Animated.FlatList
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.key}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={ITEM_SIZE}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
        snapToAlignment='start'
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });

          return (
						<TouchableOpacity
						onPress={() =>
							navigation.navigate('TrackList', {
								title: item.title,
								description: item.description,
								poster: item.poster,
								genres: item.genres,
								// add other fields as needed
							})
						}
						activeOpacity={0.8}
						style={{ width: ITEM_SIZE, top: -130, height: '5%' }}
					>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 1,
                  alignItems: 'center',
                  transform: [{ translateY }],
                  backgroundColor: '#eee',
                  borderRadius: 34
                }}
              >
                <Image
                  source={item.poster }
                  style={styles.posterImage}
                />
                <Text style={{ fontSize: 24, paddingBottom:10 }} numberOfLines={1}>
                  {item.title}
                </Text>
                {/* <Rating rating={item.rating} /> */}
                <Genres genres={item.genres} />
                <Text style={{ fontSize: 12, paddingLeft:6 }} numberOfLines={3}>
                  {item.description}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
	header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
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
		backgroundColor: '#622cfc',
		//borderColor: '#622cfc',
    borderRadius: 20,
		borderWidth:0.5,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F3F5',
    marginVertical: 20,
		marginHorizontal: 13,
    paddingVertical: 5,
		paddingHorizontal:10,
    borderRadius: 15,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#000',
  },
  filterIcon: {
    // backgroundColor: '#622cfc',
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
  container: {
		flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 0.9,
    // resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
		resizeMode: 'contain',
  },
});
