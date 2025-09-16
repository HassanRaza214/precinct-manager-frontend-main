import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import submit from '../assets/submit.png';

const SubmitButton = ({ onPress, loading = false }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      {loading && (
        <ActivityIndicator size={20} color={'blue'} />
      )}
      {!loading && (
        <Image source={submit} style={styles.button} />

      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 190, // Adjust as needed
    height: 100, // Adjust as needed
    resizeMode: 'contain', // Ensures the entire image is visible
  },
});


export default SubmitButton;
