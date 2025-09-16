import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, Alert, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import appicon from '../assets/appicon.png';
import HomeScreenButton from '../components/HomeScreenButton';
import { getProvisionalBallotReasons, insertProvisionalBallot } from '../../CRUD';
import UserContext from '../../UserContext';
import SubmitButton from '../components/SubmitButton';
import Header from '../components/Header';
import DeviceInfo from 'react-native-device-info';

const deviceModel = DeviceInfo.getModel();
const isIpad9 = deviceModel === "iPad (9th generation)";
const isIpad10 = deviceModel === "iPad (10th generation)";
const isIpad = isIpad9 || isIpad10;

const ProvisionalBallotsScreen = ({ navigation }) => {
  const [provisionalBallotNumber, setProvisionalBallotNumber] = useState('');
  const [voterName, setVoterName] = useState('');
  const [voterDOB, setVoterDOB] = useState('');
  const [reason, setReason] = useState(null);
  const [clerkComments, setClerkComments] = useState('');
  const [reasonOptions, setReasonOptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const { pollingStation, precinctName, precinctAddress } = useContext(UserContext);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    async function fetchReasons() {
      const reasons = await getProvisionalBallotReasons(pollingStation);
      const formattedReasons = reasons.map(reason => ({
        label: reason.Description,
        value: reason.ID,
      }));
      setReasonOptions(formattedReasons);
    }
    fetchReasons();
  }, []);

  const handleSubmit = async () => {
    setSubmitLoading(true)
    if (provisionalBallotNumber && voterName && voterDOB && reason) {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
      if (!dateRegex.test(voterDOB)) {
        Alert.alert('Invalid Date Format', 'Please enter the date in the mm/dd/yyyy format.');
        setSubmitLoading(false)
        return;
      }

      const [month, day, year] = voterDOB.split('/');
      const formattedVoterDOB = `${year}-${month}-${day}`;
      setVoterDOB(formattedVoterDOB);

      // Check if clerkComments is empty and set it to 'none' if true
      const finalClerkComments = clerkComments.trim() === '' ? 'none' : clerkComments;

      setLoading(true);
      setError(null);
      try {
        console.log("Reason:", reason);
        const response = await insertProvisionalBallot(pollingStation, null, provisionalBallotNumber, voterName, formattedVoterDOB, reason, finalClerkComments, precinctName, precinctAddress);
        console.log(response);
        setSubmitLoading(false)

        Alert.alert('Success', 'Provisional Ballot data has been successfully submitted.');
        navigation.navigate('HomeScreen');
      } catch (error) {
        console.error(error);
        Alert.alert('Error :', error.message);
      } finally {
        setSubmitLoading(false)
        setLoading(false);
      }
    } else {
    setSubmitLoading(false)

      Alert.alert('Missing Fields', 'Please fill out all required fields.');
    }
  };



  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.container}>
    
            <Header />
            <Text style={styles.title}>Provisional Ballot</Text>
            {loading && <ActivityIndicator size="large" color="blue" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TextInput
              style={styles.input}
              onChangeText={setProvisionalBallotNumber}
              value={provisionalBallotNumber}
              placeholder="Provisional Ballot Number"
            />
            <TextInput
              style={styles.input}
              onChangeText={setVoterName}
              value={voterName}
              placeholder="Voter Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                // Remove all non-numeric characters
                const numericText = text.replace(/[^0-9]/g, '');

                // Split the text into parts (month, day, year)
                let formattedText = numericText;

                // Insert the first slash after the month (if applicable)
                if (numericText.length > 2) {
                  formattedText = `${numericText.slice(0, 2)}/${numericText.slice(2)}`;
                }

                // Insert the second slash after the day (if applicable)
                if (numericText.length > 4) {
                  formattedText = `${numericText.slice(0, 2)}/${numericText.slice(2, 4)}/${numericText.slice(4)}`;
                }

                // Set the value in state
                setVoterDOB(formattedText);
              }}
              value={voterDOB}
              placeholder="Voter D.O.B. (MM/DD/YYYY)"
            />

            <Dropdown
              style={styles.dropdown}
              data={reasonOptions}
              value={reasonOptions[reason]}
              placeholder="Reason for Issuing"
              labelField="label"
              valueField="value"
              onChange={item => setReason(Number(item.value))}
            />
            <TextInput
              style={[styles.input, styles.clerkComments]}
              onChangeText={setClerkComments}
              value={clerkComments}
              placeholder="Clerk Comments"
              multiline={true}
            />
            <View style={styles.submitButtonContainer}>
              <SubmitButton title="Submit" onPress={handleSubmit} loading={submitLoading} />
            </View>
            <View style={styles.HomeScreenButton}><HomeScreenButton title="Back to Home Screen" onPress={() => { }} /></View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22355f',
    paddingBottom: 50,
  },
  precinctText: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    marginBottom: 5,
  },
  input: {
    height: isIpad ? 200 : 60,
    width: Dimensions.get('window').width - 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 24
  },
  dropdown: {
    width: Dimensions.get('window').width - 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    textAlign: 'right',
    fontSize: 28
  },
  clerkComments: {
    height: isIpad ? 200 : 200,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  submitButtonContainer: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginTop: 20,
  },
  HomeScreenButton: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginTop: 20,
  },

  container2: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
});

export default ProvisionalBallotsScreen;
