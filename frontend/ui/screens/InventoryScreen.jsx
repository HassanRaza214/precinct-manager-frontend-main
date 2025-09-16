import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import appicon from '../assets/appicon.png';
import HomeScreenButton from '../components/HomeScreenButton';
import {getInventory, insertInventory} from '../../CRUD';
import UserContext from '../../UserContext';
import SubmitButton from '../components/SubmitButton';
import Header from '../components/Header';
//using react native versions
//import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const InventoryScreen = ({navigation}) => {
  const isIpad = Platform.OS === 'ios' && (Platform.isPad || Platform.isTVOS);
  const [inventory, setInventory] = useState([]);
  const [inventoryFields, setInventoryFields] = useState([
    {
      selectedInventoryID: null,
      selectedInventoryDescription: '',
      otherSupplies: '',
      currentInventory: '',
    },
  ]);
  const {pollingStation, precinctName, precinctAddress} =
    useContext(UserContext);
  const [itemName, setItemName] = useState('');
  const [test, setTest] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    async function fetchInventory() {
      const inventoryData = await getInventory(pollingStation);
      const transformedData = inventoryData.map(item => ({
        label: item.Description,
        value: item.ID,
      }));
      setInventory(transformedData);
    }
    fetchInventory();
  }, []);

  const handleSubmit = async () => {
    // setSubmitLoading(true)
    for (let i = 0; i < inventoryFields.length; i++) {
      const {
        selectedInventoryID,
        selectedInventoryDescription,
        otherSupplies,
        currentInventory,
      } = inventoryFields[i];

      // Check if currentInventory is empty and replace with "(left blank)"
      const finalCurrentInventory =
        currentInventory === '' ? '(left blank)' : currentInventory;

      if (
        !pollingStation ||
        !selectedInventoryID ||
        !selectedInventoryDescription
      ) {
        // Show an alert with the error messages
        Alert.alert('Validation Error', 'Please select the inventory.');
        setSubmitLoading(false);
        return;
      }
      console.log(
        selectedInventoryDescription,
        selectedInventoryID,
        otherSupplies,
        currentInventory,
        'see this',
        i,
      );

      // const testObj = {
      //   pollingStation,
      //   selectedInventoryID,
      //   selectedInventoryDescription,
      //   otherSupplies,
      //   finalCurrentInventory,
      //   precinctName,
      //   precinctAddress,
      //   itemName,
      // };

      // console.log(testObj, i);
      try {
        const response = await insertInventory(
          pollingStation,
          selectedInventoryID,
          selectedInventoryDescription,
          otherSupplies,
          finalCurrentInventory,
          precinctName,
          precinctAddress,
          itemName,
        );
        console.log('Server response:', response);
        setSubmitLoading(false);

        Alert.alert(
          'Success',
          'Inventory data has been successfully submitted.',
        );
        navigation.navigate('HomeScreen');
      } catch (error) {
        console.error(`Error submitting inventory: ${error.message}`);
        setSubmitLoading(false);

        Alert.alert(
          'Error',
          `An error occurred while submitting the inventory data: ${error.message}`,
        );
      }
    }
  };

  const handleAddField = () => {
    setInventoryFields([
      ...inventoryFields,
      {selectedInventoryID: null, otherSupplies: '', currentInventory: ''},
    ]);
  };

  const handleDeleteField = index => {
    const newInventoryFields = inventoryFields.filter((_, i) => i !== index);
    setInventoryFields(newInventoryFields);
  };

  const handleInputChange = (text, index, field) => {
    const newInventoryFields = [...inventoryFields];
    newInventoryFields[index][field] = text;
    setInventoryFields(newInventoryFields);
  };

  const handleDropdownChange = (item, index) => {
    const newInventoryFields = [...inventoryFields];
    newInventoryFields[index].selectedInventoryID = item.value;
    newInventoryFields[index].selectedInventoryDescription = item.label;
    setItemName(item.label);
    setInventoryFields(newInventoryFields);
  };

  const styles = createStyles(isIpad);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <SafeAreaView style={styles.container}>
          <Header />
          <Text style={styles.title}>Inventory</Text>

          <ScrollView>
            {Array.from({length: inventoryFields.length}).map((_, i) => (
              <View key={i}>
                <Dropdown
                  style={styles.dropdown}
                  data={inventory}
                  value={inventoryFields[i].selectedInventoryID}
                  placeholder="List of Supplies"
                  labelField="label"
                  valueField="value"
                  onChange={item => handleDropdownChange(item, i)}
                  textStyle={{fontSize: 24}}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={text =>
                    handleInputChange(text, i, 'otherSupplies')
                  }
                  value={inventoryFields[i].otherSupplies}
                  placeholder="Other Supplies Needed"
                  multiline={true}
                />
                <TextInput
                  style={[styles.input, styles.currentInventory]}
                  onChangeText={text =>
                    handleInputChange(text, i, 'currentInventory')
                  }
                  value={inventoryFields[i].currentInventory}
                  placeholder="Current Inventory"
                  multiline={true}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteField(i)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.newRequestButton}
                onPress={handleAddField}>
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.newRequestButtonText}>
                    ADD NEW REQUEST
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.submitButton}>
              <SubmitButton onPress={handleSubmit} loading={submitLoading} />
            </View>

            <View style={styles.backToHomeButton}>
              <HomeScreenButton
                title="Back to Home Screen"
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const createStyles = isIpad =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 20,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    appIcon: {
      width: 100,
      height: 100,
      marginRight: 10,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#22355f',
    },
    precinctInfo: {
      textAlign: 'center',
      fontSize: 18,
      marginBottom: 10,
    },
    headerContainer: {
      alignItems: 'center',
      paddingBottom: 20,
    },
    input: {
      height: isIpad ? 100 : 60,
      width: Dimensions.get('window').width - 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      marginBottom: 20,
      textAlignVertical: 'top',
      borderRadius: 10, // Rounded corners
      fontSize: 28,
    },
    dropdown: {
      width: Dimensions.get('window').width - 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      marginBottom: 20,
      textAlignVertical: 'top',
      borderRadius: 10, // Rounded corners
      fontSize: 28,
    },
    parentContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    buttonContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 15,
      height: 200,
    },
    newRequestButton: {
      backgroundColor: '#22355f',
      borderRadius: 10,
      height: 47,
      width: 190,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
      borderRadius: 15,
    },
    submitButton: {
      alignItems: 'center',
      width: 300,
      height: 3,
      borderRadius: 10,
      justifyContent: 'center',
      //alignSelf: 'flex-end',  // Aligns at the bottom
    },
    backToHomeButton: {
      marginTop: 25,
      alignItems: 'center',
      width: 200,
      height: 35,
      borderRadius: 10,
      justifyContent: 'center',
      //alignSelf: 'flex-end',  // Aligns at the bottom
    },
    buttonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    newRequestButtonText: {
      color: '#fff',
      fontSize: 17,
      fontWeight: 'bold',
    },
    deleteButton: {
      backgroundColor: '#be132d',
      borderRadius: 10,
      height: 35,
      width: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 50,
    },
    deleteButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

export default InventoryScreen;
