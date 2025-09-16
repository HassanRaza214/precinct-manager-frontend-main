import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import appicon from '../assets/appicon.png';
import attendance from '../assets/attendance.png';
import help from '../assets/help.png';
import inventory from '../assets/inventory.png';
import openingchecklist from '../assets/openingchecklist.png';
import provisionalballot from '../assets/provisionalballot.png';
import reportresults from '../assets/reportresults.png';
import returntologin from '../assets/returntologin.png';
import notification from '../assets/notifications.png';

const HomeScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={appicon} style={styles.appicon} />
        <Text
          numberOfLines={1}
          style={[styles.title, {fontSize: screenWidth * 0.04}]}>
          Precinct Management
        </Text>
      </View>
      <Text style={styles.footer}>PHONE BANK 904-432-1418</Text>

      <ScrollView
        contentContainerStyle={{justifyContent: 'center'}}
        style={{width: '100%'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EmployeeScreen')}>
          <Image source={attendance} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HelpScreen')}>
          <Image source={help} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('InventoryScreen')}>
          <Image source={inventory} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NotificationsScreen')}>
          <Image source={notification} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChecklistScreen')}>
          <Image source={openingchecklist} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProvisionalBallotsScreen')}>
          <Image source={provisionalballot} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ReconciliationScreen')}>
          <Image source={reportresults} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Image source={returntologin} style={styles.icon} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 5,
    paddingBottom: 10,
  },
  title: {
    color: '#2D4984',
    fontWeight: 'bold',
    maxWidth: '100%',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    // backgroundColor: 'blue'
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000080',
    alignSelf: 'center',
  },
  icon: {
    width: 360, // 20% increase
    height: 90, // 20% increase
    resizeMode: 'contain',
  },
  appicon: {
    width: 192, // 20% increase
    height: 192, // 20% increase
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
});

export default HomeScreen;
