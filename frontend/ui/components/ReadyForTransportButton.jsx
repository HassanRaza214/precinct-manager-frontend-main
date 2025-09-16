import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import readyfortransport from '../assets/readyfortransport.png';

const ReadyForTransportButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Image source={readyfortransport} style={styles.button} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200, // Adjust as needed
    height: 100, // Adjust as needed
    resizeMode: 'contain', // Ensures the entire image is visible
  },
});


export default ReadyForTransportButton;
