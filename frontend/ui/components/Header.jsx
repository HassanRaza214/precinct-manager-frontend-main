import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import UserContext from '../../UserContext';
import appicon from '../assets/appicon.png';

const Header = () => {
  const { pollingStation, precinctName, precinctAddress } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Image source={appicon} style={styles.image} />
      <View style={styles.header}>
      <Text style={styles.title}>PRECINCT MANAGEMENT</Text>
        <Text style={styles.subtitle}>{precinctName}</Text>
        {/* <Text style={styles.subtitle}>sample name</Text> */}
        <Text style={styles.subtitle}>{precinctAddress}</Text>
        {/* <Text style={styles.subtitle}>sampleAddress</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white',
    // backgroundColor: 'red'

  },
  image: {
    width: 140, // Increase the width of the image
    height: 140, // Increase the height of the image
    marginRight: 10,
  },
  header: {
    padding: 10,
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    color: '#22355f',
    textAlign: 'left', // Align the text to the right
  },
  title: { // Add new style for 'PRECINCT MANAGEMENT'
    fontSize: 30,
    marginBottom: 10,
    color: '#22355f',
    textAlign: 'left',
    fontWeight: 'bold', // Make the text bold
  },
});

export default Header;
