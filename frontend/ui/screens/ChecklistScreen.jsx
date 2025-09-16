import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, View, FlatList, Switch, SafeAreaView, Image, TouchableOpacity, Alert, ActivityIndicator, Platform, Dimensions } from 'react-native';
import appicon from '../assets/appicon.png';
import HomeScreenButton from "../components/HomeScreenButton";
import { insertCheckinStatus, getCheckinStatus, insertDebug } from '../../CRUD';
import UserContext from '../../UserContext';
import handleError from '../functions/errorHandler';
import readyforvoters from '../assets/readyforvoters.png';
import Header from '../components/Header';

const renderItem = ({
  item,
  index,
  setTasks,
  tasks,
  setUpdateCounter,
  pollingStation,
  hardcodedDate,
}) => {
  const toggleTaskStatus = async (CheckListItem) => {
    const updatedTasks = tasks.map(t =>
      t.CheckListItem === CheckListItem ? { ...t, checkin: !t.checkin } : t
    );
    setTasks(updatedTasks);
  
    const selectedTask = updatedTasks.find(
      (task) => task.CheckListItem === CheckListItem
    );
    const CheckListID = parseInt(selectedTask.ID, 10);
  
    try {
      await insertCheckinStatus(
        pollingStation,
        CheckListID,
        hardcodedDate,
        selectedTask.checkin  // pass boolean directly
      );
      setUpdateCounter((prevCounter) => prevCounter + 1);
    } catch (error) {
      console.error("Error updating task status:", error);
      // Revert the task status if there's an error
      setTasks(tasks);
    }
  };  

  return (
    <View style={[styles.row, {backgroundColor: index % 2 === 0 ? '#E6E6EA' : '#BEBEC2'}]}>
      
      <View style={styles.rowText}>
        <Text style={styles.step}>Step {index + 1}:</Text>
        <Text style={styles.cell}>{item.CheckListItem}</Text>
      </View>

      <Switch
          trackColor={{ false: "white", true: "#22355f" }}
        
        value={item.checkin}
        onValueChange={() => toggleTaskStatus(item.CheckListItem)}
      />
    </View>
  );
};

const ChecklistScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [markedReadyAt, setMarkedReadyAt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { pollingStation, precinctName } = useContext(UserContext);

  const hardcodedDate = '2023-03-22';

  const fetchTasks = async (pollingStation, date) => {
    console.log('fetchTasks fired')
    try {
      const fetchedTasks = await getCheckinStatus(pollingStation, date);
      setTasks(fetchedTasks);
    } catch (error) {
      throw error;
    }
  };  
  

  useEffect(() => {
    const fetchTasksWithRetries = async (pollingStation, date, retries = 5) => {
      for (let i = 0; i <= retries; i++) {
        try {
          setIsLoading(true);
          await fetchTasks(pollingStation, date);
          setIsLoading(false);
          break;
        } catch (error) {
          if (i === retries) {
            console.error('Error fetching tasks after all retries:', error);
            handleError(`Error fetching information. USERNAME: ${pollingStation}. ERROR: ${error}`);
            setIsLoading(false);
          } else {
            console.warn('Error fetching tasks. Retrying...', error);
          }
        }
      }
    };
    fetchTasksWithRetries(pollingStation, hardcodedDate);
  }, [pollingStation, hardcodedDate]);

  const handleSubmit = () => {
    if (tasks.every(task => task.checkin)) {
      setMarkedReadyAt(new Date());
      Alert.alert('Success', 'Ready for voters!');
    } else {
      Alert.alert('Incomplete Tasks', 'Please complete all tasks before proceeding.');
    }
  };  

  insertDebug('Test 6: before return', pollingStation)

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.headerContainer}>
        <Header />
        <Text style={styles.title}>Opening Checklist</Text>
      </View>
  
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={tasks}
            renderItem={({ item, index }) =>
              renderItem({
                item,
                index,
                setTasks,
                tasks,
                setUpdateCounter,
                pollingStation,
                hardcodedDate,
              })
            }
            keyExtractor={(task) => task.ID.toString()} // Use ID property as the key
            extraData={updateCounter}
          />
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubmit}>
            <Image source={readyforvoters} style={styles.readyforvotersbutton}/>
          </TouchableOpacity>
        </View>
        <View style={styles.backButtonWrapper}>
          <HomeScreenButton />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButtonWrapper: {
    alignSelf: 'stretch',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    alignItems: 'center',
    paddingBottom: 20,
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  },
  precinctInfo: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
  },
  listContainer: {
    flex: 1,
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  step: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5, // add space between step and the rest of the text
  },
  cell: {
    fontSize: 20,
  },
  rowText: {
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    flex: 1, 
    marginLeft: 5,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    borderTopColor: 'black',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  readyButton: {
    backgroundColor: '#22355f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
  },
  readyButtonText: {
    color: 'white',
    fontSize: 18,
  },
  markedReadyTextContainer: {
    backgroundColor: '#5eba7d',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  markedReadyText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 50, // Or whatever height you want the button to be
    marginBottom: 40,
    marginTop: 20, 
  },
  readyforvotersbutton: {
    width: 200,  
    height: 100,
    resizeMode: 'contain', 
    marginTop: 20,
  }, 
});


export default ChecklistScreen;
