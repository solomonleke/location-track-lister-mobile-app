import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert,   PermissionsAndroid, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { globalStyles } from '../styles/Global';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_DIRECTION_API_KEY, GOOGLE_PLACES_API_KEY } from '../Utilities/Config';
import { useNavigation } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetDistanceGoogleAPI, StartTripApi, TriggerAdrinoApi, UpdateProfileAPI } from '../Utilities/ApiCalls';

export default function Directions({route}) {
  const { lat, lng } = route.params;
  const [Start, setStart] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [JourneyDetails, setJourneyDetails] = useState({});
  const [Origin, setOrigin] = useState(null);
  const [Destination, setDestination] = useState(null);
  const [LiveLocation, setLiveLocation] = useState(null);
  const [ReverseLocation, setReverseLocation] = useState(null);

  const [IsOpen, setIsOpen] = useState(true);

  const [Loading, setLoading] = useState(false);

  const navigate = useNavigation()


 
  const bottomSheetRef = useRef(null);

  const snapToIndex = (index) => bottomSheetRef.current.snapToIndex(index)
  const OpenBottom = () => bottomSheetRef.current.expand()
   
  const snapPoints = useMemo(() => ['15%', '25%', "38", "65%", "100%"], []);

  const mapRef = useRef()

 const getPermissions = async () => {
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
const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`
    );
    const json = await response.json();
    if (json.results && json.results.length > 0) {
      return json.results[0].formatted_address;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Reverse geocoding failed', error);
    return null;
  }
};
const getUserLocation = async () => {
  setLoading(true);
  try {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        moveToLocationX(latitude, longitude);
        const originAddress = await getAddressFromCoords(latitude, longitude);
        const destAddress = await getAddressFromCoords(lat, lng);

        const newOrigin = { latitude, longitude, address: originAddress };
        const newDest = { latitude: lat, longitude: lng, address: destAddress };

        // Avoid unnecessary state updates
        const isSameOrigin = JSON.stringify(Origin) === JSON.stringify(newOrigin);
        const isSameDest = JSON.stringify(Destination) === JSON.stringify(newDest);

        if (!isSameOrigin) setOrigin(newOrigin);
        if (!isSameDest) setDestination(newDest);

        setLoading(false);
      },
      (error) => {
        console.error(error);
        Alert.alert('Error', 'Unable to fetch location.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  } catch (err) {
    console.error('Unhandled error', err);
    setLoading(false);
  }
};

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
    // console.log("region", region)
    // OpenBottom()
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
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ]
const getDistance = async () => {
  try {
    console.log(Destination , "Origin pat", Origin);
    if (!Origin || !Destination) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading map...</Text>
        </View>
      );
    }
    let result = await GetDistanceGoogleAPI({
      origin: `${Origin.latitude}, ${Origin.longitude}`,
      destination: `${Destination.address}`
    });
    console.log("getDistance pat", result);
    if (result.status === 200 && result.data) {
      console.log(".data pat", result.data);
      setJourneyDetails(result.data);
      setStart(true);
    } else {
      console.warn("No valid data returned from GetDistanceGoogleAPI");
    }
  } catch (e) {
    console.error("Error in getDistance", e);
  }
};
  useEffect(() => {
    getPermissions()
    if (Start === true && Origin && Destination) {
      const interval = setInterval(() => {
        getPermissions();
        getDistance();
      }, 4000);
      return () => clearInterval(interval);
    }
}, [Start, Origin, Destination]);

 const StartTrip = async () => {
  setLoading(true);
  try {
    const userToken = await AsyncStorage.getItem('accessToken');
    let result = await StartTripApi(userToken, {
      destinationCoordinates: {
        lat: Destination.latitude,
        long: Destination.longitude,
      },
    });
    console.log(result.data, 'jk', result.status, "result........................................")
    if (result.status === 201) {
      getDistance(); // This can take time and call setStart again
    }
  } catch (e) {
    console.log(e);
    alert(e.message);
  } finally {
    setLoading(false); // Always turn off loading
  }
};

  const LightTheBulb = async () => {
    setLoading(true)
    try {
			const userToken = await AsyncStorage.getItem('accessToken');
      let result = await TriggerAdrinoApi(userToken, {
        updateReason: "trigger arduino"
      })
      console.log("LightTheBulb", result)
      console.log(result)
      if (result.status === 200) {
        setTrigger(true)
        alert("LED has been Triggered. Kindly end trip when you've confirm your destination")
        setLoading(false)
      }
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }
  const EndTrip = async () => {
    setLoading(true)
		const userToken = await AsyncStorage.getItem('accessToken');
    try {
      let result = await TriggerAdrinoApi(userToken, {
        updateReason: "end trip"
      })
      console.log( "EndTrip",result)
      if (result.status === 200) {
        setTrigger(false)
        setStart(false)
        alert("You have ended the Trip. Thank you")
        setLoading(false)
      }
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }


  return (
    <View
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mapContainer}>
      <View>
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
            customMapStyle={mapJson}>
            {Origin !== null && (
                <Marker
                  onPress={OpenBottom}
                  coordinate={Origin}
                  onDragEnd={(e) => setDraggableMarker(e.nativeEvent.coordinate)}>
                </Marker>
              )}
            { Destination !== null && (
                <Marker
                  onPress={OpenBottom}
                  coordinate={Destination}
                  pinColor='#000fff'
                  onDragEnd={(e) => setDraggableMarker(e.nativeEvent.coordinate)}>
                </Marker>
              )}
            { Origin !== undefined && Destination !== undefined ?
                <MapViewDirections
                  origin={Origin}
                  destination={Destination}
                  apikey={GOOGLE_DIRECTION_API_KEY}
                  strokeColor="#880ED4"
                  strokeWidth={5}
                  onFail={error => console.log(error)}
                /> : null
            }
          </MapView>
          <BottomSheet
            snapPoints={snapPoints}
            index={0}
            ref={bottomSheetRef}
            keyboardBehavior="fillParent"
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: "#880ED4", width: "30%" }}
            backgroundStyle={{ backgroundColor: "#fff" }}
            enablePanDownToClose={true}
            handleStyle={{ borderRadius: 20, zIndex: 5 }}
            onChange={(index) => {
              if (index < 0) {
                setIsOpen(false);
              } else {
                setIsOpen(true);
              }
            }}>
            <BottomSheetView style={styles.contentContainer}>
            <TouchableOpacity onPress={getPermissions}>
              <Text>Use Current Location</Text>
            </TouchableOpacity>
              <View style={{ flexDirection: "row", flex: 0.5, justifyContent: "space-between" }}>
                <View style={{ width: "48%" }}>
                </View>
                <View style={{ width: "48%" }}>
                </View>
              </View>
              { Origin !== null && Destination !== null && Start === false && (
                  <TouchableOpacity
                    style={globalStyles.btn}
                    onPress={StartTrip}>
                    <Text style={globalStyles.showText}>{Loading ? "Please wait..." : "Start Journey"}</Text>
                  </TouchableOpacity>
                )}
              {JourneyDetails && JourneyDetails?.rows?.[0]?.elements[0]?.distance?.value <= 4000 && Trigger === false && Start === true  && (
                  <TouchableOpacity
                    style={globalStyles.btn}
                    onPress={LightTheBulb}>
                    <Text style={globalStyles.showText}>{Loading ? "Please wait..." : "Trigger LED"}</Text>
                  </TouchableOpacity>
                )}
                { Trigger === true && (
                    <TouchableOpacity
                    style={globalStyles.btn}
                    onPress={EndTrip}>
                    <Text style={globalStyles.showText}>{Loading ? "Please wait..." : "End Trip"}</Text>
                  </TouchableOpacity>
                  )}
              { Start === true && (
                  <View style={styles.mt}>
                    <Text style={styles.titleHead}>Trip has Started </Text>
                    <Text style={styles.text}>Distance is ~ {JourneyDetails && JourneyDetails.rows[0].elements[0].distance.text} </Text>
                    <Text style={styles.text}>Duration is ~ {JourneyDetails && JourneyDetails.rows[0].elements[0].duration.text} </Text>
                    <Text style={styles.text}>Origin Latitude is ~ {Origin.latitude} </Text>
                    <Text style={styles.text}>Origin Longitude is ~ {Origin.longitude} </Text>
                  </View>
                )}
              <TouchableOpacity
                style={globalStyles.btn}
                onPress={() => navigate.goBack()}>
                <Text style={globalStyles.showText}>{`<`} Go back</Text>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        </>
      </View>
      { IsOpen === false && (
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
              width: "100%",
              alignSelf: "center",
              marginTop: 22,
              marginBottom: 11
            }]}
            onPress={OpenBottom}>
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
  titleHead: {
    fontSize: 25,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "900",
    color: "#880ED4"
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    textTransform: "capitalized",
    fontWeight: "500",
    color: "#244242",
    letterSpacing: 2
  },
  mt: {
    marginTop: 32,
    marginBottom: 32,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
});
