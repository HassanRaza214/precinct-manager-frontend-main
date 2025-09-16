import React, { useState, useContext, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Switch,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions, 
  Platform
} from 'react-native';
import appicon from '../assets/appicon.png';
import HomeScreenButton from "../components/HomeScreenButton";
import { getReconciliation, insertReconciliationStatus } from '../../CRUD';
import UserContext from '../../UserContext';
import readyfortransport from '../assets/readyfortransport.png';
import Header from '../components/Header';
import SubmitButton from '../components/SubmitButton';
import ReadyForTransportButton from '../components/ReadyForTransportButton';

const renderItem = ({
  item,
  index,
  setTasks,
  insertReconciliationStatus,
  pollingStation,
  taskCheck,
}) => {
  const toggleTaskStatus = async (taskId) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map((t) => {
        if (t.ID === taskId) {
          return {
            ...t,
            checkin: !t.checkin,
          };
        }
        return t;
      });

      const updatedTask = updatedTasks.find((t) => t.ID === taskId);
      const checkinStatus = updatedTask.checkin ? 1 : 0;

      insertReconciliationStatus(pollingStation, taskId, checkinStatus);

      return updatedTasks;
    });
  };
  
  return (
    <View style={[styles.row, {backgroundColor: index % 2 === 0 ? '#E6E6EA' : '#BEBEC2'}]}>
      <View style={styles.rowText}>
        <Text style={styles.stepText}>Step {index + 1}:</Text>
        <Text style={styles.cell}>{item.CheckListItem}</Text> 
      </View>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: "white", true: "#22355f" }}
          value={item.checkin}
          onValueChange={() => toggleTaskStatus(item.ID)}
        />
      </View>
    </View>
  );
};

const ReconciliationScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [markedReadyAt, setMarkedReadyAt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { pollingStation, precinctName } = useContext(UserContext);

  const taskCheck = (tasks) => {
    if (tasks.every(task => task.checkin)) {
      Alert.alert('Success', 'Ready for Transport!');
    }
  };

  const buttonTaskCheck = (tasks) => {
    if (tasks.every(task => task.checkin)) {
      Alert.alert('Success', 'Ready for Transport!');
    } else {
      Alert.alert('Alert!', 'Please complete all steps.');
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const tasksData = await getReconciliation(pollingStation);
        console.log(tasksData);
        const tasksDataWithCheckin = tasksData.map((task) => ({ ...task, checkin: task.checkin }));
  
        if (tasksData.length === 0) {
          Alert.alert('No tasks', 'There are no tasks available for this checklist.');
        } else {
          setTasks(tasksDataWithCheckin);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header />
        {markedReadyAt && (
          <View style={styles.markedReadyTextContainer}>
            <Text style={styles.markedReadyText}>
              Marked Ready for Voters at {markedReadyAt.toLocaleString()}
            </Text>
          </View>
        )}
        <Text style={styles.title}>Report Results</Text>
      </View>
  
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <FlatList
            data={tasks}
            renderItem={({ item, index }) =>
              renderItem({ item, index, setTasks, insertReconciliationStatus, pollingStation, taskCheck })
            }
            keyExtractor={(task) => task.ID.toString()}
            extraData={updateCounter}
          />
        )}
      </View>
        
      <View style={styles.footer}>
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
          </View>
        </View>
        <ReadyForTransportButton onPress={() => buttonTaskCheck(tasks)}/>
        <HomeScreenButton />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22355f',
    paddingBottom : 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  subtitleContainer: {
    width: '100%',
  },
  listContainer: {
    flex: 1,
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    fontSize: 20,
    flex: 1,
    paddingRight: 125,
  },
  switchContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  stepText: {
    fontWeight: 'bold',
    fontSize: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  markedReadyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color: 'white',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markedReadyTextContainer: {
    backgroundColor: '#22355f',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  readyfortransportbutton: {
    width: 225,  
    height: 70,
    resizeMode: 'contain', 
    marginTop: 25,
  },
});

export default ReconciliationScreen;
