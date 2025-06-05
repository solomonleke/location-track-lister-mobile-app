import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  Animated,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import { GOOGLE_DIRECTION_API_KEY, GOOGLE_PLACES_API_KEY } from '../Utilities/Config';
const { width, height } = Dimensions.get('window');
const BACKDROP_HEIGHT = height * 0.65;

export default function TrackList({  route , navigation }) {
  const { title, description, poster } = route.params;
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [respons, setRespons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(3000); // default radius
  const [showRadiusSelector, setShowRadiusSelector] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width)); // for sliding in drawer
  const [activeTab, setActiveTab] = useState('Day');

  useEffect(() => {
    if (title) {
      requestLocationPermission();
    }
  }, [title]); // <-- re-run when title changes


  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required.');
        }
      } else {
        console.log('there is no permision granted')
        // getUserLocation(); // iOS handled by plist config
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getUserLocation = () => {
    setLoading(true);
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchNearbyPlaces(latitude, longitude);
        },
        (error) => {
          console.error(error);
          Alert.alert('Error', 'Unable to fetch location.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, forceRequestLocation: true,
        showLocationDialog: true }
      );
    } catch (err) {
      console.error('Unhandled error', err);
    }
  };
const toggleRadiusSelector = () => {
  const toValue = showRadiusSelector ? -width : 0;
  Animated.timing(slideAnim, {
    toValue,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    setShowRadiusSelector(!showRadiusSelector);
  });
};


  const fetchNearbyPlaces  = async (latitude, longitude) => {
    setRespons([]); // Clear previous results
    setLoading(true);
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
        params: {
          location: `${latitude},${longitude}`,
          radius: radius,
          type: title.toLowerCase(),
          key: GOOGLE_PLACES_API_KEY,
          //key: 'AIzaSyD4TBo92CFUaUmNnM_KkwKqoB1dL7FeOW4',
          //key: 'AIzaSyB8DE9mQ1yxh8LaencPAJtIe6X79KuTTBg',
        },
      });
      console.log(response,'tyj');
      if (response.status === 200) {
        const Data = response.data.results.map((data) => ({
          id: data.place_id,
          icon:data.icon,
          name: data.name,
          address: data.vicinity,
          location: data.geometry,
          opening_hours: data.opening_hours?.open_now ? 'Open Now' : 'Closed',
        }));
        // console.log(response.data.results)
        setRespons(Data);
      } else {
        Alert.alert('Error', 'Failed to fetch hospital data.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to fetch hospital data.');
    } finally {
      setLoading(false);
    }
  };

  return (
		<ImageBackground
        source={poster} // Replace with your background image path
        style={styles.container}
        resizeMode="cover"
        blurRadius={2}
      >
			<Text style={styles.title}>Trip History</Text>
			<View style={styles.model}>
      {/* Header */}
      <View style={styles.header}>
				<View style={styles.logohead}>
					<View style={styles.logotext}>
				<Text style={styles.carTitle}>{title}</Text>
        <Text style={styles.plate}>AG 5758 SS</Text>
				</View>
				<Image
					source={poster} // adjust the path accordingly
					style={styles.carImage} // set your desired width and height
				/>
				</View>
        {/* Tab Selector */}
        

      <View style={styles.tabs}>
        {['Day', 'Week', 'Month', 'Year'].map((label, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(label)}
            style={[styles.tab, activeTab === label && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === label && styles.activeTabText]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      </View>
				<View style={styles.summaryBg}>
      {/* Summary Section */}
      <View style={styles.summary}>
			<View>
          {/* <MaterialIcons name="speed" size={18} color="gray" /> */}
					<View style={styles.summaryItem}>
					<Icon name="time-outline" size={19} color="#622cfc" />
					<Text style={styles.summaryText}>05h : 04m : 13s</Text>
					</View>
					<Text style={styles.tripMeta}>total spend</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryText}>:</Text>
        </View>
          <TouchableOpacity onPress={toggleRadiusSelector}>
            <View style={styles.summaryItem}>
              <Icon name="map-outline" size={17} color="#622cfc" />
              <Text style={styles.summaryText}>{radius / 1000} km</Text>
            </View>
            <Text style={styles.tripMeta}>tap to change km</Text>
          </TouchableOpacity>

      </View>

      {/* Trip List */}
            <ScrollView style={styles.tripList} showsVerticalScrollIndicator={false}>
              {loading ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
            ) : (
            respons.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.tripCard}
                onPress={() =>
                  navigation.navigate('TrackDetail', {
                    tripId: item.id,
                    title: item.name,
                    loc:item.location,
                    description: item.address,
                    poster,
                    icon:item.icon,
                    time: '08:08 PM - 10:47 PM',
                    route: item.address,
                    distance: 'Approx. nearby',
                    averageSpeed: item.openNow,
                  })
                }
              >
                <Image
                  source={require('../assets/map.png')}
                  style={styles.mapPreview}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.tripTime}>08:08 PM - 10:47 PM</Text>
                  <Text style={styles.tripRoute}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Icon name="location-outline" size={16} color="gray" />
                      <Text style={styles.tripMeta}>{item.address}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Icon name="speedometer-outline" size={16} color="gray" />
                      <Text style={styles.tripMeta}>{item.openNow}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )))}
          </ScrollView>
			</View>
			</View>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: width * 0.7,
          backgroundColor: '#fff',
          padding: 20,
          zIndex: 1000,
          transform: [{ translateX: slideAnim }],
          elevation: 10,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
          Select Radius (in km)
        </Text>
        <ScrollView>
          {[1, 2, 3, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((km) => (
            <TouchableOpacity
              key={km}
              onPress={() => {
                setRadius(km * 1000);
                toggleRadiusSelector();
                getUserLocation(); // this re-fetches based on new radius
              }}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: '#eee',
              }}
            >
              <Text style={{ fontSize: 16 }}>{km} km</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: '15%',
    width,
    height: BACKDROP_HEIGHT,
  },
	model:{
		height:'100%',
		width:'100%',
		backgroundColor:'#fff',
		borderTopRightRadius:25,
		borderTopLeftRadius:25,
	},
	logohead:{
		// flex:1,
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems: 'center',
		height:60,
		width:'100%',
		paddingLeft:25,
		top:'-20%',
	},
	logotext:{
		top:30,
	},
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
		width: 170,
    top: '-6%',
		color:'#fff',
		paddingHorizontal:10,
  },
  carImage: {
    width: '100%',
    height: 110,
		marginLeft:-20,
    resizeMode: 'contain',
    // marginBottom: 10,
  },
  carTitle: {
    fontSize: 21,
    fontWeight: '700',
    color:'#36454F'
  },
  plate: {
    fontSize: 15,
    color: 'gray',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
		width:'110%',
		justifyContent:'center',
  },
  tab: {
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: 15,
		borderWidth:0.5,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderColor:'#622cfc',
  },
  activeTab: {
    backgroundColor: '#622cfc',
  },
  tabText: {
    color: '#36454F',
  },
  activeTabText: {
    color: '#fff',
    // fontWeight: 'bold',
  },
	summaryBg: {
		paddingVertical: 1,
		paddingHorizontal: 1,
		width: '97%',
		borderWidth: 0.1,
		borderRadius: 15,
		borderColor: '#000',
		backgroundColor: '#eee',
		alignSelf: 'center',           // Center horizontally
		marginHorizontal: 10,          // Add slight horizontal spacing
	},
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 3,
		//paddingRight:'15%',
		width:'100%',
    borderWidth: 1,
    borderTopLeftRadius: 13,
		borderTopRightRadius: 13,
    borderColor: '#eee',
		backgroundColor:'#fff',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  summaryText: {
    color: '#36454F',
		fontWeight: '700',
  },
  tripList: {
    marginTop: 5,
		marginHorizontal:4,
		gap: 6,
  },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 11,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    gap: 15,
  },
  mapPreview: {
    width: 88,
    height: 64,
    borderRadius: 6,
		// resizeMode: 'contain',
  },
  tripRoute: {
    fontWeight: 'bold',
    fontSize: 13,
    color:'#36454F',
    //color:'#112642',
    // color:'#353839',
  },
  tripMeta: {
    color: 'gray',
    fontSize: 13.4,
    // marginTop: 2,
		paddingVertical: 4 ,
  },
  tripTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
