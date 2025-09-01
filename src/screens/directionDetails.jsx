import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert,   PermissionsAndroid, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
import Tts from 'react-native-tts';
import { getDistance as lp } from 'geolib';


Tts.setDefaultLanguage('en-US');
Tts.setDefaultRate(0.45);


export default function Directions({route}) {
    const mapJson = [
    {
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#ebe3cd',
        },
      ],
    },
    {
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#523735',
        },
      ],
    },
    {
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#f5f1e6',
        },
      ],
    },
    {
      'featureType': 'administrative',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#c9b2a6',
        },
      ],
    },
    {
      'featureType': 'administrative.land_parcel',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#dcd2be',
        },
      ],
    },
    {
      'featureType': 'administrative.land_parcel',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#ae9e90',
        },
      ],
    },
    {
      'featureType': 'landscape.natural',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#dfd2ae',
        },
      ],
    },
    {
      'featureType': 'poi',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#dfd2ae',
        },
      ],
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#93817c',
        },
      ],
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#a5b076',
        },
      ],
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#447530',
        },
      ],
    },
    {
      'featureType': 'road',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#f5f1e6',
        },
      ],
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#fdfcf8',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#f8c967',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#e9bc62',
        },
      ],
    },
    {
      'featureType': 'road.highway.controlled_access',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#e98d58',
        },
      ],
    },
    {
      'featureType': 'road.highway.controlled_access',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#db8555',
        },
      ],
    },
    {
      'featureType': 'road.local',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#806b63',
        },
      ],
    },
    {
      'featureType': 'transit.line',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#dfd2ae',
        },
      ],
    },
    {
      'featureType': 'transit.line',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#8f7d77',
        },
      ],
    },
    {
      'featureType': 'transit.line',
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#ebe3cd',
        },
      ],
    },
    {
      'featureType': 'transit.station',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#dfd2ae',
        },
      ],
    },
    {
      'featureType': 'water',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#b9d3c2',
        },
      ],
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#92998d',
        },
      ],
    },
  ];
  const { lat, lng } = route.params;
  const [Start, setStart] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [JourneyDetails, setJourneyDetails] = useState({});
  const [Origin, setOrigin] = useState(null);
  const [Destination, setDestination] = useState(null);
  const [LiveLocation, setLiveLocation] = useState(null);
  const [ReverseLocation, setReverseLocation] = useState(null);

  const [navigationSteps, setNavigationSteps] = useState([]);
  const [spokenInstructions, setSpokenInstructions] = useState([]);
  // For distance in meters/kilometers
  const [distance, setDistance] = useState(null);
  // For duration in minutes
  const [duration, setDuration] = useState(null);

  const [IsOpen, setIsOpen] = useState(true);

  const [Loading, setLoading] = useState(false);

  const navigate = useNavigation();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [routeCoords, setRouteCoords] = useState([]);
  const [cameraSet, setCameraSet] = useState(false);

  const bottomSheetRef = useRef(null);

  const snapToIndex = (index) => bottomSheetRef.current.snapToIndex(index);
  const OpenBottom = () => bottomSheetRef.current.expand();

  const snapPoints = useMemo(() => ['15%', '25%', '38', '65%', '100%'], []);

  const mapRef = useRef();

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
				console.log('there is no permision granted');
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
        setLiveLocation({ latitude, longitude });
        const originAddress = await getAddressFromCoords(latitude, longitude);
        const destAddress = await getAddressFromCoords(lat, lng);

        const newOrigin = { latitude, longitude, address: originAddress };
        const newDest = { latitude: lat, longitude: lng, address: destAddress };

        // Avoid unnecessary state updates
        const isSameOrigin = JSON.stringify(Origin) === JSON.stringify(newOrigin);
        const isSameDest = JSON.stringify(Destination) === JSON.stringify(newDest);

        if (!isSameOrigin) {setOrigin(newOrigin);}
        if (!isSameDest) {setDestination(newDest);}

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
    mapRef.current.animateCamera({
      center: { latitude, longitude },
      pitch: 60,   // tilt for 3D
      heading: 0,  // you can update heading from bearing
      zoom: 18,    // driving zoom
    }, { duration: 1000 });
  };
  const onRegionChange = (region) => {
    // console.log("region", region)
    // OpenBottom()
  };
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

  const getDistance = async () => {
    try {
      console.log(Destination , 'Origin pat', Origin);
      if (!Origin || !Destination) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading map...</Text>
          </View>
        );
      }
      let result = await GetDistanceGoogleAPI({
        origin: `${Origin.latitude}, ${Origin.longitude}`,
        destination: `${Destination.address}`,
      });
      console.log('getDistance pat', result);
      if (result.status === 200 && result.data) {
        console.log('.data pat', result.data);
        setJourneyDetails(result.data);
        setStart(true);// If your API returns distance & duration directly:
        if (result.data.distance && result.data.duration) {
          setDistance(result.data.distance);
          setDuration(result.data.duration);
        } 
        // If it follows Google Distance Matrix JSON structure:
        else if (result.data.rows?.[0]?.elements?.[0]?.distance?.text) {
          setDistance(result.data.rows[0].elements[0].distance.text);
          setDuration(result.data.rows[0].elements[0].duration.text);
        }

      } else {
        console.warn('No valid data returned from GetDistanceGoogleAPI');
      }
    } catch (e) {
      console.error('Error in getDistance', e);
    }
  };
// 2️⃣ Poll route updates every few seconds *after* trip starts
useEffect(() => {
  getPermissions();
  if (Start && Origin && Destination) {
    const interval = setInterval(() => {
      getPermissions();  // Refresh live location
      getDistance();     // Refresh Google API route data
    }, 4000);
    return () => clearInterval(interval);
  }
}, [Start, Origin, Destination]);

// useEffect(() => {
//   if (navigationSteps.length === 0 || !LiveLocation) return;
// // Ensure steps is always an array
//   const stepsArray = Array.isArray(navigationSteps) ? navigationSteps : [navigationSteps];

//   const nextStep = stepsArray.find(step => {
//     const dist = lp(
//       { latitude: LiveLocation.latitude, longitude: LiveLocation.longitude },
//       { latitude: step.end_location.lat, longitude: step.end_location.lng }
//     );
//     return dist < 40; // Trigger voice within 40 meters
//   });
//   console.log(stepsArray, "spokenInstructions")
//   if (nextStep && !spokenInstructions.includes(nextStep.html_instructions)) {
//     const cleanInstruction = nextStep.html_instructions.replace(/<[^>]*>/g, '');
//     Tts.stop();
//     Tts.speak(cleanInstruction);
//     setSpokenInstructions(prev => [...prev, nextStep.html_instructions]);
//   }
// }, [LiveLocation, navigationSteps, spokenInstructions]);



  useEffect(() => {
    if (!navigationSteps || navigationSteps.length === 0) return;

    const stepsArray = Array.isArray(navigationSteps) ? navigationSteps : [navigationSteps];
    const step = stepsArray[currentStepIndex];

    if (step && !spokenInstructions.includes(step.html_instructions)) {
      const cleanInstruction = step.html_instructions.replace(/<[^>]*>/g, '');
      Tts.stop();
      Tts.speak(cleanInstruction);
      setSpokenInstructions(prev => [...prev, step.html_instructions]);
    }
  }, [currentStepIndex, navigationSteps]);

  // Advance step automatically when user gets close
  useEffect(() => {
    if (!LiveLocation || !navigationSteps || navigationSteps.length === 0) return;

    const stepsArray = Array.isArray(navigationSteps) ? navigationSteps : [navigationSteps];
    const step = stepsArray[currentStepIndex];

    if (!step) return;

    const dist = lp(
      { latitude: LiveLocation.latitude, longitude: LiveLocation.longitude },
      { latitude: step.end_location.lat, longitude: step.end_location.lng }
    );

    // Within 50 meters → move to next instruction
    if (dist < 50) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [LiveLocation, currentStepIndex, navigationSteps]);


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
    if (result.status === 201) {
      setCurrentStepIndex(0);       // reset to first step
      setSpokenInstructions([]);
      getDistance(); // This can take time and call setStart again

       // 🎥 Force driving 3D camera
      if (Origin) {
        mapRef.current.animateCamera({
          center: Origin,
          pitch: 90,
          heading: 0,
          zoom: 19,
        }, { duration: 1000 });
      }
    }
  } catch (e) {
    console.log(e);
    alert(e.message);
  } finally {
    setLoading(false); // Always turn off loading
  }
};
useEffect(() => {
  if (navigationSteps.length > 0) {
    setCurrentStepIndex(0);
    setSpokenInstructions([]);
  }
}, [navigationSteps]);

  const LightTheBulb = async () => {
    setLoading(true);
    try {
			const userToken = await AsyncStorage.getItem('accessToken');
      let result = await TriggerAdrinoApi(userToken, {
        updateReason: 'trigger arduino',
      });
      console.log('LightTheBulb', result);
      console.log(result);
      if (result.status === 200) {
        setTrigger(true);
        alert("LED has been Triggered. Kindly end trip when you've confirm your destination");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };
  const EndTrip = async () => {
    setLoading(true);
		const userToken = await AsyncStorage.getItem('accessToken');
    try {
      let result = await TriggerAdrinoApi(userToken, {
        updateReason: 'end trip',
      });
      console.log( 'EndTrip',result);
      if (result.status === 200) {
        setTrigger(false);
        setStart(false);
        alert('You have ended the Trip. Thank you');
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };
useEffect(() => {
  if (Start && LiveLocation) {
    mapRef.current.animateCamera({
      center: LiveLocation,
      pitch: 60,
      heading: 0,  // you could calculate bearingFrom(prevLocation, LiveLocation)
      zoom: 18,
    }, { duration: 500 });
  }
}, [LiveLocation, Start]);

const bearingFrom = (from, to) => {
  if (!to) return 0;
  const lat1 = from.latitude * Math.PI / 180;
  const lon1 = from.longitude * Math.PI / 180;
  const lat2 = to.latitude * Math.PI / 180;
  const lon2 = to.longitude * Math.PI / 180;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let brng = Math.atan2(y, x);
  brng = brng * 180 / Math.PI;
  return (brng + 360) % 360;
};

  
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
              latitudeDelta: 0.01, // much closer
              //longitudeDelta: 0.01,
             //latitudeDelta: 20.01124,
              longitudeDelta: 20.01123,
            }}
            customMapStyle={mapJson}>
            showsCompass={false}
            zoomControlEnabled={false}

            showsUserLocation
            followsUserLocation
            showsBuildings
            showsTraffic
            showsIndoors
            {Origin !== null && (
                <Marker
                  coordinate={Origin}
                  flat
                  anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <View style={{ width: 200, height: 20 }}>
                      <Image
                        source={require('../assets/arrow.png')}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                      />
                    </View>

                  </Marker>
              )}
            { Destination !== null && (
                <Marker
                  onPress={OpenBottom}
                  coordinate={Destination}
                  pinColor="#000fff"
                  onDragEnd={(e) => setDraggableMarker(e.nativeEvent.coordinate)} />
              )}
            { Origin !== undefined && Destination !== undefined ?
                <MapViewDirections
                  origin={Origin}
                  destination={Destination}
                  apikey={GOOGLE_DIRECTION_API_KEY}
                  strokeColor="blue"
                  lineDashPattern={[1]} // smooth line
                  strokeWidth={8}
                  onReady={result => {
                    setRouteCoords(result.coordinates); // save all route points
                    setNavigationSteps(result.legs?.[0]?.steps || []);
                    // 🎥 tilt the camera for 3D view
                    if (!cameraSet && Origin) {
                      mapRef.current.animateCamera({
                        center: Origin,
                        pitch: 90,
                        heading: 0,
                        zoom: 18,
                      }, { duration: 1000 });
                       // don’t reset camera again
                      setCameraSet(true);
                    }
                  }}
                  onError={error => console.warn(error)}
                  onFail={error => console.log(error)}
                /> : null
            }
            {routeCoords.map((coord, i) => {
              if (i % 20 === 0 && routeCoords[i + 1]) {
                return (
                  <Marker
                    key={`arrow-${i}`}
                    coordinate={coord}
                    anchor={{ x: 0.5, y: 0.5 }}
                    flat
                    rotation={bearingFrom(coord, routeCoords[i + 1])}
                  >
                     <Image
                      source={require('../assets/arrow.png')}
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                        transform: [{ rotate: `${bearingFrom(Origin, Destination)}deg` }],
                      }}
                    />
                  </Marker>
                );
              }
              return null;
            })}

          </MapView>
          <BottomSheet
            snapPoints={snapPoints}
            index={0}
            ref={bottomSheetRef}
            keyboardBehavior="fillParent"
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: '#880ED4', width: '30%' }}
            backgroundStyle={{ backgroundColor: '#fff' }}
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
              <View style={{ flexDirection: 'row', flex: 0.5, justifyContent: 'space-between' }}>
                <View style={{ width: '48%' }} />
                <View style={{ width: '48%' }} />
              </View>
              { Origin !== null && Destination !== null && Start === false && (
                  <TouchableOpacity
                    style={globalStyles.btn}
                    onPress={StartTrip}>
                    <Text style={globalStyles.showText}>{Loading ? 'Please wait...' : 'Start Journey'}</Text>
                  </TouchableOpacity>
                )}
              {JourneyDetails && JourneyDetails?.rows?.[0]?.elements[0]?.distance?.value <= 1000 && Trigger === false && Start === true  && (
                  <TouchableOpacity
                    style={globalStyles.btn}
                    onPress={LightTheBulb}>
                    <Text style={globalStyles.showText}>{Loading ? 'Please wait...' : 'Trigger LED'}</Text>
                  </TouchableOpacity>
                )}
                { Trigger === true && (
                    <TouchableOpacity
                    style={globalStyles.btn}
                    onPress={EndTrip}>
                    <Text style={globalStyles.showText}>{Loading ? 'Please wait...' : 'End Trip'}</Text>
                  </TouchableOpacity>
                  )}
              { Start === true && (
                  <View style={styles.mt}>
                    <Text style={styles.titleHead}>Trip has Started </Text>
                   {/* <Text style={styles.text}>Distance is ~ {JourneyDetails && JourneyDetails?.rows[0].elements[0].distance.text} </Text>
                    <Text style={styles.text}>Duration is ~ {JourneyDetails && JourneyDetails.rows[0].elements[0].duration.text} </Text>
                    */} 
                    <Text style={styles.text}>{`Distance is: ${distance}`}</Text>
                    <Text style={styles.text}>{`Duration is: ${duration}`}</Text>

                    <Text style={styles.text}>Origin Latitude is ~ {Origin.latitude} </Text>
                    <Text style={styles.text}>Origin Longitude is ~ {Origin.longitude} </Text>
                  </View>
                )}
              <TouchableOpacity
                style={globalStyles.btn}
                onPress={() => navigate.goBack()}>
                <Text style={globalStyles.showText}>{'<'} Go back</Text>
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
              width: '100%',
              backgroundColor: '#880ED4',
              color: '#fff',
              marginTop: 2,
              paddingVertical: Platform.OS === 'ios' ? 15 : 10,
              paddingHorizontal: 15,
              borderRadius: 0,
              width: '100%',
              alignSelf: 'center',
              marginTop: 22,
              marginBottom: 11,
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
    zIndex: -1,
  },
  titleHead: {
    fontSize: 25,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '900',
    color: '#880ED4',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'capitalized',
    fontWeight: '500',
    color: '#244242',
    letterSpacing: 2,
  },
  mt: {
    marginTop: 32,
    marginBottom: 32,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
