import React from 'react';
import {useTheme, useNavigation} from '@react-navigation/native';
import {Text, Pressable, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {scaleFont} from '../components/FontScaling';

export const NotePreview = props => {
  const nav = useNavigation();
  const {colors} = useTheme();
  const styles = makeStyles(colors, fontScale);
  const fontScale = scaleFont();

  const handleOnPress = () => {
    nav.navigate('Edit Note', {
      params: {_title: props.title, _note: props.text, _ID: props.id},
    });
  };

  const DeleteNote = async id => {
    AsyncStorage.removeItem(id);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({pressed}) => [
          {backgroundColor: pressed ? colors.border : colors.card},
          styles.pressableArea,
        ]}
        onPress={() => handleOnPress(props.id)}>
        <View style={styles.noteTitlePreviewContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.noteTitlePreviewText}>
            {' '}
            {props.title}{' '}
          </Text>
        </View>
        <View style={styles.noteTextPreviewContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.noteTextPreviewText}>
            {' '}
            {props.text}{' '}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const makeStyles = (colors, fontScale) =>
  StyleSheet.create({
    container: {
      width: '100%',
      borderColor: colors.border,
      borderWidth: 1,
      marginBottom: 5,
      backgroundColor: colors.card,
      flex: 1,
    },
    pressableArea: {
      width: '100%',
      
    },
    noteTitlePreviewContainer: {
      flex: 1,
      backgroundColor: colors.card,
      height: 30,
    },
    noteTitlePreviewText: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 18,

    },
    noteTextPreviewContainer: {
      height: 30,
      backgroundColor: colors.card,
      flex: 1,
      justifyContent: 'center'
    },
    noteTextPreviewText: {
      color: colors.text,
      fontSize: 14,
    },
  });
