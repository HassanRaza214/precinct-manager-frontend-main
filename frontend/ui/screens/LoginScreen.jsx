// LoginScreen.jsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import LoginForm from '../components/LoginForm';
import { handleLogin, getPrecinctAddress } from '../../CRUD';
import RNExitApp from 'react-native-exit-app';

const { width, height } = Dimensions.get('window');

const minWidth = Math.min(width, height);
const minHeight = Math.max(width, height);
const isIPad = Platform.OS === 'ios' && minWidth >= 1488 / 326 && minHeight >= 2266 / 326;

const LoginScreen = ({ navigation }) => {

  //this is the close app button
  const handleExitApp = () => {
    RNExitApp.exitApp();
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/janetAdkinsBanner.png')} style={[styles.banner, isIPad && styles.bannerIPad]} />
      <View style={[styles.loginFormContainer, isIPad && styles.loginFormContainerIPad]}>
        <View style={styles.container}>
        <LoginForm handleLogin={handleLogin} getPrecinctAddress={getPrecinctAddress} navigation={navigation} />
        </View>
      </View>

      <View style={styles.closeAppButtonContainer}>
        <TouchableOpacity
          style={styles.closeAppButton}
          onPress={handleExitApp}
        >
          <Text style={styles.buttonText}>Close App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  banner: {
    width: width,
    resizeMode: 'contain',
  },

  bannerIPad: {
    width: width * 0.8,
    alignSelf: 'center',
  },

  loginFormContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  loginFormContainerIPad: {
    paddingHorizontal: 40,
  },

  closeAppButtonContainer: {
    paddingBottom: 10,
    alignItems: 'center',
  },

  closeAppButton: {
    backgroundColor: '#be132d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
