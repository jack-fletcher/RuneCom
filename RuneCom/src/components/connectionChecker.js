import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Button, ImageBackground} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useTheme, useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';

///
/// Derived from: https://techblog.geekyants.com/a-guide-to-react-native-offline-support
///
const ShowOfflineMessage = () => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const netInfo = useNetInfo();
  if (netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
          <Image
          style={{width: 100, height: 100, alignItems: 'center'}}
          resizeMode="center"
          source={require('../res/offline.webp')}></Image>
                  <Text style={styles.warningTitleText}>No Internet Connection</Text>
        <Text style={styles.warningText}>
          Check your connection and swipe down to try again.
        </Text>
      </View>
    );

  return null;
};

export const makeStyles = colors =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    warningText: {
      width: '100%',
      color: colors.text,
      textAlign: 'center',
      padding: 10,
    },

    warningTitleText: {
      padding: 10,
      width: '100%',
      textAlign: 'center',
      fontWeight: 'bold',
      color: colors.text,
    },
  });

export default ShowOfflineMessage;
