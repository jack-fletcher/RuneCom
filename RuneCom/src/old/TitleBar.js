import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  Image,
  Appearance,
  useColorScheme,
} from 'react-native';
import chosenColour from './ColourScheme';

const TitleBar = () => {
  return (
    <Text
      style={{
        height: 40,
        borderColor: chosenColour.background,
        borderWidth: 1,
        backgroundColor: chosenColour.background,
        color: chosenColour.primary,
        textAlign: 'center',
      }}>
      <Image
        source={{uri: 'https://reactnative.dev/docs/assets/p_cat1.png'}}
        style={{width: 25, height: 25, position: 'absolute', padding: 50}}
      />
      RuneCom
    </Text>
  );
};

export default TitleBar;
