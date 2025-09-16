import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import EmployeeForm from '../components/EmployeeForm';
import UserContext from '../../UserContext';
import HomeScreenButton from '../components/HomeScreenButton';
import Header from '../components/Header';

const EmployeeScreen = () => {
  const { pollingStation, precinctName } = useContext(UserContext);

  return (
    // <View style={styles.container}>
      <SafeAreaView style={styles.container2}>
      <Header />
      <Text style={styles.title}>Attendance</Text>
      <EmployeeForm pollingStation={pollingStation} styles={styles.EmployeeForm} />
      <HomeScreenButton />
      </SafeAreaView>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22355f',
    paddingBottom: 10,
  },

  container2: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
});

export default EmployeeScreen;
