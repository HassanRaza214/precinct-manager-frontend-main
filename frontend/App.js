import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';
import EmployeeScreen from './ui/screens/EmployeeScreen';
import LoginScreen from './ui/screens/LoginScreen';
import UserContext from './UserContext';
import HomeScreen from './ui/screens/HomeScreen';
import HelpScreen from './ui/screens/HelpScreen';
import ChecklistScreen from './ui/screens/ChecklistScreen';
import ProvisionalBallotsScreen from './ui/screens/ProvisionalBallotsScreen';
import ReconciliationScreen from './ui/screens/ReconciliationScreen';
import InventoryScreen from './ui/screens/InventoryScreen';
import ViewHelpRequestsScreen from './ui/screens/ViewHelpRequestsScreen';
import messaging from '@react-native-firebase/messaging';
import sendTokenToServer from './CRUD.js';
import {
  notificationListener,
  requestUserPermission,
} from '../notification-service/notifications';
import {Alert} from 'react-native';
//import PushNotification from 'react-native-push-notification';
import {getFcmToken} from '../notification-service/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationsScreen from './ui/screens/notifications';

const Stack = createNativeStackNavigator();

export default function AppFrontend() {
  const [pollingStation, setPollingStation] = useState(null);
  const [precinctName, setPrecinctName] = useState(null); // <-- Change this line
  const [precinctAddress, setPrecinctAddress] = useState(null); // Add this line

  useEffect(() => {
    requestUserPermission();
    notificationListener();

    //getFcmToken();

    const getBackgroundMessage = async () => {
      const value = await AsyncStorage.getItem('my-message');
      console.log(value, 'see');
    };

    getBackgroundMessage();

    // Subscribe to topic
    messaging()
      .subscribeToTopic('test')
      .then(() => console.log('Subscribed to topic!'));

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {notification} = remoteMessage;
      if (notification) {
        const {title, body} = notification;
        Alert.alert('Notification', `${title}\n ${body}`);
      } else {
      }
      // PushNotification.configure({
      //   onNotification: (notification) => {
      //       if (notification.foreground) {
      //      console.log(notification)
      //   }
      //   }
      // })
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{
        pollingStation,
        setPollingStation,
        precinctName,
        setPrecinctName,
        precinctAddress, // Add this line
        setPrecinctAddress, // Add this line
      }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="NotificationsScreen"
            component={NotificationsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EmployeeScreen"
            component={EmployeeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HelpScreen"
            component={HelpScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ViewHelpRequestsScreen"
            component={ViewHelpRequestsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="InventoryScreen"
            component={InventoryScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChecklistScreen"
            component={ChecklistScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProvisionalBallotsScreen"
            component={ProvisionalBallotsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ReconciliationScreen"
            component={ReconciliationScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
