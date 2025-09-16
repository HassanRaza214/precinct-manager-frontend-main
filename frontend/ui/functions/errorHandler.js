// errorHandler.js
import { Alert } from 'react-native';

const handleError = (errorCode) => {
  switch (errorCode) {
    case 'timeout':
      return Alert.alert('Error', 'The request timed out. Please try again.');
    case 'incorrect':
      return Alert.alert('Error', 'Incorrect username or password.');
    case 'network_error':
      return Alert.alert('Error', 'A network error occurred. Please check your internet connection and try again.');
    case 'blank_fields':
      return Alert.alert('Error', 'Username and password fields cannot be blank.');
    case 'required_fields':
      return Alert.alert('Polling station and password are required fields.');
    default:
      return Alert.alert('Error', `${errorCode}`);
  }
};

export default handleError;
