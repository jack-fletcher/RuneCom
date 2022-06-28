
///
/// Imports
///
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  useColorScheme,
} from 'react-native';
import HiScoreScreen from './src/screens/HiScoreScreen';
import NoteScreen from './src/screens/AllNoteScreen';
import HomeScreen from './src/screens/HomeScreen';
import SocialScreen from './src/screens/SocialScreen';
import AdventurerLogScreen from './src/screens/AdventurerLogScreen';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CreateNoteScreen from './src/screens/CreateNoteScreen';
import EditNoteScreen from './src/screens/EditNoteScreen';

///
/// Screen navigation
/// Returns a specific screen within a SafeAreaView when user clicks on bottom navigation or traverses in app navigation
///
function Hiscores({navigation}) {
  return (
    <SafeAreaView style={[styles.container, {}]}>
      <HiScoreScreen navigation={navigation} />
    </SafeAreaView>
  );
}

function Social({navigation}) {
  return (
    <SafeAreaView style={[styles.container, {}]}>
      <SocialScreen navigation={navigation} />
    </SafeAreaView>
  );
}

function Home({navigation}) {
  return (
    <SafeAreaView style={[styles.container, {}]}>
      <HomeScreen navigation={navigation} />
    </SafeAreaView>
  );
}

function AdventurerLog({navigation}) {
  return (
    <SafeAreaView style={[styles.container, {}]}>
      <AdventurerLogScreen navigation={navigation} />
    </SafeAreaView>
  );
}

function Notes({navigation}) {
  return (
    <SafeAreaView style={[styles.container, {}]}>
      <NoteScreen navigation={navigation} />
    </SafeAreaView>
  );
}

function CreateNotes({navigation}) {
  return (
    <SafeAreaView style={[styles.container, {}]}>
      <CreateNoteScreen navigation={navigation} />
    </SafeAreaView>
  );
}

function EditNote({navigation, route}) {
  return (
    <SafeAreaView style={[styles.container, {}]}>
      <EditNoteScreen navigation={navigation} route={route} />
    </SafeAreaView>
  );
}

///Create bottom tab navigation
const Stack = createBottomTabNavigator();


/// Setup for stack navigation
function MyTabs(props) {
  return (
    <Stack.Navigator
      screenOptions={{tabBarHideOnKeyboard: true}}
      initialRouteName="Home">
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{width: size, height: size}}
                source={require('./src/res/stats_dark.webp')}
              />
            );
          },
        }}
        name="HiScores"
        component={Hiscores}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{width: size, height: size}}
                source={require('./src/res/logging.webp')}
              />
            );
          },
        }}
        name="Log"
        component={AdventurerLog}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{width: size, height: size}}
                source={require('./src/res/home_dark.webp')}
              />
            );
          },
        }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{width: size, height: size}}
                source={require('./src/res/edit_dark.webp')}
              />
            );
          },
        }}
        name="Notes"
        component={Notes}
      />

      <Stack.Screen
        options={{headerShown: false, tabBarItemStyle: {display: 'none'}}}
        name="Create Note"
        component={CreateNotes}
      />
      <Stack.Screen
        options={{headerShown: false, tabBarItemStyle: {display: 'none'}}}
        name="Edit Note"
        component={EditNote}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({size}) => {
            return (
              <Image
                style={{width: size, height: size}}
                source={require('./src/res/rss.webp')}
              />
            );
          },
        }}
        name="Social"
        component={Social}
      />
    </Stack.Navigator>
  );
}


export default function App() {
  
  ///
  /// Create app colour scheme for use within app
  /// Passes custom colour theme into react navigation
  /// Call react navigation useTheme to use
  ///
  var scheme = useColorScheme();

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#1c00db',
    },
  };

  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#ff200c',
    }
  }

  return (
    <NavigationContainer theme={scheme === 'dark' ? darkTheme : lightTheme}>
      <MyTabs theme={scheme} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
