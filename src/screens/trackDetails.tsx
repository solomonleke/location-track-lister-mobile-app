import React from 'react';
import { View, Platform, Text, Image, PermissionsAndroid, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import Geolocation from 'react-native-geolocation-service';

const { width, height } = Dimensions.get('window');

export default function TrackDetail({route}) {
  const { title, loc, description, icon, poster } = route.params;
  const [currentLocation, setCurrentLocation] = React.useState(null);

  console.log(loc, icon, poster)
  const destination = {
    latitude:parseFloat(loc.location.lat),
    longitude: parseFloat(loc.location.lng),
  };
  console.log(destination, 'destination', poster)
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    const getLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Location permission denied');
            return;
          }
        }

        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            if (typeof latitude === 'number' && typeof longitude === 'number') {
              setCurrentLocation({ latitude, longitude });
              console.log('Current location:', latitude, longitude);
            } else {
              console.warn('Invalid coordinates:', latitude, longitude);
            }
            // Move map to current location
            mapRef.current?.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
          },
          (error) => console.warn(error.message),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, forceRequestLocation: true,
        showLocationDialog: true,distanceFilter: 0 }
        );
      } catch (err) {
        console.warn(err);
      }
    };

    getLocation();
  }, []);

  // const carCoordinate = {
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  // };

  // const routeCoordinates = [
  //   { latitude: 37.78825, longitude: -122.4324 },
  //   { latitude: 37.78925, longitude: -122.4334 },
  //   { latitude: 37.79025, longitude: -122.4344 },
  // ];
  // React.useEffect(() => {
  //   if (mapRef.current) {
  //     mapRef.current.animateToRegion({
  //       ...carCoordinate,
  //       latitudeDelta: 0.01,
  //       longitudeDelta: 0.01,
  //     }, 1000);
  //   }
  // }, []);
  

// 6.442878887271286, 7.486880434521127
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {currentLocation && (
          <>
            <Marker coordinate={currentLocation} title="Current Position">
              <Image
                source={{ uri: 'https://img.icons8.com/ios-filled/50/car.png' }}
                style={{ width: 20, height: 20 }}
              />
            </Marker>
             {destination && (
              <>
              <Marker coordinate={destination} pinColor="purple" title="Destination" />
              </>
            )}
            <Polyline
              coordinates={[currentLocation, destination]}
              strokeColor="#6A0DAD"
              strokeWidth={3}
            />
          </>
        )}
      </MapView>
      <View style={styles.statusTag}>
        <View style={styles.movingDot} />
        <Text style={styles.statusText}>Moving</Text>
      </View>

      <View style={styles.infoCard}>
      <View style={{paddingHorizontal: 10}}>
        <View style={styles.carInfoHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginLeft: 10 }}>
              <View style={styles.iconName}>
            
           <Image
                source={{ uri: icon }}
                style={{ width: 20, height: 20 }}
                
              />
          {/* <Icon name="move" size={20} color="black" /> */}
           <Text style={styles.carName}>{title}</Text></View>
              <Text style={styles.plateNumber}>
              {description.length > 30 ? `${description.slice(0, 30)}...` : description}
            </Text>

              <View style={styles.statusBar}>
                <View style={styles.batteryFill} />
              </View>
            </View>
          </View>
          <Image
            source={poster} 
            style={{  width: '100%',
							height: 120,
							marginLeft:-70,
							resizeMode: 'contain'}}
          />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>10.8 km</Text>
            <Text style={styles.metricLabel}>Distance with you</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>100 km/h</Text>
            <Text style={styles.metricLabel}>Avrage Speed</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>20°C</Text>
            <Text style={styles.metricLabel}>Temperature</Text>
          </View>
        </View>

        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.ringButton}>
            <Icon name="notifications" size={16} color="white" />
            <Text style={styles.buttonText}>Ring On</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopButton}>
          <Icon name="notifications" size={16} color="white" />
            <Text style={styles.buttonText}>Stop Ring</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
    ...StyleSheet.absoluteFillObject,
  },
  statusTag: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  movingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 8,
  },
  statusText: {
    fontWeight: '600',
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    // padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  carInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconName: {
    flexDirection: 'row',
    gap:5,
    alignItems:'center'
  },
  carName: {
    display:'flex',
    fontWeight: 'bold',
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  plateNumber: {
    fontSize: 13,
    color: '#888',
    paddingVertical:2,
  },
  statusBar: {
    backgroundColor: '#eee',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
    width:102,
  },
  batteryFill: {
    width: '70%',
    height: '100%',
    backgroundColor: '#66bb6a',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 2,
  },
  metricBox: {
    alignItems: 'center',
		borderWidth:0.5,
		borderColor:'gray',
    padding:11,
    // paddingHorizontal:25,
    borderRadius: 10,
  },
  metricValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor:'#252d3a',
    width:'100%',
    paddingTop:'5%',
    borderTopLeftRadius:13,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopRightRadius:13,
  },
  ringButton: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 50,
  },
  stopButton: {
    backgroundColor: '#5f3ac4',
    flexDirection: 'row',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: 'bold',
  },
});
