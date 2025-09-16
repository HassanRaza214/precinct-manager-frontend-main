import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import appicon from '../assets/appicon.png';
import HomeScreenButton from '../components/HomeScreenButton';
import { getProvisionalBallotReasons, insertProvisionalBallot } from '../../CRUD';
import UserContext from '../../UserContext';
import SubmitButton from '../components/SubmitButton';
import Header from '../components/Header';

const ViewHelpRequestsScreen = ({ navigation }) => {
    const { pollingStation, precinctName } = useContext(UserContext);
    
  return (
    <>
      <Header />
      <View style={styles.container}>
        {/* Your content goes here */}
        <View style={styles.footer}>
          <HomeScreenButton
            title="Back to Home Screen"
            onPress={() => navigation.goBack()}
            style={styles.backToHomeButton}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  backToHomeButton: {
    alignSelf: 'center',
  },
});

export default ViewHelpRequestsScreen;
