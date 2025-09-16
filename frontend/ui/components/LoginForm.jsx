// LoginForm.jsx
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import UserContext from '../../UserContext';
import handleError from '../functions/errorHandler';
import CustomLoading from './CustomLoading';
import messaging from '@react-native-firebase/messaging';

const LoginForm = ({ handleLogin, getPrecinctAddress, navigation }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeoutCounter, setTimeoutCounter] = useState(0);
  const { pollingStation, setPollingStation, setPrecinctName, setPrecinctAddress } = useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      // reset the polling station and password when this screen comes into focus
      setPollingStation('');
      setPassword('');
    }, [])
  );

  const login = async () => {
    Keyboard.dismiss();
    setLoading(true);
    if (!pollingStation || !password) {
      handleError('required_fields');
      setLoading(false);
      return;
    } else if (pollingStation === '' || password === '') {
      handleError('blank_fields');
      setLoading(false);
      return;
    }
  
    console.log(`Polling Station: ${pollingStation}, Password: ${password}`);
  
    let result = '';
    do {
      result = await handleLogin(pollingStation, password, setPollingStation, setPrecinctName);
  
      if (result === 'timeout') {
        setTimeoutCounter((prevCounter) => prevCounter + 1);
      } else if (result === 'incorrect' || result === 'network_error') {
        setLoading(false);
        handleError(result);
        break;
      } else if (result === 'success') {
        try {
          await getPrecinctAddress(pollingStation, setPrecinctAddress, setPrecinctName);
        } catch (error) {
          console.error("Failed to fetch precinct address:", error);
        }
        setLoading(false);
        navigation.navigate('HomeScreen');  // navigation code...
        messaging().subscribeToTopic(pollingStation);
        break;
      } else {
        setLoading(false);
        handleError(result);
        setTimeoutCounter((prevCounter) => prevCounter + 1);
        break;
      }
      if (timeoutCounter >= 15) {
        setLoading(false);
        setTimeoutCounter(0);
        handleError('Please Try Again', `${result}`);
        break;
      }
    } while (result !== 'success');
  };

  return (
    <View style={styles.View}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Polling Station"
        onChangeText={text => setPollingStation(text)}
        value={pollingStation}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!showPassword}
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <CheckBox
          value={showPassword}
          onValueChange={newValue => setShowPassword(newValue)}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold'}}>    Show Password</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <CustomLoading loading={loading} counter={timeoutCounter} />
    </View>
  );
};

const styles = StyleSheet.create({
  View: {
    maxHeight: '100%',
    maxWidth: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#22355f',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 21,
    fontWeight: '400',
    fontFamily: 'NirmalaUI',
  },
  loadingTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontStyle: 'italic',
    fontSize: 18,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDots: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#3498db',
  },
});

export default LoginForm;
