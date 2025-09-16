import axios from 'axios';
import {Alert} from 'react-native';

export const axiosInstance = axios.create({
  timeout: 60000, // 60 seconds timeout
});

//add logic to handle timeout of login attempt
const handleLogin = async (
  pollingStation,
  password,
  setPollingStation,
  setPrecinctName,
) => {
  // const timeoutPromise = new Promise((_, reject) =>
  //   setTimeout(() => reject(new Error('timeout')), 5000),
  // ); // 5000ms or 5 seconds timeout

  try {
    // const response = await Promise.race([
    //   axios.get(
    //     'https://precint-manager-backend.azurewebsites.net/loginAttempt',
    //     {
    //       params: {Polling: pollingStation, Password: password},
    //     },
    //   ),
    //   timeoutPromise,
    // ]);

    const response = await axiosInstance.get(
      'https://precint-manager-backend.azurewebsites.net/loginAttempt',
      {
        params: {Polling: pollingStation, Password: password},
      },
    );

    console.log(response, 'see response');

    if (response.data.success) {
      setPollingStation(pollingStation);
      const precinctName = response.data.precinctName;
      console.log('PRECINCT NAME: ', precinctName, 'tt');
      setPrecinctName(precinctName);

      const token = response.data.token;

      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      // here is the problem this needs to be globally handled

      // Set precinct address from the same API response
      // const precinctAddress = response.data.precinctAddress;
      // setPrecinctAddress(precinctAddress);

      return 'success'; // Return 'success' when the login is successful
    } else {
      return 'incorrect'; // Return 'incorrect' for incorrect username or password
    }
  } catch (error) {
    console.log(error, ' see this error');
    if (error.message === 'timeout') {
      return 'timeout';
    } else {
      return 'incorrect';
    }
  }
};

const precintEmployeesAssignment = async (pollingStation, setEmployees) => {
  try {
    console.log(
      'sending request to backend for polling station: ' + pollingStation,
    );
    const response = await axiosInstance.get(
      'https://precint-manager-backend.azurewebsites.net/precinctEmployeeAssignment/?pollingStation=' +
        pollingStation,
    );
    console.log('response from backend:', response.data); // Changed this line
    return setEmployees(response.data);
  } catch (error) {
    console.error(
      `Error fetching attendance data for polling station ${pollingStation}: ${error}`,
    );
    throw error;
  }
};

const handleSliderChange = async (
  employee,
  pollingStation,
  employees,
  setEmployees,
) => {
  console.log(employee.EmployeeID, !employee.checkin, pollingStation);
  try {
    const response = await axiosInstance.put(
      'https://precint-manager-backend.azurewebsites.net/handleSliderChange?pollingStation=' +
        pollingStation,
      {
        EmployeeID: employee.EmployeeID,
        checkin: !employee.checkin,
        Polling: pollingStation,
      },
    );

    if (response.data.success) {
      const updatedEmployees = employees.map(emp => {
        if (emp.EmployeeID === employee.EmployeeID) {
          return {...emp, checkin: !emp.checkin};
        }
        return emp;
      });

      setEmployees(updatedEmployees);
    } else {
      console.error('Failed to update attendance.');
    }
  } catch (error) {
    console.error('Error during updating attendance:', error);
  }
};

const getEquipment = async pollingStation => {
  console.log(pollingStation);
  try {
    const response = await axiosInstance.get(
      'https://precint-manager-backend.azurewebsites.net/equipment?pollingStation=' +
        pollingStation,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting equipment data: ${error}`);
    throw error;
  }
};

const insertHelpRequest = async (
  pollingStation,
  voterIssue,
  equipment,
  description,
  precinctName,
  precinctAddress,
  selectedEquipment,
  reason,
  itemName,
) => {
  try {
    const response = await axiosInstance.post(
      'https://precint-manager-backend.azurewebsites.net/help?pollingStation=' +
        pollingStation,
      {
        PollingStation: pollingStation,
        VoterIssue: voterIssue,
        EquipmentID: equipment,
        Description: description,
        precinctName,
        precinctAddress,
        selectedEquipment,
        itemName,
      },
    );
    // const testoBJ = {
    //   PollingStation: pollingStation,
    //   VoterIssue: voterIssue,
    //   EquipmentID: equipment,
    //   Description: description,
    //   precinctName,
    //   precinctAddress,
    //   selectedEquipment,
    //   itemName,
    // };
    // console.log(testoBJ, 'testobj');
    if (response.data.success) {
      console.log('Help request inserted successfully');
    } else {
      console.error('Failed to insert help request.');
    }
  } catch (error) {
    console.error('Error during inserting help request:', error);
  }
};

const getProvisionalBallotReasons = async pollingStation => {
  try {
    const response = await axiosInstance.get(
      'https://precint-manager-backend.azurewebsites.net/getProvisionalBallotReasons?pollingStation=' +
        pollingStation,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting provisional ballot reasons: ${error}`);
    throw error;
  }
};

const insertProvisionalBallot = async (
  pollingStation,
  date,
  provisionalBallotNumber,
  voterName,
  voterDOB,
  reasonID,
  comments,
  precinctName,
  precinctAddress,
) => {
  console.log('reasonID = ', reasonID);
  try {
    const response = await axiosInstance.post(
      'https://precint-manager-backend.azurewebsites.net/insertProvisionalBallot?pollingStation=' +
        pollingStation,
      {
        pollingStation,
        date,
        provisionalBallotNumber,
        voterName,
        voterDOB,
        reasonID,
        comments,
        precinctName,
        precinctAddress,
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error inserting provisional ballot: ${error}`);
    throw error;
  }
};

//ChecklistScreen
const getCheckinStatus = async (pollingStation, date) => {
  try {
    const response = await axiosInstance.get(
      `https://precint-manager-backend.azurewebsites.net/getCheckinStatus`,
      {
        params: {
          pollingStation: pollingStation,
          date: date,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting check-in status: ${error}`);
    throw error;
  }
};

//ChecklistScreen
const insertCheckinStatus = async (
  pollingStation,
  CheckListID,
  date,
  checkinStatus,
) => {
  try {
    const response = await axiosInstance.post(
      'https://precint-manager-backend.azurewebsites.net/insertCheckinStatus?pollingStation=' +
        pollingStation,
      {
        pollingStation,
        CheckListID,
        date,
        checkinStatus,
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error inserting check-in status: ${error}`);
    throw error;
  }
};

const getInventory = async pollingStation => {
  try {
    const response = await axiosInstance.get(
      'https://precint-manager-backend.azurewebsites.net/getInventory?pollingStation=' +
        pollingStation,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting equipment data: ${error}`);
    throw error;
  }
};

const insertInventory = async (
  pollingStation,
  selectedInventoryID,
  selectedInventoryDescription,
  otherSupplies,
  currentInventory,
  precinctName,
  precinctAddress,
  itemName,
) => {
  try {
    const response = await axiosInstance.post(
      'https://precint-manager-backend.azurewebsites.net/insertInventory?pollingStation=' +
        pollingStation,
      {
        // const response = await axiosInstance.post('http://192.168.18.211/insertInventory?pollingStation=' + pollingStation, {
        pollingStation,
        selectedInventoryID,
        selectedInventoryDescription,
        otherSupplies,
        currentInventory,
        precinctName,
        precinctAddress,
        itemName,
      },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error(`Error status: ${error.response.status}`);
      console.error(`Error data: ${error.response.data}`);
      console.error(`Error headers: ${error.response.headers}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`Error request: ${error.request}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error message: ${error.message}`);
    }

    console.error(`Error config: ${error.config}`);
    throw error;
  }
};

const insertDebug = async (Step, pollingStation) => {
  try {
    const response = await axiosInstance.post(
      'https://precint-manager-backend.azurewebsites.net/insertDebug?pollingStation=' +
        pollingStation,
      {
        Step,
      },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error(`Error status: ${error.response.status}`);
      console.error(`Error data: ${error.response.data}`);
      console.error(`Error headers: ${error.response.headers}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`Error request: ${error.request}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error message: ${error.message}`);
    }

    console.error(`Error config: ${error.config}`);
    throw error;
  }
};

const getReconciliation = async pollingStation => {
  try {
    const response = await axiosInstance.get(
      'https://precint-manager-backend.azurewebsites.net/getReconciliation',
      {
        params: {
          pollingStation: pollingStation,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting equipment data: ${error}`);
    throw error;
  }
};

const insertReconciliationStatus = async (
  pollingStation,
  reconciliationID,
  checkinStatus,
) => {
  try {
    const response = await axiosInstance.post(
      'https://precint-manager-backend.azurewebsites.net/insertReconciliationStatus?pollingStation=' +
        pollingStation,
      {
        pollingStation: pollingStation,
        reconciliationID: reconciliationID,
        checkIn: checkinStatus,
      },
    );

    if (response.data.success) {
      console.log(
        'Inserted: ' +
          pollingStation +
          ' ' +
          reconciliationID +
          ' ' +
          checkinStatus +
          '',
      );
    } else {
      console.error('Failed to insert reconciliation status.');
    }
  } catch (error) {
    console.error('Error during inserting reconciliation status:', error);
  }
};

const getHelpRequests = async (pollingStation, openOnly) => {
  console.log('entered crud function');
  try {
    console.log('Sending request to backend API...');
    const response = await axiosInstance.get(
      'https://precint-manager-backend.azurewebsites.net/helpRequests',
      {
        params: {
          pollingStation: pollingStation,
          openOnly: openOnly || 1,
        },
      },
    );
    console.log('Received response from backend API:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching help requests for polling station ${pollingStation}: ${error}`,
    );
    throw error;
  }
};

const getNotifications = async pollingStation => {
  console.log('entered crud function');
  console.log(pollingStation, 'wsww');
  try {
    console.log('Sending request to backend API...');
    const response = await axiosInstance.get(
      `https://precint-manager-backend.azurewebsites.net/getNotifications?pollingStation=${pollingStation}`,
    );
    console.log('Received response from backend API:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching help requests for polling station ${pollingStation}: ${error}`,
    );
    throw error;
  }
};

const closeHelpRequest = async (helpRequestId, pollingStation) => {
  console.log(helpRequestId, 'help request Id');
  try {
    console.log(`Closing help request with ID ${helpRequestId}...`);
    const response = await axiosInstance.put(
      'https://precint-manager-backend.azurewebsites.net/closeHelpRequest?pollingStation=' +
        pollingStation,
      {
        helpRequestID: helpRequestId,
      },
    );

    console.log('Close help request response:', response);

    if (response.data && response.data.success) {
      console.log(`Help request with ID ${helpRequestId} closed successfully.`);
      return true;
    } else {
      console.error(`Failed to close help request with ID ${helpRequestId}.`);
      return false;
    }
  } catch (error) {
    console.error(
      `Error closing help request with ID ${helpRequestId}: ${error}`,
    );
    throw error;
  }
};

const getPrecinctAddress = async (
  pollingStation,
  setPrecinctAddress,
  setPrecinctName,
) => {
  try {
    console.log(
      'sending request to backend for polling station: ' + pollingStation,
    );
    const response = await axiosInstance.get(
      'https://precint-manager-backend.azurewebsites.net/pollingStationAddress?pollingStation=' +
        pollingStation,
    );
    console.log('response from backend address:', response.data);
    setPrecinctAddress(response.data.address);
    setPrecinctName(response.data.precinctName);
  } catch (error) {
    console.error(
      `Error fetching attendance data for polling station ${pollingStation}: ${error}`,
    );
    throw error;
  }
};

const sendTokenToServer = async token => {
  try {
    console.log('Sending token to server...');
    await axiosInstance.post(
      'https://precint-manager-backend.azurewebsites.net/tokens',
      {token: token},
    );
  } catch (error) {
    console.error(`Error sending token to server: ${error}`);
    throw error;
  }
};

export {
  handleLogin,
  precintEmployeesAssignment,
  handleSliderChange,
  getEquipment,
  insertHelpRequest,
  getProvisionalBallotReasons,
  insertProvisionalBallot,
  getCheckinStatus,
  insertCheckinStatus,
  getInventory,
  insertInventory,
  insertDebug,
  getReconciliation,
  insertReconciliationStatus,
  getHelpRequests,
  closeHelpRequest,
  getPrecinctAddress,
  sendTokenToServer,
  getNotifications,
};
