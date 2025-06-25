import React, { useState,useEffect,  useLayoutEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GetNotificationAPI, GetFreands } from '../Utilities/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAILS = [
  {
    id: '1',
    sender: 'Profitspark',
    title: 'NEW: You just made a sale! Mubarak Mus...',
    body: 'NEW SALE! Dear Mubarak Mustopha A new order has just been placed.',
    time: '10:56 pm',
    icon: 'account-circle',
    color: '#ccc',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    id: '2',
    sender: 'OPay',
    title: 'Transfer Successful',
    body: 'Dear MUSTOPHA HAMZAH MUBARAK, Your transfer to UBA was successful.',
    time: '10:55 pm',
    icon: 'account-balance-wallet',
    color: '#FBC02D',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: '3',
    sender: 'Ohaneze',
    title: 'Starts Today 7:00pm Mubarak',
    body: 'Hey there, Mubarak. There is something important happening today.',
    time: '9:18 pm',
    icon: 'notifications',
    color: '#FF7043',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: '4',
    sender: 'LinkedIn',
    title: 'Morris Akpebe recently posted ...',
    body: 'I accept Congratulations 😍 To think that people are seeing my work...',
    time: '9:06 pm',
    icon: 'linkedin',
    color: '#0077B5',
    avatar: 'https://randomuser.me/api/portraits/women/14.jpg',
  },
  {
    id: '5',
    sender: 'Lovette Via Profitspark',
    title: 'Congratulations on Being Our ProfitSpark Owner...',
    body: 'Hello Mustopha, Congratulations 🎉 on your outstanding performance!',
    time: '11:20 am',
    icon: 'star',
    color: '#4DB6AC',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    id: '6',
    sender: 'Google',
    title: 'Your security alert',
    body: 'We noticed a login from a new device...',
    time: '7:40 am',
    icon: 'security',
    color: '#757575',
    avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
  },
  {
    id: '7',
    sender: 'GitHub',
    title: 'You have a new PR review request',
    body: 'Please review PR #224 on the frontend repository.',
    time: '6:15 am',
    icon: 'code',
    color: '#333',
    avatar: 'https://randomuser.me/api/portraits/men/87.jpg',
  },
];

const ICONS = [
  'notifications', 'email', 'chat', 'account-circle', 'alarm',
  'star', 'security', 'code', 'work', 'info', 'group', 'explore'
];

const COLORS = [
  // '#FF7043', 
  '#42A5F5', 
  // '#66BB6A', '#FFA726',
  // '#AB47BC', '#29B6F6', '#EC407A', '#26C6DA',
  // '#8D6E63', '#78909C', '#7E57C2', '#4DB6AC'
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}


export default function Notification({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const filteredEmails = data.filter(email =>
    email.from.username.toLowerCase().includes(search.toLowerCase()) ||
    email.details.address.addressLine.toLowerCase().includes(search.toLowerCase()) ||
    email.message.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = email => {
    setSelected(email);
    setModalVisible(true);
  };
const GetNotification = async () => {
  const userToken = await AsyncStorage.getItem('accessToken');
  try {
    let result = await GetNotificationAPI(userToken);

    if (result.status === 200) {
      const updatedData = result.data.map((item, index) => ({
        ...item,
        icon: item.icon || getRandomItem(ICONS),
        color: item.color || getRandomItem(COLORS),
      }));
      setData(updatedData);
    }
  } catch (e) {
    console.log("error", e.message);
  }
};

  useEffect(() => {
    GetNotification();
  }, [data]);

  const renderItem = ({ item }) => (
    <Pressable style={styles.item}  onPress={() => navigation.navigate('Directions', {
    lat: item.details.address.coordinates.lat,
    lng: item.details.address.coordinates.long,
  })}>
     {/* onPress={() => openModal(item)} */}
      <View style={[styles.avatar, { backgroundColor: item.color }]}>
        {/* <Icon name={item.icon} size={24} color="#fff" /> */}
         <Text style={styles.avatarLetter}>
        {item.from?.username?.charAt(0)?.toUpperCase() || '?'}
      </Text>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.sender}>{item.from.username}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.title}>{`${item.details.address.addressLine}`}</Text>
        <Text style={styles.body}>{item.message}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={24} color="#000" style={{ marginHorizontal: 10 }} />
        <TextInput
          placeholder="Search for notification"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.profile}
        />
      </View>

      <FlatList
        data={filteredEmails}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Modal for selected email */}
      {selected && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Image source={{ uri: selected.from.picture }} style={styles.modalAvatar} />
              <Text style={styles.modalTitle}>{selected.title}</Text>
              <Text style={styles.modalSender}>From: {selected.from.username}</Text>
              <Text style={styles.modalBody}>{selected.message}</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  avatarLetter: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},
  profile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 13,
    color: '#666',
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 2,
  },
  body: {
    color: '#666',
    fontSize: 13,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSender: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 15,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  modalClose: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
