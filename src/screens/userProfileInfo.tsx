import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { UpdateProfileAPI } from '../Utilities/ApiCalls';
import axios from 'axios';
import { GOOGLE_PLACES_API_KEY } from '../Utilities/Config';

export default function UpdateProfileInfo() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [search, setSearch] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [address, setAddress] = useState('');
  const [arduinoLat, setArduinoLat] = useState('');
  const [arduinoLong, setArduinoLong] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleUpdate = async () => {
    if (!username || !firstName || !lastName || !arduinoLat || !arduinoLong) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    const payload = {
      username,
      firstName,
      lastName,
      arduinoAddress: {
        lat: parseFloat(arduinoLat),
        long: parseFloat(arduinoLong)
      }
    };

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await UpdateProfileAPI(token, payload);
      if (res.status === 200 || res.status === 201) {
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" >
      
        <View style={styles.containeheader}>
          <View>
            <Text style={styles.header}>Update Profile Info</Text>
            <Text style={styles.subHeader}>
              Your health privacy matters. Control and own your disclosures.
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      <View style={styles.card}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />

        <TextInput
          value={search}
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
          placeholder="Arduino address"
          style={styles.input}
        />

        {predictions.length > 0 && (
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.predictionItem}
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

                    setAddress(details.formatted_address);
                    setArduinoLat(lat.toString());
                    setArduinoLong(lng.toString());
                    setPredictions([]);
                    setSearch(details.formatted_address); // Better UX

                  } catch (err) {
                    console.error("Details fetch error", err);
                  }
                }}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
            style={styles.predictionsList}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleUpdate}
          disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Please wait...' : 'Update Profile'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#F3F4F6'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  backBtn: {
    marginHorizontal: -10,
  },
  containeheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  },
  subHeader: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1
  },
  predictionsList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    marginBottom: 15
  },
  predictionItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  }
});
