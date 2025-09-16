import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const IssueForm = ({ equipment, onEquipmentSelect, onDescriptionChange, showEquipmentDropdown, isLoading, isIpad, itemName, onItemNameChange }) => {

  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [textInputValue, setTextInputValue] = useState('');

  const renderLabel = () => {
    if (isFocus) {
      return (
        <Text style={[styles(isIpad).label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const equipmentOptions = equipment.map((item) => ({
    label: item.EquipmentDescription,
    value: item.EquipmentID.toString(),
  }));

  return (
    <View style={styles(isIpad).container}>
      {isLoading ? (
        <View style={styles(isIpad).loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {showEquipmentDropdown && (
            <>
              {renderLabel()}
              <Dropdown
                style={[styles(isIpad).dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles(isIpad).placeholderStyle}
                selectedTextStyle={styles(isIpad).selectedTextStyle}
                inputSearchStyle={styles(isIpad).inputSearchStyle}
                iconStyle={styles(isIpad).iconStyle}
                data={equipmentOptions}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select item' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setValue(item.value);
                  setIsFocus(false);
                  onEquipmentSelect(item.value);
                  if (onItemNameChange) {
                    onItemNameChange(item.label);  // Notify parent about selected item's name
                }
                }}
              />
            </>
          )}
          <View style={styles(isIpad).textInputContainer}>
            <TextInput
              style={styles(isIpad).textInput}
              placeholder="Description"
              multiline={true}
              value={textInputValue}
              onChangeText={text => {
                setTextInputValue(text);
                onDescriptionChange(text);
              }}
            />
          </View>
          
        </>
      )}
    </View>
  );
};

const styles = (isIpad) => StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textInput: {
    height: isIpad ? 40 : 200, // Set height depending on whether it's an iPad or not
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: isIpad ? 24 : 24, // Set font size depending on whether it's an iPad or not
  },
});
    
    export default IssueForm;