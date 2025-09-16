import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import HomeScreenButton from '../components/HomeScreenButton';
import {
  getHelpRequests,
  closeHelpRequest,
  openHelpRequest,
} from '../../CRUD';
import UserContext from '../../UserContext';
import Header from '../components/Header';
import { Button } from 'react-native-paper';
import SubmitButton from '../components/SubmitButton';
import { white } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';

const ViewHelpRequestsScreen = ({ navigation }) => {
  const { pollingStation, precinctName } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [helpRequests, setHelpRequests] = useState([]);
  const [voterIssues, setVoterIssues] = useState([]);
  const [equipmentIssues, setEquipmentIssues] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState({});
  const [updatedRequests, setUpdatedRequests] = useState({});

  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        setLoading(true);
        console.log('Fetching help requests...');
        const data = await getHelpRequests(pollingStation, 1);
        console.log('Got help requests:', data);
        if (data) {
          setHelpRequests(data);
          console.log('Set help requests');
          setLoading(false);

          const tempVoterIssues = [];
          const tempEquipmentIssues = [];

          for (let i = 0; i < data.length; i++) {
            const request = data[i];

            if (request.VoterIssue === true) {
              tempVoterIssues.push(request);
            } else if (request.VoterIssue === false) {
              tempEquipmentIssues.push(request);
            }
          }

          setVoterIssues(tempVoterIssues);
          setEquipmentIssues(tempEquipmentIssues);

          console.log('tempVoterIssues:', tempVoterIssues);
          console.log('tempEquipmentIssues:', tempEquipmentIssues);
        }
      } catch (error) {
        console.error('Error fetching help requests:', error);
        setLoading(false);
      }
    };

    fetchHelpRequests();
    console.log('Called fetchHelpRequests');
  }, [pollingStation]);

  const handleSwitchChange = (request, value) => {
    const newStatus = value ? 'closed' : 'open';
    if (newStatus !== request.status) {
      setUpdatedRequests((prevState) => ({
        ...prevState,
        [request.ID]: newStatus,
      }));
    } else {
      setUpdatedRequests((prevState) => {
        const updatedState = { ...prevState };
        delete updatedState[request.ID];
        return updatedState;
      });
    }
  };

  const handleSubmit = async () => {
    const requestIDs = Object.keys(updatedRequests);
    console.log(updatedRequests, 'request ids see statuses')
    for (const requestID of requestIDs) {
      console.log(updatedRequests[requestID], 'see status')
      const newStatus = updatedRequests[requestID];
      if (newStatus === "closed") {
        await closeHelpRequest(requestID, pollingStation);
      } 
      // else {
      //   await openHelpRequest(requestID);
      // }
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView>
        <View style={styles.container}>

          <View style={styles.grid}>
            <Text style={styles.gridTitle}>Voter Help Requests</Text>
            <View style={styles.row}>
              <Text style={styles.header}>ID</Text>
              <Text style={styles.header}>Date Created</Text>
              <Text style={styles.header}>Description</Text>
              <Text style={styles.header}>Done</Text>
            </View>
            <ScrollView >
              {voterIssues.map((request) => (
                <View style={styles.row} key={request.ID}>
                  <Text style={styles.cell}>{request.ID}</Text>
                  <Text style={styles.cell}>{new Date(request.dt).toLocaleString()}</Text>
                  <Text style={styles.cell}>{request.Description}</Text>
                  <View style={styles.switchCell}>
                    <Switch
                      trackColor={{ false: "white", true: "#22355f" }}
                      value={updatedRequests[request.ID] ? updatedRequests[request.ID] === "closed" : request.status === "closed"}
                      onValueChange={(value) => handleSwitchChange(request, value)}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.grid}>
            <Text style={styles.gridTitle}>Equipment Help Requests</Text>
            <View style={styles.row}>
              <Text style={styles.header}>ID</Text>
              <Text style={styles.header}>Date Created</Text>
              <Text style={styles.header}>Equipment</Text>
              <Text style={styles.header}> Description</Text>
              <Text style={styles.header}>Done</Text>
            </View>
            <ScrollView >
              {equipmentIssues.map((request) => (
                <View style={styles.row} key={request.ID}>
                  <Text style={styles.cell}>{request.ID}</Text>
                  <Text style={styles.cell}>{new Date(request.dt).toLocaleString()}</Text>
                  <Text style={styles.cell}>{request.EquipmentDescription}</Text>
                  <Text style={[styles.cell, { flexWrap: 'wrap' }]}>{request.Description}</Text>
                  <View style={styles.switchCell}>
                    <Switch
                      trackColor={{ false: "white", true: "#22355f" }}
                      value={updatedRequests[request.ID] ? updatedRequests[request.ID] === "closed" : request.status === "closed"}
                      onValueChange={(value) => handleSwitchChange(request, value)}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

          </View>




          <View style={styles.buttonContainer}>
            <SubmitButton onPress={handleSubmit} />
            <HomeScreenButton
              title="Back to Home Screen"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Platform.OS === 'ios' && Platform.isPad ? 48 : 24,  // Scaled by 20%
    backgroundColor: 'white',
    maxHeight: '65%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  grid: {
    marginBottom: 10,
    maxHeight: '50%',
  },
  gridTitle: {
    fontSize: 28.8,  // Scaled by 20%
    fontWeight: 'bold',
    marginBottom: 12,  // Scaled by 20%
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,  // Scaled by 20%
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
  },
  header: {
    fontSize: Platform.OS === 'ios' && Platform.isPad ? 24 : 19.2,  // Scaled by 20%
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    fontSize: Platform.OS === 'ios' && Platform.isPad ? 21.6 : 16.8,  // Scaled by 20%
    flex: 1,
    textAlign: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 6,  // Scaled by 20%
  },
  switchCell: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 6,  // Scaled by 20%
  },
  buttonContainer: {
    flexDirection: 'column',
  },
});

export default ViewHelpRequestsScreen;