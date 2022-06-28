import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
  Image,
  TextInput,
  Pressable,
  ImageBackground,
  RefreshControl,
  Platform,
  Alert
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import ShowOfflineMessage from '../components/connectionChecker';
import AsyncStorage from '@react-native-async-storage/async-storage';

///
/// Returns the entire Adventurer log screen
///
var AdventurerLogScreen = ({navigation}) => {
  //Const declaration
  var [logData, setLogData] = useState([]);
  var [username, setUsername] = useState(getStoredUsername());
  var [rank, setRank] = useState('');
  var [combatLevel, setcombatLevel] = useState('');
  var [questsComplete, setQuestsComplete] = useState('');
  var [questsNotStarted, setQuestsNotStarted] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  //Refresh functions
  const onRefresh = React.useCallback(() => {
    getLogEndpoints(username);
    displayLogData();
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  //Display functions

  /**
   * Displays Runescape Adventurer log data
   * Adds commas for millionth/thousanths
   */
  function displayLogData() {
    if (logData != null){
    return logData.map((item, i) => {
      return (
        <View style={styles.card} key={i}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>
              {item.text.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.text}>
              {item.details.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
          </View>
          <View style={styles.footerContainer}>
            <Text style={styles.footer}>{item.date}</Text>
          </View>
        </View>
      );
    });
  }
}

  /**
   * Displays Adventurer Log Search Bar
   */
  function displaySearchBar() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Adventurer's Log..."
          placeholderTextColor={colors.text}
          //onChangeText={newUsername => setUsername(newUsername)}
          onSubmitEditing={newUsername => setUsername(newUsername.nativeEvent.text)}
          defaultValue={username}
          autoCorrect={false}
          multiline={false}
          maxLength={12}
        />
        {/* <Pressable
          hitSlop={10}
          accessibilityLabel="Search Adventurers Log"
          onPress={() => getLogEndpoints(username)}
          style={({pressed}) => [
            {backgroundColor: pressed ? colors.border : colors.empty},
            styles.pressableArea,
          ]}>
          <ImageBackground
            source={require('../res/search.webp')}
            style={{
              width: 25,
              height: 25,
              position: 'absolute',
            }}></ImageBackground>
        </Pressable> */}
      </View>
    );
  }

  /**
   * Displays Runescape Adventurer Log Character Info
   */
  function displayLogTitle() {
    if (username != null){
    return (
      <View style={styles.titleCard}>
        <Image
          style={styles.titleImage}
          source={{
            ///Image component does not follow redirects, but fetch API does
            uri: `https://secure.runescape.com/m=avatar-rs/${ParseUsernameForWeb(
              username,
            )}/chat.png`,
          }}
        />
        <Text style={styles.title}>{username}</Text>
        <Text style={styles.text}>
          {' '}
          Combat Level: {combatLevel} {'\n'} Rank: {rank} {'\n'} Quests
          Complete: {questsComplete} {'\n'} Quests not Started:{' '}
          {questsNotStarted}{' '}
        </Text>
      </View>
    );
  }
}

function getStoredUsername() {
  AsyncStorage.getItem('Username', (error, result) => {
    if(result){
      setUsername(result);
    }
  });
}

function setStoredUsername(input) {
  if (input != null){
  AsyncStorage.setItem('Username', input);
  }
}

  //Format functions
  useEffect(() => {
    //getStoredUsername();
  }, []);

  useEffect(() => {
    console.log("i fire once");
    getLogEndpoints();
  }, [username]);


  //Format functions
  /**
   * Replaces whitespace with underscores for use with Jagex system.
   * @param  {string} _username
   */
  function ParseUsernameForWeb(_username) {
    _username = _username.replace(' ', '_');
    return _username;
  }

  const getLogEndpoints = async => {
    if (username == null){
      //ShowErrorMessage("Please ensure a Runescape 3 username is typed into this box and try again.");
    }
    else { 
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        var _url = `https://apps.runescape.com/runemetrics/profile/profile?user=${username}&activities=20`;
        try {
          const response = await fetch(_url);
          const json = await response.json();
          console.log(username);
            if (json.error == 'PROFILE_PRIVATE') {
              ShowErrorMessage(
                'This Runescape profile is set to private. Please ensure your profile is set to public for this application to work successfully.',
              );
              setRank('');
              setcombatLevel('');
              setQuestsComplete('');
              setQuestsNotStarted('');
            } 
            else if (json.error == 'NO_PROFILE'){
              ShowErrorMessage('This Runescape profile does not exist. Please check your spelling and try again.')
            }
          
            else if (json.error == null) {
              setLogData(json.activities);
              setRank(json.rank);
              setcombatLevel(json.combatlevel);
              setQuestsComplete(json.questscomplete);
              setQuestsNotStarted(json.questsnotstarted);
              setStoredUsername(username);
            }
          
        } catch (e) {
          ShowErrorMessage(e);
        }
      } else {
        ShowErrorMessage(
          'You are not connected to the internet. Please connect to a network and try again, or go to notes.',
        );
      }
    });
  }};

  /**
   * Resets the visible username
   */
   const ResetUsername = () => {
    setUsername('');
  }

  /**
   * Shows a toast error message to the user
   * @param  {string} msg='Something went wrong.Please try again.'
   */
  const ShowErrorMessage = (
    msg = 'Something went wrong. Please try again.',
  ) => {
    if (Platform.OS == 'android'){
    ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }
    else if (Platform.OS == 'ios'){
      Alert.alert(msg)
    }

    //ResetUsername();
  };

  ///Screen return
  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <ShowOfflineMessage />
      <View style={styles.scrollViewPadding}>
        <View>{displaySearchBar()}</View>
        <View>{displayLogTitle()}</View>
        <View>{displayLogData()}</View>
      </View>
    </ScrollView>
  );
};

export default AdventurerLogScreen;

///
/// Attributed to:
/// https://stackoverflow.com/questions/66864061/how-do-i-use-the-usetheme-hook-inside-my-stylesheet-create
///
export const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 15,
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      elevation: 10,
    },
    text: {
      color: colors.text,
    },
    titleImage: {
      margin: 15,
      overflow: 'hidden',
      width: 75,
      height: 75,
      borderRadius: 75 / 2,
      borderWidth: 3,
      borderColor: colors.border,
    },
    titleCard: {
      flex: 1,
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.border,
      marginBottom: 15,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: colors.background,
      elevation: 10,
      zIndex: 99,
    },
    title: {
      color: colors.text,
      fontWeight: 'bold',
      padding: 10,
      textAlign: 'right',
      fontSize: 16,
    },
    header: {
      color: colors.text,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
    headerContainer: {},
    footerContainer: {
      width: '100%',
    },
    footer: {
      color: colors.text,
      textAlign: 'right',
    },
    scrollView: {
      marginHorizontal: 5,
    },
    scrollViewPadding: {
      padding: 10,
    },
    searchBar: {
      padding: 10,
      height: 50,
      borderWidth: 2,
      borderRadius: 5,
      borderColor: colors.border,
      backgroundColor: colors.background,
      color: colors.primary,
    },

    pressableArea: {
      borderRadius: 20,
      width: 50,
      height: 50,
      position: 'absolute',
      right: 10,
      top: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
