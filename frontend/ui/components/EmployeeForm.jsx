import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, Switch, ActivityIndicator } from 'react-native';
import { handleSliderChange, precintEmployeesAssignment } from '../../CRUD';
import handleError from '../functions/errorHandler';

const renderItem = ({ item: employee, index }, handleSliderChange, pollingStation, employees, setEmployees) => {
  const isEvenRow = index % 2 === 0;

  return (
    <View style={[styles.row, {backgroundColor: isEvenRow ? '#E6E6EA' : '#BEBEC2'}]}>
      <View style={styles.leftColumn}>
        <Text style={styles.cell}>{employee.PosnDescription}</Text>
      </View>
      <View style={styles.middleColumn}>
        <Text style={styles.cell}>{employee.EmployeeName}</Text>
      </View>
      <View style={styles.rightColumn}>
        <Switch
          trackColor={{ false: 'white', true: '#22355f' }}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#white"
          value={employee.checkin}
          onValueChange={() => handleSliderChange(employee, pollingStation, employees, setEmployees)}
        />
      </View>
    </View>
  );
};





const EmployeeForm = ({ pollingStation }) => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployeesWithRetries = async (pollingStation, retries = 5) => {
    for (let i = 0; i <= retries; i++) {
      try {
        setIsLoading(true);
        await precintEmployeesAssignment(pollingStation, setEmployees);
        setIsLoading(false);
        break;
      } catch (error) {
        if (i === retries) {
          console.error('Error fetching employees after all retries:', error);
          handleError(`Error fetching employees. Polling Station: ${pollingStation}. ERROR: ${error}`);
          setIsLoading(false);
        } else {
          console.warn('Error fetching employees. Retrying...', error);
        }
      }
    }
  };

  useEffect(() => {
    fetchEmployeesWithRetries(pollingStation);
  }, [pollingStation]);

  return (
    <View style={[styles.employeeForm, { width: '100%' }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : employees.length > 0 ? (
        <FlatList
          data={employees}
          renderItem={(props) => renderItem(props, handleSliderChange, pollingStation, employees, setEmployees)}
          keyExtractor={(employee) => (employee.EmployeeID ? employee.EmployeeID.toString() : 'fallback-value')}
          extraData={employees}
        />
      ) : (
        <Text>No employees found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  employeeForm: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cell: {
    fontSize: 18,
    paddingLeft: 10,
    color: '#333',
  },
  name: {
    paddingLeft: 10,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  slider: {
    width: '25%',
  },
  cell: {
    fontSize: 18,
    color: 'black',
  },
  leftColumn: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-start',
  },
  middleColumn: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-end',
  },
});

export default EmployeeForm;
