import React from 'react';
import {useTheme} from '@react-navigation/native';
import {Text, Pressable, StyleSheet} from 'react-native';


export const FloatingButton = props => {
    const {colors} = useTheme();
    const styles = makeStyles(colors);
    return (
        <Pressable style={({ pressed}) => [{ backgroundColor: pressed ? props.pressedColour : props.primaryColour}, styles.floatingButton]} onPress={props.onPress} hitSlop={10}>
        <Text style={styles.floatingButtonText}>{props.title}</Text>
       </Pressable>)
}


 const makeStyles = colors =>
  StyleSheet.create({
floatingButton: {
    width: 48,
    height: 48,
    bottom: 10,
    right: 10,
    flex: 1,
    borderRadius: 25,
    position: 'absolute',
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
  },
  floatingButtonText: {
    fontSize: 30,
    color: 'white',
  }
});