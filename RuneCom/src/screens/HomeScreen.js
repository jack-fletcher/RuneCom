import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ToastAndroid,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import ShowOfflineMessage from '../components/connectionChecker';

var HomeScreen = () => {
  const window = useWindowDimensions();
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getContent();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const [vosData, setVosData] = useState([]);
  const [merchData, setMerchData] = useState([]);
  const [merchTomorrowData, setMerchTomorrowData] = useState([]);
  const {colors} = useTheme();
  const styles = makeStyles(colors, window);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const VoS = {
    Ithell: 'https://runescape.wiki/images/Ithell_Clan.png?95c05',
    Hefin: 'https://runescape.wiki/images/Hefin_Clan.png?e62c8',
    Amlodd: 'https://runescape.wiki/images/Amlodd_Clan.png?6c04f',
    Cadarn: 'https://runescape.wiki/images/Cadarn_Clan.png?f8c96',
    Crwys: 'https://runescape.wiki/images/Crwys_Clan.png?49be0',
    Iorwerth: 'https://runescape.wiki/images/Iorwerth_Clan.png?6d35e',
    Meilyr: 'https://runescape.wiki/images/Meilyr_Clan.png?6a5e9',
    Trahaearn: 'https://runescape.wiki/images/Trahaearn_Clan.png?9b997',
  };
  /**
   * Main refresh function, gets all new content
   */
  const getContent = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        getVoS();
        getMerch();
        getMerchTomorrow();
      }
    });
  };
  /**
   * Fetches the current voice of seren data and sets its state
   */
  const getVoS = async url => {
    try {
      const response = await fetch('https://api.weirdgloop.org/runescape/vos');
      const json = await response.json();
      setVosData([json]);
    } catch (e) {
      SendMessage(e)
    }
  };
    /**
   * Fetches the  merchant data and sets its state
   */

  function SendMessage(msg){
  if (Platform.OS == 'android'){
    ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
  }
  else if (Platform.OS == 'ios'){
    Alert.alert(msg)
  }
  }

  const getMerch = async () => {
    try {
      const response = await fetch(
        'https://api.weirdgloop.org/runescape/tms/current',
      );
      const json = await response.json();
      setMerchData([json]);
    } catch (e) {
      SendMessage(e)
    }
  };

  /**
   * Fetches the future merchant data for tomorrow and sets its state
   */
  const getMerchTomorrow = async () => {
    try {
      const response = await fetch(
        'https://api.weirdgloop.org/runescape/tms/next',
      );
      const json = await response.json();
      setMerchTomorrowData([json]);
    } catch (e) {
      SendMessage(e)
    }
  };
  /**
   * Displays VoS data
   */
  function displayVoS() {
    return vosData.map((item, i) => {
      return (
        <View style={styles.card} key={i}>
          <View style={styles.header}>
            <Text style={styles.cardTitle}> Current Voice of Seren </Text>
          </View>
          <Text style={styles.text}>
            {' '}
            The currently active Voice of Seren is:{' '}
            <Text style={styles.title}>
              {' '}
              {'\n'} {item ? item.district1 : null} and{' '}
              {item ? item.district2 : null}{' '}
            </Text>
          </Text>
          <View style={styles.rowContainer}>
            <Image
              style={styles.cardImage}
              source={{uri: VoS[item.district1]}}
            />
            <Image
              style={styles.cardImage}
              source={{uri: VoS[item.district2]}}
            />
          </View>
        </View>
      );
    });
  }
  /**
   * Displays current Travelling Merchant data
   */
  function displayMerchToday() {
    return merchData.map((item, i) => {
      return (
        <View style={styles.card} key={i}>
          <View style={styles.header}>
            <Text style={styles.cardTitle}> Travelling Merchant - Today </Text>
          </View>
          <Text style={styles.text}>
            {' '}
            The current Travelling Merchant stock is: {'\n'}{' '}
            <Text style={styles.title}>
              {' '}
              {item ? item[0] : null}, {item ? item[1] : null},{' '}
              {item ? item[2] : null} and {item ? item[3] : null}{' '}
            </Text>
          </Text>
        </View>
      );
    });
  }
  /**
   * Displays future Travelling Merchant data
   */
  function displayMerchTomorrow() {
    return merchTomorrowData.map((item, i) => {
      return (
        <View style={styles.card} key={i}>
          <View style={styles.header}>
            <Text style={styles.cardTitle}>
              {' '}
              Travelling Merchant - Tomorrow{' '}
            </Text>
          </View>
          <Text style={styles.text}>
            {' '}
            Tomorrow's Travelling Merchant stock is: {'\n'}{' '}
            <Text style={styles.title}>
              {' '}
              {item ? item[0] : null}, {item ? item[1] : null}, {item[2]} and{' '}
              {item[3]}{' '}
            </Text>
          </Text>
        </View>
      );
    });
  }
  /**
   * Displays disclaimer
   */
  function displayDecoratorContent() {
    return (
      <Text style={{textAlign: 'center', padding: 10, color: colors.text}}>
        {' '}
        Please note. All Runescape related images and ideas are the property of
        Jagex.{' '}
      </Text>
    );
  }
  useEffect(() => {
    getContent();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.scrollView}>
      <View style={styles.container}>
        <ShowOfflineMessage />
        <View>{displayVoS()}</View>
        <View>{displayMerchToday()}</View>
        <View>{displayMerchTomorrow()}</View>
      </View>
      {displayDecoratorContent()}
    </ScrollView>
  );
};

export default HomeScreen;

const makeStyles = (colors, window) =>
  StyleSheet.create({
    rowContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    cardImage: {
      width: '50%',
      height: '50%',
      justifyContent: 'space-between',
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    cardTitle: {
      width: '100%',
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      fontSize: 16,
    },
    header: {
      width: '100%',
      backgroundColor: colors.card,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      color: colors.text,
    },
    scrollView: {
      marginHorizontal: 5,
    },
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    card: {
      width: window.width * 0.8,
      margin: 10,
      height: 200,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: colors.border,
      elevation: 10,
    },
    title: {
      textAlign: 'center',
      fontWeight: 'bold',
    },
    text: {
      color: colors.text,
      margin: 10,
      textAlign: 'center',
    },
    hyperlink: {
      color: '#0000EE',
    },
    button: {},
  });
