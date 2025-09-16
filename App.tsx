import React from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AppFrontend from './frontend/App';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <AppFrontend />
    </SafeAreaView>
  );
}

export default App;
