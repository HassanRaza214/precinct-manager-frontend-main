import React, {useContext, useEffect, useState} from 'react';
import Dialog from 'react-native-dialog';
import {
  View,
  Text,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';
import IssueSwitches from '../components/HelpScreen/IssueSwitches';
import IssueForm from '../components/HelpScreen/IssueForm';
import {StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import appicon from '../assets/appicon.png';
import HomeScreenButton from '../components/HomeScreenButton';
import {getEquipment, insertHelpRequest} from '../../CRUD';
import UserContext from '../../UserContext';
import SubmitButton from '../components/SubmitButton';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';

const {height, width} = Dimensions.get('window');

const isIpad = height >= 1488 && width >= 2266;

const HelpScreen = ({navigation}) => {
  const {pollingStation, precinctName, precinctAddress} =
    useContext(UserContext);
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [description, setDescription] = useState('');
  const [equipmentIssue, setEquipmentIssue] = useState(false);
  const [voterIssue, setVoterIssue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoading(true);
      try {
        const equipmentData = await getEquipment(pollingStation);
        console.log(equipmentData, 'equipment data');
        setEquipment(equipmentData);
      } catch (error) {
        console.error(error);
        alert(
          'An error occurred while fetching the equipment data. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handlePress = async (
    pollingStation,
    voterIssue,
    equipment,
    description,
  ) => {
    // Check if neither issue type is selected
    setSubmitLoading(true);
    if (!equipmentIssue && !voterIssue) {
      alert('Please select an issue type.');
      setSubmitLoading(false);
      return;
    }

    // Check if Equipment Issue is toggled on and no equipment is selected
    if (equipmentIssue && !selectedEquipment) {
      alert('Please select an equipment from the dropdown menu.');
      setSubmitLoading(false);
      return;
    }

    if (voterIssue && description.length == 0) {
      alert('Please state the description.');
      setSubmitLoading(false);
      return;
    }

    // If the description is empty, replace it with "(left blank)"
    const finalDescription =
      description.trim() === '' ? '(left blank)' : description;

    console.log(itemName, 'seet he selected eqiupemnt ');

    try {
      await insertHelpRequest(
        pollingStation,
        voterIssue,
        equipment,
        finalDescription,
        precinctName,
        precinctAddress,
        selectedEquipment,
        description,
        itemName,
      );
      setDialogVisible(true); // Show the success dialog
      setSubmitLoading(false);
    } catch (error) {
      console.error(error);
      setSubmitLoading(false);

      alert(
        'An error occurred while submitting the help request. Please try again.',
      );
    }
  };

  const handleDialoguePush = () => {
    setDialogVisible(false);
    navigation.navigate('HomeScreen');
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView>
              <Text style={styles.title}>Help </Text>
              <View style={styles.switchContainer}>
                <IssueSwitches
                  setEquipmentIssue={setEquipmentIssue}
                  setVoterIssue={setVoterIssue}
                  voterIssue={voterIssue}
                  equipmentIssue={equipmentIssue}
                />
              </View>
              <View style={styles.formContainer}>
                <IssueForm
                  equipment={equipment}
                  onEquipmentSelect={setSelectedEquipment}
                  onItemNameChange={name => setItemName(name)} // Set the item name when it changes
                  onDescriptionChange={setDescription}
                  showEquipmentDropdown={equipmentIssue}
                  isLoading={isLoading}
                  isIpad={isIpad}
                  itemName={itemName}
                />
              </View>

              <View style={styles.submitButtonContainer}>
                <SubmitButton
                  onPress={() =>
                    handlePress(
                      pollingStation,
                      voterIssue,
                      selectedEquipment,
                      description,
                    )
                  }
                  title="Submit"
                  loading={submitLoading}
                />

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#22355f',
                      marginTop: 25,
                      marginBottom: 20,
                      borderRadius: 20,
                      width: 260,
                    },
                  ]}
                  onPress={() => navigation.navigate('ViewHelpRequestsScreen')}>
                  <Text style={styles.buttonText}>View Voter and</Text>
                  <Text style={styles.buttonText}>Equipment Requests</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.backButtonContainer}>
                <HomeScreenButton />
              </View>
            </ScrollView>

            <Dialog.Container visible={dialogVisible}>
              <Dialog.Title>Success</Dialog.Title>
              <Dialog.Description>Help Request Submitted.</Dialog.Description>
              <Dialog.Button label="OK" onPress={handleDialoguePush} />
            </Dialog.Container>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  backButtonContainer: {
    // position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: isIpad ? 50 : 24,
    fontWeight: 'bold',
    color: '#22355f',
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  switchContainer: {
    marginBottom: 20,
    paddingLeft: 9.5,
  },
  formContainer: {
    marginTop: 20,
  },
  image: {
    width: isIpad ? 150 : 100,
    height: isIpad ? 150 : 100,
    marginRight: 2,
  },
  precinctInfo: {
    fontSize: isIpad ? 22 : 15,
    color: 'black',
    paddingVertical: 5,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  submitButtonContainer: {
    alignItems: 'center',
  },
  button: {
    width: '50%',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#22355f',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22355f',
    textAlign: 'center',
  },
});

export default HelpScreen;
