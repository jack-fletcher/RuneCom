import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Platform} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {FloatingButton} from '../components/floatingButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NotePreview} from '../components/NotePreview';
import {scaleFont} from '../components/FontScaling';
/**
 * @param  {navigation} {navigation} parent navigation element
 * Returns the entire All note screen
 */
const NoteScreen = ({navigation}) => {
  const fontScale = scaleFont();
  const {colors} = useTheme();
  const styles = makeStyles(colors, Platform);
  const [notes, setNotes] = useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotes();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const clearData = async () => {
    const keys = await AsyncStorage.getAllKeys();
    AsyncStorage.multiRemove(keys);
  };

  
  /**
   * handles button on click
   */
  function handleOnPress() {
    navigation.navigate('Create Note');
  }
  /**
   * Gets all stored notes async
   */
  const getNotes = async () => {
    try {
      var objs = [];
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          //TODO: Change this implementation, it's bad
          if (store[i][0] != 'Username'){
          let key = store[i][0];
          let value = JSON.parse(store[i][1]);
          const obj = new Object();
          obj.id = key;
          obj.noteTitle = value.noteTitle;
          obj.noteText = value.noteText;
          objs.push(obj);
        }});
      });
      setNotes(objs);
    } catch (error) {
      console.log(error);
    }
  };

  
  /**
   * Displays all stored notes
   */
  function displayNotes() {
    return notes.map((item, i) => {
      return (
        <NotePreview
          title={item.noteTitle}
          text={item.noteText}
          id={item.id}
          key={i}
        />
      );
    });
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Notes</Text>
        {displayNotes()}
      </ScrollView>
      <FloatingButton
        primaryColour={colors.primary}
        pressedColour="rgb(0,87,183)"
        onPress={handleOnPress}
        title="+"
      />
    </View>
  );
};

export default NoteScreen;

const makeStyles = (colors, Platform) =>
  StyleSheet.create({
    title: {
      color: colors.text,
      fontWeight: 'bold',
      ...Platform.select({
        ios:{
          textAlign: 'left',
        },  
        android: {
          textAlign: 'center',
        }
      }),
      fontSize: 18,
      paddingTop: 10,
      paddingBottom: 10,
    },

    container: {
      backgroundColor: colors.background,
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      padding: 10,
    },
  });
