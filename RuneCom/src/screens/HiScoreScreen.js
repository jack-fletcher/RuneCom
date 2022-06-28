import React, {useEffect, useRef,useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  ToastAndroid,
  RefreshControl,
  Button,
  Alert
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Papa from 'papaparse';
import {useOrientation} from '../components/useOrientation';
import NetInfo from "@react-native-community/netinfo";
import ShowOfflineMessage from '../components/connectionChecker';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Using wiki links for pages instead of local as it seems more legally viable to take from a url source instead of package images and essentially distribute them to users.
//Does come with the disadvantage of not working offline though, considering alt text in this situation.
//Hooking into react-native-appearance API instead of manually setting it as I was doing before
var HiScoreTable = ({navigation}) => {
  //Consts declaration
  const [refreshing, setRefreshing] = React.useState(false);
  var [skillData, setSkillData] = useState([]);
  const orientation = useOrientation();
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  var [username, setUsername] = useState();
  const inputText = useRef();
  /**
   * @param  {int}} timeout duration to wait
   */
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  ///Array of skillNames - url data does not contain this
  const skillNames = {
    1: 'Overall',
    2: 'Attack',
    3: 'Defence',
    4: 'Strength',
    5: 'Constitution',
    6: 'Ranged',
    7: 'Prayer',
    8: 'Magic',
    9: 'Cooking',
    10: 'Woodcutting',
    11: 'Fletching',
    12: 'Fishing',
    13: 'Firemaking',
    14: 'Crafting',
    15: 'Smithing',
    16: 'Mining',
    17: 'Herblore',
    18: 'Agility',
    19: 'Thieving',
    20: 'Slayer',
    21: 'Farming',
    22: 'Runecrafting',
    23: 'Hunter',
    24: 'Construction',
    25: 'Summoning',
    26: 'Dungeoneering',
    27: 'Divination',
    28: 'Invention',
    29: 'Archaeology',
  };

  ///Array of skillIcons URLs - url data does not contain this
  const skillIcons = {
    1: 'https://oldschool.runescape.wiki/images/Skills_icon.png?a8e9f',
    2: 'https://runescape.wiki/images/Attack.png?07862',
    3: 'https://runescape.wiki/images/Defence.png?84e82',
    4: 'https://runescape.wiki/images/Strength.png?132be',
    5: 'https://runescape.wiki/images/Constitution.png?cbee2',
    6: 'https://runescape.wiki/images/Ranged.png?6750b',
    7: 'https://runescape.wiki/images/Prayer.png?75072',
    8: 'https://runescape.wiki/images/Magic.png?63af9',
    9: 'https://runescape.wiki/images/Cooking.png?8fd82',
    10: 'https://runescape.wiki/images/Woodcutting.png?bb7c4',
    11: 'https://runescape.wiki/images/Fletching.png?46245',
    12: 'https://runescape.wiki/images/Fishing.png?127ba',
    13: 'https://runescape.wiki/images/Firemaking.png?b5f81',
    14: 'https://runescape.wiki/images/Crafting.png?9b262',
    15: 'https://runescape.wiki/images/Smithing.png?65e82',
    16: 'https://runescape.wiki/images/Mining.png?a9e26',
    17: 'https://runescape.wiki/images/Herblore.png?a1c99',
    18: 'https://runescape.wiki/images/Agility.png?3b013',
    19: 'https://runescape.wiki/images/Thieving.png?15b46',
    20: 'https://runescape.wiki/images/Slayer.png?14807',
    21: 'https://runescape.wiki/images/Farming.png?be367',
    22: 'https://runescape.wiki/images/Runecrafting.png?03f2f',
    23: 'https://runescape.wiki/images/Hunter.png?1db3b',
    24: 'https://runescape.wiki/images/Construction.png?f91f2',
    25: 'https://runescape.wiki/images/Summoning.png?5131c',
    26: 'https://runescape.wiki/images/Dungeoneering.png?19535',
    27: 'https://runescape.wiki/images/Divination.png?52d94',
    28: 'https://runescape.wiki/images/Invention.png?97229',
    29: 'https://runescape.wiki/images/Archaeology.png?ca4f1',
  };

  //Display functions
  /**
   * Returns hiscore search bar visuals
   */
  function displaySearchBar() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          ref={inputText}
          style={styles.searchBar}
          placeholder="Search HiScores..."
          placeholderTextColor={colors.text}
         // onChangeText={newUsername => test(newUsername)}
          defaultValue={username}
          onSubmitEditing={newUsername => setUsername(newUsername.nativeEvent.text)}
          autoCorrect={false}
          multiline={false}
          maxLength={12}
        />
        {/* <Pressable
        hitSlop={10}
          onPress={() => test(inputText.current)}
          style={({pressed}) => [
            {backgroundColor: pressed ? colors.border : colors.empty},
            styles.pressableArea,
          ]}>
          <ImageBackground
            source={require('../res/search.webp')}
            style={{width: 25, height: 25, position: 'absolute'}}>
            <Text></Text>
          </ImageBackground>
        </Pressable> */}
      </View>
    );
  }

  // function test(input){
  //   console.log(inputText._lastNativeText);
  // //  setUsername(input.nativeEvent.text);
  // }
  function getStoredUsername() {
    AsyncStorage.getItem('Username', (error, result) => {
      if(result){
        setUsername(result);
         FetchDataFromJagex();
      }
    });
  }

  function setStoredUsername(input) {
    AsyncStorage.setItem('Username', input);
  }
  /**
   * Displays the HiScore Title, with conditional rendering for skill names
   * @returns return HiScore titles'
   */
  function displayHiscoreTitle() {
    if (orientation === 'PORTRAIT') {
      return (
        <View style={[styles.row]}>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              Icon
            </Text>
          </View>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              {' '}
              Rank{' '}
            </Text>
          </View>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              {' '}
              Level
            </Text>
          </View>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              {' '}
              XP{' '}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.row]}>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              Icon
            </Text>
          </View>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              {' '}
              Skill{' '}
            </Text>
          </View>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              {' '}
              Rank{' '}
            </Text>
          </View>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              {' '}
              Level
            </Text>
          </View>
          <View style={[styles.content]}>
            <Text numberOfLines={1} style={[styles.title]}>
              {' '}
              XP{' '}
            </Text>
          </View>
        </View>
      );
    }
  }
  ///Regex taken from: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  function displayHiscoreData() {
    if (orientation === 'PORTRAIT') {
      return skillData.slice(0, 29).map((item, i) => {
        return (
          <View style={[styles.row]} key={i}>
            <View style={[styles.content]}>
              <Image
                style={styles.imageStyle}
                source={{uri: skillIcons[i + 1]}}
              />
            </View>
            <View style={[styles.content]}>
              <Text numberOfLines={1} style={[styles.text]}>
                {item[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
            <View style={[styles.content]}>
              <Text numberOfLines={1} style={[styles.text]}>
                {item[1].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
            <View style={[styles.content]}>
              <Text numberOfLines={1} style={[styles.text]}>
                {item[2].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
          </View>
        );
      });
    } else {
      return skillData.slice(0, 29).map((item, i) => {
        return (
          <View style={[styles.row]} key={i}>
            <View style={[styles.content]}>
              <Image
                style={styles.imageStyle}
                source={{uri: skillIcons[i + 1]}}
              />
            </View>
            <View style={[styles.content]}>
              <Text numberOfLines={1} style={[styles.text]}>
                {skillNames[i + 1]}
              </Text>
            </View>
            <View style={[styles.content]}>
              <Text numberOfLines={1} style={[styles.text]}>
                {item[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
            <View style={[styles.content]}>
              <Text numberOfLines={1} style={[styles.text]}>
                {item[1].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
            <View style={[styles.content]}>
              <Text numberOfLines={1} style={[styles.text]}>
                {item[2].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
          </View>
        );
      });
    }
  }
  
  //Format functions
  useEffect(() => {
    getStoredUsername();
  }, []);

  useEffect(() => {
    console.log("i fire once");
    FetchDataFromJagex();
  }, [username]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    FetchDataFromJagex();
    wait(2000).then(() => setRefreshing(false));
  }, [username]);

  ///
  /// Fetches the data from Jagex API and parses it as JSON. Data is normally CSV
  /// Requires internet connection, otherwise error message is thrown.
  ///
  
  /**
   * Fetches the data from Jagex API and parses it as JSON. Data is normally CSV
   * Requires internet connection, otherwise error message is thrown.
   */
  var FetchDataFromJagex = () => {
    ///Regardless of connectivity state, cache the username for future use.
    if (username){
    setStoredUsername(username);
    
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        var baseUrl =
        'https://secure.runescape.com/m=hiscore/index_lite.ws?player=';
      //Format for web
      _username = username.replace(' ', '_');
      var Url = baseUrl + _username;
      if (!_username) {
        ShowErrorMessage(
          'Please type a valid Runescape 3 username into the textbox.',
        );
        inputText.current.clear();
      } else {
        Papa.parse(Url, {
          download: true,
          error: function (error) {
            ShowErrorMessage(
              'Please ensure the given username is a valid Runescape 3 account.',
            );
            inputText.current.clear();
          },
          complete: function (results) {
            setSkillData(results.data);
          },
        });
      }
      }
      else {
        ShowErrorMessage("Please ensure you are connected to the internet and try again.");
      }
    })
  }
};

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
      console.log(username);
    ResetUsername()
  };

  
  /**
   * Resets the visible username
   */
  const ResetUsername = () => {
    setUsername('');
  }

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      style={[styles.scrollView, {}]}
      contentContainerStyle={styles.contentContainer}>
      <View style={[styles.scrollViewPadding]}>
        <ShowOfflineMessage/>
        {displaySearchBar()}
        {/* Table headers */}
        {displayHiscoreTitle()}
        {/* Data content */}
        <View>{displayHiscoreData()}</View>
      </View>
    </ScrollView>
  );
};

export default HiScoreTable;

///
/// Attributed to:
/// https://stackoverflow.com/questions/66864061/how-do-i-use-the-usetheme-hook-inside-my-stylesheet-create
///
export const makeStyles = colors =>
  StyleSheet.create({
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      color: colors.text,
    },

    text: {
      color: colors.text,
      fontSize: 13,
    },

    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      flex: 1,
      position: 'relative',
      height: 50,
      width: '100%',
      backgroundColor: colors.background,
      color: colors.text,
      borderColor: colors.border,
    },

    content: {
      flexDirection: 'row',
      flex: 1,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageStyle: {
      width: null,
      flex: 1,
      margin: 20,
      height: '100%',
      resizeMode: 'contain',
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
      backgroundColor: colors.background,
      borderColor: colors.border,
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
