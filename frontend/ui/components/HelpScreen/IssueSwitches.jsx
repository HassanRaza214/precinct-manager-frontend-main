import React, { useState } from 'react';
import { View, Switch, Text } from 'react-native';

const IssueSwitches = ({ setEquipmentIssue, setVoterIssue, voterIssue, equipmentIssue }) => {

  return (
    <View>
      <View>
        <Text style={{fontSize: 24}}>Voter Issue</Text>
        <Switch
          value={voterIssue}
          trackColor={{ false: 'white', true: '#22355f' }}
          onValueChange={(value) => {
            setVoterIssue(value);
            setEquipmentIssue(!value);
            //change color of switch
            
          }}
        />
      </View>
      <View>
        <Text style={{fontSize: 24}}>Equipment Issue</Text>
        <Switch
          value={equipmentIssue}
          trackColor={{ false: 'white', true: '#22355f' }}
          onValueChange={(value) => {
            setEquipmentIssue(value);
            setVoterIssue(!value);
          }}
        />
      </View>
    </View>
  );
};

export default IssueSwitches;
