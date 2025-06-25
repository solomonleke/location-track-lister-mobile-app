import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
	Alert,
  TextInput,KeyboardAvoidingView,
	SafeAreaView,
} from 'react-native';
import { AddressApi, GetAddress, DeleteAddress } from '../Utilities/ApiCalls';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_PLACES_API_KEY, GOOGLE_PLACES_API_KEYs, GOOGLE_DIRECTION_API_KEY } from '../Utilities/Config';
const { width, height } = Dimensions.get('window');
const BACKDROP_HEIGHT = height * 0.65;


export default function AddressList({ navigation }) {
	const [showModal, setShowModal] = useState(false);
	const [showRadios, setShowRadios] = useState(false);
	const [fadingItem, setFadingItem] = useState(null);
	const [data, setData] = useState([]);
	const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
	const [Payload, setPayload] = useState({
        postal_code: '',
				postalCode: 'null',
        state: '',
				title: '',
        city: '',
        country: '',
        address: '',
				latitude:'',
				longitude:'',
    });

	const fadeAnim = useRef({}).current;

	const addressList = [1, 2, 3, 4, 5, 6];

	React.useLayoutEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [navigation]);
	const [addressStatus, setAddressStatus] = useState('idle'); // idle | success | fail


	const checkAddress = async () => {
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(Payload.address)}&key=${GOOGLE_PLACES_API_KEY}`
			);
			const data = await response.json();

			if (data.status === 'OK' && data.results.length > 0) {
				const details = data.results[0];
				const components = details.address_components;
				const getComponent = (type) =>
					components.find(c => c.types.includes(type))?.long_name || '';

				console.log(details,'getComponent');
				setPayload(prev => ({
					...prev,
					city: getComponent('locality'),
					state: getComponent('administrative_area_level_1'),
					country: getComponent('country'),
					title: String(details.formatted_address || 'null'),
					postal_code: String(getComponent('postal_code') || ''),
					latitude: String(details.geometry.location.lat),
					longitude: String(details.geometry.location.lng),
				}));

				setAddressStatus('success');
			} else {
				setAddressStatus('fail');
				setTimeout(() => setAddressStatus('idle'), 2000);
			}
		} catch (error) {
			console.log('Geocode Error:', error.message);
			setAddressStatus('fail');
			setTimeout(() => setAddressStatus('idle'), 2000);
		}
	};

	const handleDeleteSelect = (id) => {
		fadeAnim[id] = new Animated.Value(1);
		Animated.timing(fadeAnim[id], {
			toValue: 0,
			duration: 500,
			useNativeDriver: true,
		}).start(() => {
			// You can handle delete logic here (e.g. filter the address out)
			console.log('Deleted address id:', id);
		});
	};

  const handleAddress = async () => {
		const userToken = await AsyncStorage.getItem('accessToken');
		try {
      let result = await AddressApi(userToken, Payload);
			console.log(result);
      if (result.status === 201) {
				handleAddressList();
        }
      }
      catch (e) {
        console.log('error', e.message);
        Alert.alert(JSON.stringify(e.message));
      }
  };
	 const handleAddressList = async () => {
    const userToken = await AsyncStorage.getItem('accessToken');
    try {
      setLoading(true);
      let result = await GetAddress(userToken);
      if (result.status === 200) {
        setData(result.data);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

	  // Delete address by ID
 const handleDeleteAddress = async (selectedId) => {
  fadeAnim[selectedId] = new Animated.Value(1);

  Animated.timing(fadeAnim[selectedId], {
    toValue: 0,
    duration: 500,
    useNativeDriver: true,
  }).start(async () => {
    try {
      const userToken = await AsyncStorage.getItem('accessToken');
      const result = await DeleteAddress(selectedId, userToken);

      if (result.status === 200) {
        const updatedData = data.filter((item) => item._id !== selectedId);
        setData(updatedData);
      } else {
        Alert.alert('Failed to delete address');
      }
    } catch (e) {
      console.log('Delete error:', e.message);
      Alert.alert('Failed to delete address');
    }
  });
};

  useEffect(() => {
    handleAddressList();
  }, []);
	return (
		
		<>
			{/* Title Row with Back Icon */}
		
			<SafeAreaView style={{flex:1}}>
				<ImageBackground
					source={require('../assets/benz.png')}
					style={styles.container}
					resizeMode="cover"
					blurRadius={2}
				>
	<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginTop:-37, marginBottom: 13 }}>
				<Text style={styles.title}>ADDRESSES</Text>
				<Icon name="person" size={22} color="#000" />
			</View>
			<View  style={[styles.model, { flex: 1 }]}>
				<View style={[styles.summaryBg, { flex: 1 }]}>
					<View style={styles.summary}>
						<TouchableOpacity onPress={() => setShowRadios(!showRadios)}>
							<View style={[styles.summaryItem,{borderColor:'red'}]}>
								<Icon name="trash-outline" size={19} color="red" />
								<Text style={styles.summaryText}>Delete Address</Text>
							</View>
							<Text style={styles.tripMeta}>Delete Selected</Text>
						</TouchableOpacity>

						<View style={[styles.summaryItem, { borderWidth: 0, backgroundColor: '#fff' }]}>
							<Text style={[styles.summaryText,{color:'#622cfc'}]}>:</Text>
						</View>

						<TouchableOpacity onPress={() => setShowModal(true)}>
							<View style={styles.summaryItem}>
								<Icon name="add-outline" size={20} color="#622cfc" />
								<Text style={styles.summaryText}>Create Address</Text>
							</View>
							<Text style={[styles.tripMeta, { paddingLeft: 3 }]}>Add to Address List</Text>
						</TouchableOpacity>
					</View>

 					<ScrollView style={[styles.tripList, { flex: 1 }]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}>
          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
          ) : (
            data.map((item) => {
              if (!fadeAnim[item._id]) {
                fadeAnim[item._id] = new Animated.Value(1);
              }

              return (
                <Animated.View key={item._id} style={{ opacity: fadeAnim[item._id] }}>
                  <TouchableOpacity
                    style={styles.tripCard}
                    onPress={() =>
                      navigation.navigate('TrackDetail', {
                        tripId: item._id,
                        title: item.address,
                        loc: {
													location: {
														lat: item.latitude,
														lng: item.longitude,
													},
												},
                        description: item.title,
                        poster: 16,
                        icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
                        time: '08:08 PM - 10:47 PM',
                        distance: 'Approx. nearby',
                        averageSpeed: 'item.openNow',
                      })
                    }
                  >
                    <Image source={require('../assets/map.png')} style={styles.mapPreview} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tripTime}>08:08 PM - 10:47 PM</Text>
                      <Text style={styles.tripRoute}>{item.title}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Icon name="location-outline" size={16} color="gray" />
                          <Text style={styles.tripMeta}>10.3 km</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Icon name="speedometer-outline" size={16} color="gray" />
                          <Text style={styles.tripMeta}>AVG 100 km/h</Text>
                        </View>
                      </View>
                    </View>

                    {showRadios && (
                      <TouchableOpacity
                        style={{ marginLeft: 8 }}
                        onPress={() => {
                          if (selectedAddressId !== item._id) {
                            setSelectedAddressId(item._id);
                            handleDeleteAddress(item._id); // Auto delete on select
                          }
                        }}
                      >
                        <Icon
                          name={
                            selectedAddressId === item._id
                              ? 'radio-button-on-outline'
                              : 'radio-button-off-outline'
                          }
                          size={20}
                          color="red"
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          )}
        </ScrollView>
				</View>
			</View>

			{/* Slide Out Modal */}
			<Modal animationType="slide" transparent={true} visible={showModal}>
				<View style={{
					flex: 1,
					backgroundColor: 'rgba(0,0,0,0.6)',
					justifyContent: 'flex-start',
					alignItems: 'center',
				}}>
					
					<View style={{
						width: '90%',
						height: '45%',
						marginTop: 100,
						backgroundColor: 'white',
						borderRadius: 20,
						padding: 10,
					}}>
<Text style={{color:"#000", textAlign:"center"}}>Create Address</Text>
						{/* <GooglePlacesAutocomplete
							placeholder="Search Address"
							fetchDetails={true}
							onPress={(data, details = null) => {
								console.log(data, 'and', details)
								if (!details || !details.address_components) {
									console.warn("Missing address_components:", details);
									return;
								}
								const addressComponents = details.address_components;
								const getComponent = (type) =>
									addressComponents.find(c => c.types.includes(type))?.long_name || '';

								setPayload(prev => ({
									...prev,
									address: data.description,
									city: getComponent('locality'),
									state: getComponent('administrative_area_level_1'),
									country: getComponent('country'),
									postal_code: getComponent('postal_code'),
									latitude: details?.geometry?.location?.lat || '',
									longitude: details?.geometry?.location?.lng || '',
								}));
							}}
							query={{
								key: 'AIzaSyAEmQkljU2eVrGt64vyIK7FGOLQ7AalV_M',
								language: 'en',
								types: 'geocode',
							}}
							onFail={error => console.log(error)}
							enablePoweredByContainer={false}
							styles={{
								textInput: {
									height: 40,
									borderColor: '#ccc',
									borderWidth: 1,
									borderRadius: 8,
									paddingHorizontal: 10,
									marginBottom: 10,
								},
							}}
						/> */}
						<View style={styles.inputWrapper}>
							<TextInput
								placeholder="Enter address"
								style={styles.inputField}
								value={Payload.address}
								onChangeText={(text) => {
									setPayload(prev => ({ ...prev, address: text }));
									setAddressStatus('idle');
								}}
							/>
							<TouchableOpacity onPress={checkAddress}>
								{addressStatus === 'idle' && <Icon name="search-outline" size={22} color="#622cfc" />}
								{addressStatus === 'success' && <Icon name="checkmark-circle" size={22} color="green" />}
								{addressStatus === 'fail' && <Icon name="close-circle" size={22} color="red" />}
							</TouchableOpacity>
						</View>

						<TextInput
							placeholder="Postal Code"
							style={styles.input}
							value={Payload.postal_code}
							onChangeText={text => setPayload({ ...Payload, postal_code: text })}
						/>
						<TextInput
							placeholder="City"
							style={styles.input}
							value={Payload.city}
							onChangeText={text => setPayload({ ...Payload, city: text })}
						/>
						<TextInput
							placeholder="State"
							style={styles.input}
							value={Payload.state}
							onChangeText={text => setPayload({ ...Payload, state: text })}
						/>
						<TextInput
							placeholder="Country"
							style={styles.input}
							value={Payload.country}
							onChangeText={text => setPayload({ ...Payload, country: text })}
						/>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
							<TouchableOpacity
								style={[styles.summaryItem, { backgroundColor: '#eee' }]}
								onPress={() => setShowModal(false)}
							>
								<Text style={{ fontWeight: 'bold', padding:5 }}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.summaryItem, { backgroundColor: '#622cfc' }]}
								onPress={() => {
									if (Payload.latitude && Payload.longitude) {
										handleAddress();
										setShowModal(false);
									} else {
										Alert.alert('Please select a valid address from the suggestions');
									}
								}}
							>
								<Text style={{ color: '#fff', fontWeight: 'bold', padding:5 }}>Submit</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			</ImageBackground>
			</SafeAreaView>
		</>
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: '15%',
		width,
		height: BACKDROP_HEIGHT,
	},
	model:{
		height:'100%',
		width:'100%',
		backgroundColor:'#fff',
		borderTopRightRadius:20,
		borderTopLeftRadius:20,
	},
	 searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  profile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 10,
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
	input: {
	borderWidth: 1,
	borderColor: '#ccc',
	borderRadius: 8,
	paddingHorizontal: 10,
	paddingVertical: 8,
	marginVertical: 6,
	width: '100%',
},
	logotext:{
		top:30,
	},
	inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 10,
  height: 40,
  justifyContent: 'space-between',
},

inputField: {
  flex: 1,
  paddingRight: 8,
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
		color:'#000',
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
		color:'#36454F',
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
		width: '99%',
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
		paddingTop:9,
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
		gap: 3,
		borderWidth:0,
		borderRadius:8,
		paddingRight:6,
		padding:1,
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
