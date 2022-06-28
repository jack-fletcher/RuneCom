import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TextInput,
  ToastAndroid,
  Pressable,
  Platform,
  Alert
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FloatingButton} from '../components/floatingButton';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

const CreateNoteScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  var [title, setTitle] = useState();
  var [note, setNote] = useState();
  const inputTitle = useRef();
  const inputText = useRef();
  function handleSaveOnPress() {
    SaveNote();
    GoBack();
  }

  useEffect(() => {
    ClearInputs();
  }, []);
  const SaveNote = async () => {
    if (note === '' && title === '') {
      GoBack();
    } else {
      try {
        ///Hash title, note and current time in ms for uniqueness
        //Could be problematic for big notes
        var data = '' + title + note + Date.now();
        //var key = HashContents(data);

        let obj = {
          noteTitle: title,
          noteText: note,
        };
        var key = HashContents(data);
        AsyncStorage.setItem(key, JSON.stringify(obj));
        SendMessage(
          'Your note has been saved.',
        );
      } catch (e) {
        SendMessage(e)
      }
    }
  };

  function SendMessage(msg){
    if (Platform.OS == 'android'){
      ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }
    else if (Platform.OS == 'ios'){
      Alert.alert(msg)
    }
  }
  function ClearInputs() {
    inputTitle.current.clear();
    inputText.current.clear();
    setTitle();
    setNote();
  }

  function GoBack() {
    ClearInputs();
    navigation.navigate('Notes');
  }
  ///
  /// Derived from this: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  ///
  function HashContents(data) {
    return data;
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Pressable
            accessibilityLabel="Go Back"
            onPress={() => GoBack()}
            hitSlop={10}
            style={({pressed}) => [
              {backgroundColor: pressed ? colors.border : colors.background},
              styles.titleButton,
            ]}>
            <Image
              style={styles.titleImage}
              source={require('../res/chevron.webp')}></Image>
          </Pressable>
          <TextInput
            ref={inputTitle}
            style={styles.titleInput}
            placeholderTextColor={colors.text}
            placeholder="Title"
            onChangeText={newText => setTitle(newText)}>
          </TextInput>
        </View>
        <TextInput
          ref={inputText}
          placeholderTextColor={colors.text}
          multiline
          placeholder="Text"
          style={styles.textInput}
          onChangeText={newText => setNote(newText)}>
        </TextInput>
      </ScrollView>

      <FloatingButton
        primaryColour={colors.primary}
        pressedColour="rgb(0,87,183)"
        onPress={handleSaveOnPress}
        title="✓"
      />
    </View>
  );
};

export default CreateNoteScreen;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      padding: 10,
      width: '100%',
      height: '100%',
      borderColor: colors.border,
    },
    titleImage: {
      width: 30,
      height: 30,
    },
    titleButton: {
      width: 50,
      borderWidth: 1,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      width: '100%',
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    titleInput: {
      flex: 2,
      color: colors.text,
      fontWeight: 'bold',
    },
    titleText: {
      alignSelf: 'center',
      flex: 1,
    },
    textInput: {
      width: '100%',
      color: colors.text,
    },
  });
