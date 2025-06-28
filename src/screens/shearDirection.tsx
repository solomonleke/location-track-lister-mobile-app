import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, PermissionsAndroid, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Animated, Easing, View, Alert } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalStyles} from '../styles/Global';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_PLACES_API_KEY } from '../Utilities/Config';
import { useNavigation } from '@react-navigation/native';
// import * as Permissions from 'expo-permissions';
import { SendAddressAPI, UpdateProfileAPI } from '../Utilities/ApiCalls';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import 'react-native-get-random-values';

export default function ShearDirection({  route , navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const mapRef = useRef()
  const [Search, setSearch] = useState("");
  const [Index, setIndex] = useState(0);
  const [MaxPoint, setMaxPoint] = useState('38%');
  const [KeyBoardStatus, setKeyBoardStfatus] = useState(false);
  const [location, setLocation] = useState(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(null);
  const [Loading, setLoading] = useState(false);

  // const { userToken } = useSelector(state => state.User)

  const [IsOpen, setIsOpen] = useState(true);
  const [Email, setEmail] = useState("");
  const [Address, setAddress] = useState("");

  const [predictions, setPredictions] = useState([]);


  const navigate = useNavigation()

  const bottomSheetRef = useRef(null);

  const snapToIndex = (index) => bottomSheetRef.current?.snapToIndex(index)
  const OpenBottom = () => bottomSheetRef.current?.expand()


  const [DraggableMarker, setDraggableMarker] = useState(null);
  const [showInput, setShowInput] = useState(false); // controls input visibility
  const [calloutRef, setCalloutRef] = useState(null); // callout ref
  const [searchVisible, setSearchVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current; // initially off-screen

  const [hasPermission, setHasPermission] = useState(null);
  const snapPoints = useMemo(() => ['15%', '25%', "38%", "65%", "100%"], []);
  

	const requestLocationPermission = async () => {
		if (Platform.OS === 'android') {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
			);
			return granted === PermissionsAndroid.RESULTS.GRANTED;
		}
		return true;
	};

	const getCurrentLocation = async () => {
		const hasPermission = await requestLocationPermission();

		if (!hasPermission) return;

		Geolocation.getCurrentPosition(
			position => {
				setLocation(position.coords);
				setDraggableMarker({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			},
			error => {
				console.error(error);
			},
			{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
		);
	};


	const toggleSearch = () => {
    if (searchVisible) {
      Animated.timing(slideAnim, {
        toValue: 100, // slide down
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => setSearchVisible(false));
    } else {
      setSearchVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, // slide up into view
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    if (calloutRef) {
      calloutRef.showCallout(); // show callout automatically
    }
  }, [calloutRef]);

	const deviceId = DeviceInfo.getDeviceId();
	const appVersion = DeviceInfo.getVersion();

  const moveToLocationX = async (latitude, longitude) => {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01124,
      longitudeDelta: 0.01123
    },
      2000)
  }

  
  const onRegionChange = (region) => {

  }
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    []
  );

  const mapJson = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ]

   const UpdateAdrino = async () => {
    try {
      let result = await UpdateProfileAPI(userToken, {
        arduinoAddress: {
          lat: DraggableMarker.latitude,
          long: DraggableMarker.longitude,
        }
      })
      console.log(result)
      if(result.data.status === 200){
        alert("Arduino Address Updated Successfully")
        setLoading(false)
      }

    } catch (e) {
      console.log(e)
    }
  }

  const ShareAddress = async () => {
    const userToken = await AsyncStorage.getItem('accessToken');
    setLoading(true)
    const payload = {
      type: "ADDRESS_SHARE",
      address: {
        addressLine: Address,
        coordinates: {
          lat: DraggableMarker.latitude,
          long: DraggableMarker.longitude,
        }
      },
      sharedTo: Email
    }

    try{
      let result = await SendAddressAPI(userToken, payload)

      console.log("SendAddressAPI", result)
      if(result.status === 201){
        Alert.alert("Address Shared Successfully")
        UpdateAdrino()
      }
    }catch(e){
      console.log(e)
      setLoading(false)
    }
    console.log("payload", payload)
  }


  useEffect(() => {
		getCurrentLocation()
  }, []);
  return (


    <View
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mapContainer}>

      <TouchableOpacity onPress={Keyboard.dismiss} accessible={false}>
        {/* provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT} */}
        <>


          <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            ref={mapRef}
            style={styles.map}
            onRegionChange={onRegionChange}
            initialRegion={{
              latitude: 9.0,
              longitude: 8.6,
              latitudeDelta: 20.01124,
              longitudeDelta: 20.01123


            }}
            customMapStyle={mapJson}
          >

            {DraggableMarker && (
              <Marker
                coordinate={DraggableMarker}
                draggable
                onDragEnd={(e) => setDraggableMarker(e.nativeEvent.coordinate)}
                ref={(ref) => {
                  if (ref && !calloutRef) setCalloutRef(ref);
                }}
              >
                {/* <Callout tooltip>
                  {showInput ? (
                    <View style={styles.calloutContainer}>
                      <TouchableOpacity onPress={() => setShowInput(false)} style={styles.iconLeft}>
                        <Text style={styles.iconText}>✖️</Text>
                      </TouchableOpacity>

                      <TextInput
                        placeholder="Enter address"
                        value={Address}
                        onChangeText={setAddress}
                        style={styles.input}
                      />

                      <TouchableOpacity onPress={ShareAddress} style={styles.iconRight}>
                        <Text style={styles.iconText}>📤</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.button} onPress={() => setShowInput(true)}>
                      <Text style={{ color: 'white' }}>Shear Address</Text>
                    </TouchableOpacity>
                  )}
                </Callout> */}
              </Marker>
            )}

          </MapView>
               <View style={styles.statusTag}>
                <TextInput
                  value={Search}
                  onChangeText={async (text) => {
                    setSearch(text);
                    if (text.length > 2) {
                      try {
                        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
                          params: {
                            input: text,
                            key: GOOGLE_PLACES_API_KEY,
                            language: 'en'
                          }
                        });
                        setPredictions(response.data.predictions);
                      } catch (err) {
                        console.error("Autocomplete API error", err);
                      }
                    } else {
                      setPredictions([]);
                    }
                  }}
                  placeholderTextColor="#fff"
                  placeholder="Search location"
                  style={{
                    borderColor: '#ddd',
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    height: 40,
                    width:280,
                    color: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }}
                />

                {predictions.length > 0 && (
                  <FlatList
                    data={predictions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#fff',
                          padding: 10,
                          borderBottomColor: '#eee',
                          borderBottomWidth: 1
                        }}
                        onPress={async () => {
                          try {
                            const res = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
                              params: {
                                key: GOOGLE_PLACES_API_KEY,
                                place_id: item.place_id
                              }
                            });

                            const details = res.data.result;
                            const { lat, lng } = details.geometry.location;

                            console.log("autolocation", JSON.stringify(details.geometry.location));
                            console.log("DETAILS", details.formatted_address);

                            setAddress(details.formatted_address);
                            moveToLocationX(lat, lng);
                            setDraggableMarker({
                              latitude: lat,
                              longitude: lng
                            });
                            setPredictions([]);
                            setSearch(details.name);
                            snapToIndex(0);
                          } catch (err) {
                            console.error("Details fetch error", err);
                          }
                        }}
                      >
                        <Text>{item.description}</Text>
                      </TouchableOpacity>
                    )}
                    style={{
                      maxHeight: 200,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderTopWidth: 0
                    }}
                    keyboardShouldPersistTaps="handled"
                  />
                )}
                 {
                DraggableMarker && (
                  <TouchableOpacity onPress={toggleSearch} style={{
                    position: 'absolute',
                    left: -50,
                    bottom: -100,
                    alignItems:"center",
                    alignSelf:"center",
                    alignContent:"center",
                    backgroundColor: '#622cfc',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    zIndex: 9999
                  }}>
                    <Text style={{ color: 'white' }}>Shear address 🔍</Text>
                  </TouchableOpacity>
                )}
                </View>

                {searchVisible && (
            <Animated.View style={{
              position: 'absolute',
              bottom: slideAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['50%', '-100%']
              }),
              alignSelf: 'center',
              width: '90%',
              //backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 10,
              padding: 10,
              zIndex: 9999,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: 'white',
              }}>
                <TextInput
                  placeholder="Enter Guest Email Address.."
                  keyboardType='email-address'
                  returnKeyType='next'
                  value={Email}
                  onChangeText={(val) => setEmail(val)}
                  placeholderTextColor="gray"
                  style={{
                    flex: 1,
                    color: '#000',
                    paddingVertical: 8,
                  }}
                />
                <TouchableOpacity onPress={ShareAddress}>
                  {Loading ?  <Text style={{color:'blue'}}>shearin.....</Text> :  <Icon name="send-outline" size={22} color="#555" />}
                 
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* <BottomSheet
            snapPoints={snapPoints}
            index={0}
            ref={bottomSheetRef}
            keyboardBehavior="fillParent"
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: "#880ED4", width: "30%" }}
            backgroundStyle={{ backgroundColor: "#fff" }}
            enablePanDownToClose={false}
            handleStyle={{ borderRadius: 20, zIndex: 5 }}
            onChange={(index) => {
              if (index < 0) {
                setIsOpen(false);
              } else {
                setIsOpen(true);
              }
            }}

          >
            <BottomSheetView style={styles.contentContainer}>


              <View style={{ flex: 0.5, zIndex: 1, marginTop: 7 }} >
   {
                DraggableMarker && (
                  <>
                    <TextInput placeholder='Enter Guest Email Address'
                      keyboardType='email-address'
                      returnKeyType='next'
                      value={Email}
                      onChangeText={(val) => setEmail(val)}
                      style={globalStyles.input} />

                    <TouchableOpacity
                      style={globalStyles.btn}
                      onPress={ShareAddress}

                    >
                      <Text style={globalStyles.showText}> {Loading ? "Sharing Address. Please wait...": "Share Address"} </Text>
                    </TouchableOpacity>
                  </>
                )
              }
              </View>
            </BottomSheetView>
          </BottomSheet> */}

        </>
      </TouchableOpacity>
      {
        IsOpen === false && (
          <TouchableOpacity
            style={[{
              position: 'absolute',
              bottom: 15,
              width: "100%",
              backgroundColor: "#880ED4",
              color: "#fff",
              marginTop: 2,
              paddingVertical: Platform.OS === "ios" ? 15 : 10,
              paddingHorizontal: 15,
              borderRadius: 0,
              alignSelf: "center",
              marginTop: 22,
              marginBottom: 11
            }]}
            onPress={OpenBottom}
          >
            <Text style={globalStyles.showText}>Search</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: '100%',
    zIndex: -1,
    flex: 1,
  },
  map: {
    marginTop: 0,
    width: '100%',
    height: '100%',
    zIndex: -1
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
  button: {
		backgroundColor: '#36454F',
		borderRadius: 10,
		paddingVertical: 10,
	
		paddingHorizontal: 20,
		width: '100%',
	},
  calloutContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 5,
  minWidth: 250,
},

input: {
  flex: 1,
  height: 40,
  paddingHorizontal: 10,
  borderRadius: 5,
  backgroundColor: '#f0f0f0',
  marginHorizontal: 5,
},

iconLeft: {
  padding: 5,
},

iconRight: {
  padding: 5,
},

iconText: {
  fontSize: 18,
},

  statusTag: {
    zIndex: 9999,
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    alignItems: 'center',
    // elevation: 4,
  },

});
function alert(arg0: string) {
	throw new Error('Function not implemented.');
}

