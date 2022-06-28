import React, {useState, useRef} from 'react';
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
import {useTheme, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FloatingButton} from '../components/floatingButton';
import ContextMenu from 'react-native-context-menu-view';

const EditNoteScreen = ({route, navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  var [title, setTitle] = useState(route.params.params._title);
  var [note, setNote] = useState(route.params.params._note);
  var id = route.params.params._ID;
  const inputTitle = useRef();
  const inputText = useRef();
  function handleSaveOnPress() {
    SaveNote();
    GoBack();
  }

  useFocusEffect(
    React.useCallback(() => {
      SetInputs();
    }, [id]),
  );

  const SaveNote = async () => {
    if (note === '' && title === '') {
      GoBack();
    } else {
      try {
        ///Hash title, note and current time in ms for uniqueness
        //Could be problematic for big notes
        var data = '' + title + note + Date.now();

        let obj = {
          noteTitle: title,
          noteText: note,
        };
        //delete the original
        DeleteNote();
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

  function SetInputs() {
    setTitle(route.params.params._title);
    setNote(route.params.params._note);
    id = route.params.params._ID;
    inputTitle.current.value = title;
    inputText.current.value = note;
  }
  function ClearInputs() {
    inputTitle.current.clear();
    inputText.current.clear();
    setTitle('');
    setNote('');
  }

  function DeleteNote() {
    AsyncStorage.removeItem(route.params.params._ID);
  }

  function GoBack() {
    ClearInputs();
    navigation.navigate('Notes');
  }

  function ImportNote() {}
  function ExportNote() {}
  ///
  /// TODO: Hashing data for unique ID
  ///
  function HashContents(data) {
    return data;
  }

  function displayTitleBar() {
    return (
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
          onChangeText={newText => setTitle(newText)}
          value={title}></TextInput>
        {displayContextMenu()}
      </View>
    );
  }

  function displayNoteBox() {
    return (
      <TextInput
        ref={inputText}
        placeholderTextColor={colors.text}
        multiline
        placeholder="Text"
        style={styles.textInput}
        onChangeText={newText => setNote(newText)}
        value={note}></TextInput>
    );
  }

  function displayContextMenu() {
    return (
      <View>
        <ContextMenu
          style={styles.contextMenu}
          title={'Menu'}
          actions={[
            {
              title: 'Delete',
            },
          ]}
          onPress={event => {
            const {index, name} = event.nativeEvent;

            if (index == 0) {
              DeleteNote();
              GoBack();
            }
          }}
          dropdownMenuMode={true}>
          <Pressable
            accessibilityLabel="Show Options"
            accessibilityHint="Deletes note"
            hitSlop={10}
            style={({pressed}) => [
              {backgroundColor: pressed ? colors.border : colors.background},
              styles.titleButton,
            ]}>
            <Image
              style={styles.titleImage}
              source={require('../res/dots.webp')}></Image>
          </Pressable>
        </ContextMenu>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {displayTitleBar()}
        {displayNoteBox()}
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

export default EditNoteScreen;

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
      fontSize: 18,
    },
    titleText: {
      alignSelf: 'center',
      flex: 1,
    },
    textInput: {
      width: '100%',
      color: colors.text,
      fontSize: 16,
    },
    contextMenu: {
      flex: 1,
      justifyContent: 'center',
    },
  });
