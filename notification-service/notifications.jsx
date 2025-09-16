import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

// check for fcm exist on realtime and asynce storage
const getFCMToken = async () => {
  // Get the current FCM token
  const fcmToken = await messaging().getToken();
  console.log(fcmToken, 'fcmtoken');

  // Check if the FCM token already exists in the Realtime Database
  const tokenSnapshot = await database()
    .ref(`/fcm-tokens/${fcmToken}`)
    .once('value');
  if (tokenSnapshot.exists()) {
    console.log(`FCM token ${fcmToken} already exists in the database.`);
    return;
  }

  // Generate a new FCM token
  const newToken = await messaging().getToken();
  console.log(`Generated new FCM token: ${newToken}`);

  // Save the new FCM token to the Realtime Database
  await database().ref(`/fcm-tokens/${newToken}`).set(true);
  console.log(`Saved new FCM token ${newToken} to the database.`);
};

export const notificationListener = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );

    console.log('Background State', remoteMessage);
    console.log('Image Notification here', remoteMessage);
  });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        console.log('Remote Message', remoteMessage);
        console.log('Image Notification here', remoteMessage);
      }
    });
};
