// CustomLoading.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomLoading = ({ loading, counter }) => {
  return loading ? (
    <View style={{ marginTop: 20 }}>
      <View style={styles.loadingTextContainer}>
        <Text style={[styles.loadingText]}>Loading</Text>
      </View>
      <View style={styles.loadingDotsContainer}>
        {Array.from({ length: counter }, (_, i) => (
          <Text key={i} style={styles.loadingDots}> . </Text>
        ))}
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  loadingTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontStyle: 'italic',
    fontSize: 18,
  },

  loadingDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingDots: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#3498db',
  },
});

export default CustomLoading;
