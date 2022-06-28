import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
  Linking,
  Pressable,
  RefreshControl,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import ShowOfflineMessage from '../components/connectionChecker';
var SocialScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [socialData, setSocialData] = useState([]);
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  function displaySocialData() {
    return socialData.map((item, i) => {
      return (
        <View style={[styles.card, styles.shadow]} key={i}>
          <View style={styles.header}>
          <Text style={styles.headerText}>
            {ParseAuthorSource(item.author, item.source)}
          </Text>
          </View>
          <Text style={styles.text}>"{item.excerpt}"</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? colors.card : colors.border,
                },
                styles.customButton,
              ]}
              onPress={() => Linking.openURL(item.url)}>
              <Text accessibilityLabel={'See more of item: ' + i+1} style={styles.buttonText}> See More </Text>
            </Pressable>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {ParseDateTime(item.datePublished)}
            </Text>
          </View>
        </View>
      );
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getSocialEndpoints();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  /**
   * Fetches the data from weirdgloop API providing the client has internet
   */
  const getSocialEndpoints = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        try {
          const response = await fetch(
            'https://api.weirdgloop.org/runescape/social?page=1',
          );
          const json = await response.json();
          setSocialData(json.data);
        } catch (e) {
          SendMessage(e)
        }
      }
    });
  };

  function SendMessage(msg){
    if (Platform.OS == 'android'){
      ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }
    else if (Platform.OS == 'ios'){
      Alert.alert(msg)
    }
  }
  /**
   * Parses the time from the Weirdgloop API into human readable
   * yyyy-mm-dd hh-mm-ss
   * @param {date} date
   * @returns Published: Unknown or Published: {date}
   */
  function ParseDateTime(date) {
    if (date != null) {
      var splitString = String(date).split('T');
      var _date = splitString[0];
      splitString = String(splitString[1]).split('.');
      var _time = splitString[0];
      return 'Published: ' + _date + ' ' + _time;
    } else {
      return 'Published: Unknown';
    }
  }

  /**
   * Parses and formats the author for the card title - If source is unknown, appends unknown
   * If author is unknown, shows only source
   * @param {author} author
   * @param {source} source
   */
  function ParseAuthorSource(author, source) {
    if (author != null && source != null) {
      return author + ' on ' + source;
    } else if (author != null) {
      return 'Source: ' + author;
    } else if (source != null) {
      return 'Unknown on ' + source;
    }
  }
  useEffect(() => {
    getSocialEndpoints();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <ShowOfflineMessage />
      <View>{displaySocialData()}</View>
    </ScrollView>
  );
};

export default SocialScreen;

export const makeStyles = colors =>
  StyleSheet.create({
    buttonText: {
      color: colors.text,
    },
    buttonContainer: {
      width: '100%',
      padding: 10,
      alignItems: 'flex-end',
    },
    customButton: {
      padding: 15,
      height: 50,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: colors.border,
    },
    footer: {
      backgroundColor: colors.card,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      color: colors.text,
    },

    footerText: {
      textAlign: 'right',
      paddingRight: 10,
      fontStyle: 'italic',
      color: colors.text,
    },
    header: {
      position: 'relative',
      top: 0,
      width: '100%',
      backgroundColor: colors.card,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    headerText: {
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    scrollView: {
      marginHorizontal: 5,
    },
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexGrow: 1,
      flexDirection: 'column',
    },
    card: {
      margin: 10,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: colors.border,
      justifyContent: 'space-between',
      flexGrow: 1,
      flexDirection: 'column',
      shadowColor: 'black',
      zIndex: 99,
    },

    text: {
      margin: 10,
      textAlign: 'left',
      color: colors.text,
      
    },
    hyperlink: {
      color: '#0000EE',
    },
    shadow: {
      elevation: 10,
      shadowColor: 'black'
    },
  });
