import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import backhome from '../assets/backhome.png';

const HomeScreenButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.backButton}
      >
        <View style={styles.innerTouchableArea}>
          <Image source={backhome} style={styles.backButtonImage} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    pointerEvents: 'box-none', // This line restricts touch events to the child components only
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerTouchableArea: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonImage: {
    width: 195, // Adjust as needed
    height: 100, // Adjust as needed
    resizeMode: 'contain', // Ensures the entire image is visible
  },
});

export default HomeScreenButton;
