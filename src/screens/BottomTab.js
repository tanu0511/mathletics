

// import { BackHandler, Image, StyleSheet, Text, View, Dimensions } from 'react-native';
// import React, { useEffect } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useNavigation } from '@react-navigation/native';
// import Home from './Home';
// import More from './More';
// import Learn from './Learn';
// import Puzzle from './Puzzle';
// import Leaderboard from './Leaderboard';
// import Achivements from './Achivements';
// import UserProfile from './UserProfile';
// import ProfileScreen from './ProfileScreen';
// import FriendRequestScreen from './FriendRequestScreen';
// import PlayGame from './PlayGame';
// import AddUserScreen from './AddUserScreen';
// import Notification from './Notification';
// import UpdateProfile from './UpdateProfile';
// import ThemeSelectorScreen from './ThemeSelectorScreen';
// import SettingsScreen from './SettingsScreen';
// import Username from './Username';
// import TutorialSpot, { TutorialTarget, TutorialOverlay } from '../components/TutorialSpot';
// import { useAppTranslation } from '../context/TranslationContext';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// // Generic bottom-tab icon wrapped in a coach-mark. Defined as a real top-level
// // component (not inline in render) so useNavigation()/hooks are valid and
// // TutorialSpot doesn't remount every time BottomTab re-renders.
// const TabCoachIcon = ({ focused, source, label, stepKey, text, routeName, isLast = false }) => {
//   const navigation = useNavigation();
//   return (
//     <TutorialSpot
//       screenKey="HOME"
//       stepKey={stepKey}
//       text={text}
//       isLast={isLast}
//       onNext={() => navigation.navigate(routeName)}
//     >
//       <View style={styles.iconContainer}>
//         <Image
//           source={source}
//           style={[styles.icon, { tintColor: focused ? '#fff' : '#999' }]}
//           resizeMode="contain"
//         />
//         <Text style={[styles.label, { color: focused ? '#fff' : '#999' }]}>{label}</Text>
//       </View>
//     </TutorialSpot>
//   );
// };
// const HomeStack = createNativeStackNavigator();

// const { width, height } = Dimensions.get('window');

// // ✅ Stack: Home tab can push into PlayGame without leaving the tab
// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator screenOptions={{ headerShown: false }}>
//       <HomeStack.Screen name="HomeMain" component={Home} />
//       <HomeStack.Screen name="PlayGame" component={PlayGame} />
//       <HomeStack.Screen name="Leaderboard" component={Leaderboard} />
//       <HomeStack.Screen name="Achivements" component={Achivements} />
//       <HomeStack.Screen name="UserProfile" component={UserProfile} />
//       <HomeStack.Screen name="FriendRequestScreen" component={FriendRequestScreen} />
//       <HomeStack.Screen name="AddUserScreen" component={AddUserScreen} />
//       <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} />
//       <HomeStack.Screen name="Notification" component={Notification} />
//       <HomeStack.Screen name="UpdateProfile" component={UpdateProfile} />
//       <HomeStack.Screen name="ThemeSelectorScreen" component={ThemeSelectorScreen} />
//       <HomeStack.Screen name = "Username" component={Username} />
//     </HomeStack.Navigator>
//   );
// }

// const BottomTab = () => {
//   const { t } = useAppTranslation();

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       // Let React Navigation handle back button natively
//       return false;
//     });
//     return () => backHandler.remove();
//   }, []);

//   // ✅ t('Home'), t('Play'), t('Practise'), t('More') now correctly resolve
//   // from top-level keys in appStrings (not from labels[]) because:
//   //   - These strings only exist as top-level keys in appStrings.js
//   //   - TranslationContext.t() checks top-level keys FIRST
//   const renderIcon = (source, label, focused) => (
//     <View style={styles.iconContainer}>
//       <Image
//         source={source}
//         style={[styles.icon, { tintColor: focused ? '#fff' : '#999' }]}
//         resizeMode="contain"
//       />
//       <Text style={[styles.label, { color: focused ? '#fff' : '#999' }]}>
//         {label}
//       </Text>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
//       <Tab.Navigator
//         initialRouteName="Home"
//         screenOptions={{
//           headerShown: false,
//           tabBarShowLabel: false,
//           tabBarStyle: {
//             backgroundColor: '#1E293B',
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//             borderTopWidth: 0,
//             height: 60,
//             paddingTop: 9,
//           },
//         }}
//       >
//         <Tab.Screen
//           name="Home"
//           component={HomeStackScreen}
//           options={{
//             tabBarIcon: ({ focused }) =>
//               renderIcon(require('../assets/Home.png'), t('Home'), focused),
//           }}
//         />
//         <Tab.Screen
//           name="Play"
//           component={PlayGame}
//           initialParams={{ gametype: 'PLAY' }}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabCoachIcon
//                 focused={focused}
//                 source={require('../assets/PuzzleIcon.png')}
//                 label={t('Play')}
//                 stepKey="playtab"
//                 text="Or jump straight into a match from the Play tab"
//                 routeName="Play"
//               />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Practise"
//           component={PlayGame}
//           initialParams={{ gametype: 'PRACTICE' }}
//           options={{
//             tabBarIcon: ({ focused }) =>
//               renderIcon(require('../assets/Learn.png'), t('Practise'), focused),
//           }}
//         />
//         <Tab.Screen
//           name="More"
//           component={More}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabCoachIcon
//                 focused={focused}
//                 source={require('../assets/More.png')}
//                 label={t('More')}
//                 stepKey="moretab"
//                 text="Tap More for profile, stats, achievements & theme"
//                 routeName="More"
//                 isLast={false}
//               />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </View>
//   );
// };

// export default BottomTab;

// const styles = StyleSheet.create({
//   iconContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: width * 0.18,
//   },
//   icon: {
//     width: width * 0.06,
//     height: height * 0.035,
//     marginBottom: 2,
//   },
//   label: {
//     fontSize: 10,
//     textAlign: 'center',
//   },
// });

import { BackHandler, Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import More from './More';
import Learn from './Learn';
import Puzzle from './Puzzle';
import Leaderboard from './Leaderboard';
import Achivements from './Achivements';
import UserProfile from './UserProfile';
import ProfileScreen from './ProfileScreen';
import FriendRequestScreen from './FriendRequestScreen';
import PlayGame from './PlayGame';
import AddUserScreen from './AddUserScreen';
import Notification from './Notification';
import UpdateProfile from './UpdateProfile';
import ThemeSelectorScreen from './ThemeSelectorScreen';
import SettingsScreen from './SettingsScreen';
import Username from './Username';
import { TutorialTarget, TutorialOverlay } from '../components/TutorialSpot'; // ✅ tutorial coach-marks
import { useAppTranslation } from '../context/TranslationContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const { width, height } = Dimensions.get('window');

// ✅ Stack: Home tab can push into PlayGame without leaving the tab
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={Home} />
      <HomeStack.Screen name="PlayGame" component={PlayGame} />
      <HomeStack.Screen name="Leaderboard" component={Leaderboard} />
      <HomeStack.Screen name="Achivements" component={Achivements} />
      <HomeStack.Screen name="UserProfile" component={UserProfile} />
      <HomeStack.Screen name="FriendRequestScreen" component={FriendRequestScreen} />
      <HomeStack.Screen name="AddUserScreen" component={AddUserScreen} />
      <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <HomeStack.Screen name="Notification" component={Notification} />
      <HomeStack.Screen name="UpdateProfile" component={UpdateProfile} />
      <HomeStack.Screen name="ThemeSelectorScreen" component={ThemeSelectorScreen} />
      <HomeStack.Screen name = "Username" component={Username} />
    </HomeStack.Navigator>
  );
}

const BottomTab = () => {
  const { t } = useAppTranslation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Let React Navigation handle back button natively
      return false;
    });
    return () => backHandler.remove();
  }, []);

  // Plain (non-tutorial) tab icon
  const renderIcon = (source, label, focused) => (
    <View style={styles.iconContainer}>
      <Image
        source={source}
        style={[styles.icon, { tintColor: focused ? '#fff' : '#999' }]}
        resizeMode="contain"
      />
      <Text style={[styles.label, { color: focused ? '#fff' : '#999' }]}>
        {label}
      </Text>
    </View>
  );

  // Tab icon that's also a tutorial spotlight target. `id` must match an id
  // listed in some TUTORIAL_FLOW step's `targets` array — the global
  // TutorialOverlay (mounted below) finds it via the registry and can
  // highlight it together with targets living in completely different
  // component trees (e.g. this Play-tab icon + Home's Play button, same step).
  const renderTargetIcon = (id, source, label, focused) => (
    <TutorialTarget id={id}>
      <View style={styles.iconContainer}>
        <Image
          source={source}
          style={[styles.icon, { tintColor: focused ? '#fff' : '#999' }]}
          resizeMode="contain"
        />
        <Text style={[styles.label, { color: focused ? '#fff' : '#999' }]}>{label}</Text>
      </View>
    </TutorialTarget>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#1E293B',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0,
            height: 60,
            paddingTop: 9,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              renderIcon(require('../assets/Home.png'), t('Home'), focused),
          }}
        />
        <Tab.Screen
          name="Play"
          component={PlayGame}
          initialParams={{ gametype: 'PLAY' }}
          options={{
            tabBarIcon: ({ focused }) =>
              renderTargetIcon('tabbar:playtab', require('../assets/PuzzleIcon.png'), t('Play'), focused),
          }}
        />
        <Tab.Screen
          name="Practise"
          component={PlayGame}
          initialParams={{ gametype: 'PRACTICE' }}
          options={{
            tabBarIcon: ({ focused }) =>
              renderIcon(require('../assets/Learn.png'), t('Practise'), focused),
          }}
        />
        <Tab.Screen
          name="More"
          component={More}
          options={{
            tabBarIcon: ({ focused }) =>
              renderTargetIcon('tabbar:more', require('../assets/More.png'), t('More'), focused),
          }}
        />
      </Tab.Navigator>

      {/* Single global tutorial overlay — mounted once here so it sits above
          both the tab bar and whatever screen is active, and can resolve
          targets registered from any screen or from this bar itself. */}
      <TutorialOverlay />
    </View>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.18,
  },
  icon: {
    width: width * 0.06,
    height: height * 0.035,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
});