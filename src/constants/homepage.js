// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   PixelRatio,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import MaskedView from '@react-native-masked-view/masked-view';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../context/ThemeContext'; // ✅ import theme

// // 🎵 Import SoundManager
// import {
//   // playBackgroundMusic,
//   // stopBackgroundMusic,
//   unmuteBackgroundMusic,
// } from '../utils/playBackgroundMusic';
// import { useSound } from '../context/SoundContext';

// const { width, height } = Dimensions.get('window');

// const { width, height } = Dimensions.get('window');
// const scaleFont = (size) => size * PixelRatio.getFontScale();

// const Home = () => {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const { theme } = useTheme(); // ✅ get theme
//   const { isSoundOn, toggleSound } = useSound();


//   const Content = () => (
//     <View style={[styles.contentContainer, { paddingTop: insets.top + 30 }]}>
//       <View style={styles.iconGrid}>
//         <View style={styles.iconColumn}>
//           <TouchableOpacity onPress={() => navigation.navigate('CommingSoon')}>
//             <Image source={require('../assets/funcation.png')} style={styles.gridIcon} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
//             <Image source={require('../assets/profile.png')} style={styles.gridIcon} />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.iconColumn}>
//           <TouchableOpacity onPress={() => navigation.navigate('CommingSoon')}>
//             <Image source={require('../assets/setting.png')} style={styles.gridIcon} />
//           </TouchableOpacity>

//           {/* 🔊 Sound Toggle */}
//           <TouchableOpacity onPress={toggleSound}>
//             <MaskedView
//               maskElement={
//                 <Ionicons
//                   name={!isSoundOn ? 'volume-mute' : 'volume-high'}
//                   size={wp('7%')}
//                   color="black"
//                   style={{ marginBottom: height * 0.010 }}
//                 />
//               }>
//               <LinearGradient
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 colors={['#00F5FF', '#00C3FF', '#006BFF']}
//                 style={{ width: wp('8%'), height: wp('8%') }}
//               />
//             </MaskedView>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* 🎮 Center Buttons with theme color */}
//       <TouchableOpacity
//         onPress={() => navigation.navigate('PlayGame', { gametype: 'PRACTICE' })}
//         style={[
//           styles.newButton1,
//           { backgroundColor: theme.primary || '#FB923C' },
//         ]}>
//         <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
//         <Text style={styles.newText}>PRACTICE</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => navigation.navigate('PlayGame', { gametype: 'PLAY' })}
//         style={[
//           styles.newButton,
//           { backgroundColor: theme.primary || '#FB923C' },
//         ]}>
//         <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
//         <Text style={styles.newText}>PLAY</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.safeArea}>
//       {/* ✅ Apply theme background */}
//       {theme.backgroundGradient ? (
//         <LinearGradient colors={theme.backgroundGradient} style={styles.container}>

//           <Content />
//         </LinearGradient>
//       ) : (
//         <View
//           style={[
//             styles.container,
//             { backgroundColor: theme.backgroundColor || '#0B1220' },
//           ]}>
//           <Content />
//         </View>
//       )}
//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   safeArea: { flex: 1 },
//   container: { flex: 1 },
//   contentContainer: {
//     flex: 1,
//     paddingHorizontal: wp('4%'),
//   },
//   iconGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   iconColumn: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     height: hp('12%'),
//   },
//   gridIcon: {
//     width: wp('8%'),
//     height: wp('8%'),
//     resizeMode: 'contain',
//     marginBottom: hp('1.5%'),
//   },
//   newButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'center',
//     paddingVertical: hp('1.5%'),
//     paddingHorizontal: wp('12%'),
//     marginTop: hp('2%'),
//     width: wp('70%'),
//     height: hp('7%'),
//     borderRadius: wp('5.3%'),
//     justifyContent: 'center',
//   },
//   newButton1: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'center',
//     paddingVertical: hp('1.5%'),
//     paddingHorizontal: wp('12%'),
//     marginTop: hp('30%'),
//     width: wp('70%'),
//     height: hp('7%'),
//     borderRadius: wp('5.3%'),
//     justifyContent: 'center',
//   },
//   ticketIcon: {
//     width: wp('7%'),
//     height: wp('7%'),
//     resizeMode: 'contain',
//     marginRight: wp('3%'),
//   },
//   newText: {
//     fontSize: normalizeFont(18),
//     color: '#fff',
//     fontWeight: '700',
//   },
// });

// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     Image,
//     TouchableOpacity,
//     Dimensions,
//     PixelRatio,
//     SafeAreaView,
//     StatusBar,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import MaskedView from '@react-native-masked-view/masked-view';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../context/ThemeContext'; // ✅ import theme
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSocket } from '../context/Socket';

// // 🎵 Import SoundManager
// import {
//     // playBackgroundMusic,
//     // stopBackgroundMusic,
//     muteBackgroundMusic,
//     unmuteBackgroundMusic,
// } from '../utils/playBackgroundMusic';

// import { useSound } from '../context/SoundContext'; // ✅ import context

// const { width, height } = Dimensions.get('window'); // Keep for safety if used elsewhere
// import { wp, hp, normalizeFont } from '../utils/Responsive';

// // const scaleFont = (size) => size * PixelRatio.getFontScale(); // Removed local scale


// const Home = () => {
//     const navigation = useNavigation();
//     const insets = useSafeAreaInsets();
//     const { theme } = useTheme(); // ✅ get theme
//     const { isSoundOn, toggleSound } = useSound(); // ✅ Use Global Sound
//     const socket = useSocket();

//     // useEffect(() => {
//     //   playBackgroundMusic();
//     //   return () => stopBackgroundMusic();
//     // }, []);

//     // const toggleSound = () => {
//     //   if (isMuted) unmuteBackgroundMusic();
//     //   else muteBackgroundMusic();
//     //   setIsMuted(!isMuted);
//     // };

//     console.log("Jitendra")
//     console.log('SOCKET OBJECT:', socket);


//     useEffect(() => {
//         let isMounted = true;

//         const registerPlayer = async () => {
//             try {
//                 const userData = await AsyncStorage.getItem('userData');
//                 if (!userData) return;
//                 console.log(userData)

//                 const user = JSON.parse(userData);

//                 if (!socket.connected) {
//                     socket.connect();
//                 }

//                 socket.emit('register-player', {
//                     userId: user._id,
//                     username: user.username,
//                     email: user.email,
//                     rating: user.pr.pvp.medium || 1000,
//                     diff: user.preferences.defaultDifficulty || 'easy',
//                     timer: user.preferences.defaultTimer || 60,
//                     symbol: user.preferences.defaultSymbol || [
//                         'sum',
//                         'difference'
//                     ],
//                 });

//                 console.log('✅ register-player emitted');
//             } catch (err) {
//                 console.error('❌ register-player failed', err);
//             }
//         };

//         if (isMounted) {
//             registerPlayer();
//         }

//         // ✅ listener registered ONCE
//         const onPlayerRegistered = data => {
//             console.log('🟢 Player registered home:', data);
//         };

//         socket.on('player-registered', onPlayerRegistered);

//         return () => {
//             isMounted = false;

//             // ✅ cleanup listener
//             socket.off('player-registered', onPlayerRegistered);
//         };
//     }, [socket]);



//     const Content = () => (
//         <View style={[styles.contentContainer, { paddingTop: insets.top + 30 }]}>
//             <View style={styles.iconGrid}>
//                 <View style={styles.iconColumn}>
//                     <TouchableOpacity onPress={() => navigation.navigate('CommingSoon')}>
//                         <Image source={require('../assets/funcation.png')} style={styles.gridIcon} />
//                     </TouchableOpacity>
//                     <View style={{ justifyContent: "flex-end", flexDirection: "row", gap: 15 }}>
//                         <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
//                             <Image source={require('../assets/profile.png')} style={styles.gridIcon} />
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={() => navigation.navigate('CommingSoon')}>
//                             <Image source={require('../assets/setting.png')} style={styles.gridIcon} />
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//                 <View style={styles.iconColumn}>


//                     {/* 🔊 Sound Toggle */}
//                     {/* <TouchableOpacity onPress={toggleSound}>
//             <MaskedView
//               maskElement={
//                 <Ionicons
//                   name={!isSoundOn ? 'volume-mute' : 'volume-high'}
//                   size={wp('7%')}
//                   color="black"
//                   style={{ marginBottom: height * 0.010 }}
//                 />
//               }>
//               <LinearGradient
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 colors={['#00F5FF', '#00C3FF', '#006BFF']}
//                 style={{ width: wp('8%'), height: wp('8%') }}
//               />
//             </MaskedView>
//           </TouchableOpacity> */}
//                 </View>
//             </View>

//             {/* 🎮 Center Buttons with theme color */}
//             <TouchableOpacity
//                 onPress={() => navigation.navigate('PlayGame', { gametype: 'PRACTICE' })}
//                 style={[
//                     styles.newButton1,
//                     { backgroundColor: theme.primary || '#FB923C' },
//                 ]}>
//                 <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
//                 <Text style={styles.newText}>PRACTICE</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 onPress={() => navigation.navigate('PlayGame', { gametype: 'PLAY' })}
//                 style={[
//                     styles.newButton,
//                     { backgroundColor: theme.primary || '#FB923C' },
//                 ]}>
//                 <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
//                 <Text style={styles.newText}>PLAY</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <View style={styles.safeArea}>
//             {/* ✅ Apply theme background */}
//             {theme.backgroundGradient ? (
//                 <LinearGradient colors={theme.backgroundGradient} style={styles.container}>

//                     <Content />
//                 </LinearGradient>
//             ) : (
//                 <View
//                     style={[
//                         styles.container,
//                         { backgroundColor: theme.backgroundColor || '#0B1220' },
//                     ]}>
//                     <Content />
//                 </View>
//             )}
//         </View>
//     );
// };

// export default Home;

// const styles = StyleSheet.create({
//     safeArea: { flex: 1 },
//     container: { flex: 1 },
//     contentContainer: {
//         flex: 1,
//         paddingHorizontal: wp('4%'),
//     },
//     iconGrid: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     iconColumn: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         height: hp('12%'),
//         gap: "70%"
//     },
//     gridIcon: {
//         width: wp('8%'),
//         height: wp('8%'),
//         resizeMode: 'contain',
//         marginBottom: hp('1.5%'),
//     },
//     newButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         alignSelf: 'center',
//         paddingVertical: hp('1.5%'),
//         paddingHorizontal: wp('12%'),
//         marginTop: hp('2%'),
//         width: wp('70%'),
//         height: hp('7%'),
//         borderRadius: wp('5.3%'),
//         justifyContent: 'center',
//     },
//     newButton1: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         alignSelf: 'center',
//         paddingVertical: hp('1.5%'),
//         paddingHorizontal: wp('12%'),
//         marginTop: hp('30%'),
//         width: wp('70%'),
//         height: hp('7%'),
//         borderRadius: wp('5.3%'),
//         justifyContent: 'center',
//     },
//     ticketIcon: {
//         width: wp('7%'),
//         height: wp('7%'),
//         resizeMode: 'contain',
//         marginRight: wp('3%'),
//     },
//     newText: {
//         fontSize: normalizeFont(18),
//         color: '#fff',
//         fontWeight: '700',
//     },
// });


import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    PixelRatio,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSocket } from '../context/Socket';
import BadgePopup from './BadgePopup';

import {
    muteBackgroundMusic,
    unmuteBackgroundMusic,
} from '../utils/playBackgroundMusic';

import { useSound } from '../context/SoundContext';

const { width, height } = Dimensions.get('window');
import { wp, hp, normalizeFont } from '../utils/Responsive';

const Home = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { isSoundOn, toggleSound } = useSound();
    const socket = useSocket();

    // ── Badge state ─────────────────────────────────────────────────────────
    const [pendingBadges, setPendingBadges] = useState([]);
    const [showBadgePopup, setShowBadgePopup] = useState(false);

    console.log("Jitendra");
    console.log('SOCKET OBJECT:', socket);

    // ── On mount: register socket + check for pending login badges ──────────
    useEffect(() => {
        let isMounted = true;

        const registerPlayer = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (!userData) return;
                console.log(userData);

                const user = JSON.parse(userData);

                if (!socket.connected) {
                    socket.connect();
                }

                socket.emit('register-player', {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    rating: user.pr.pvp.medium || 1000,
                    diff: user.preferences.defaultDifficulty || 'easy',
                    timer: user.preferences.defaultTimer || 60,
                    symbol: user.preferences.defaultSymbol || ['sum', 'difference'],
                });

                console.log('✅ register-player emitted');
            } catch (err) {
                console.error('❌ register-player failed', err);
            }
        };

        // ── Read badges saved by Login screen after successful login ─────────
        const checkPendingBadges = async () => {
            try {
                const raw = await AsyncStorage.getItem('pendingBadges');
                if (!raw) return;

                const badges = JSON.parse(raw);
                console.log('[Badge] 🏅 Pending login badges found:', badges);

                if (Array.isArray(badges) && badges.length > 0) {
                    setPendingBadges(badges);
                    setShowBadgePopup(true);
                }

                // Clear immediately so they don't re-show on next Home mount
                await AsyncStorage.removeItem('pendingBadges');
                console.log('[Badge] Cleared pendingBadges from AsyncStorage');
            } catch (err) {
                console.error('[Badge] Failed to read pendingBadges:', err.message);
            }
        };

        if (isMounted) {
            registerPlayer();
            checkPendingBadges();
        }

        const onPlayerRegistered = data => {
            console.log('🟢 Player registered home:', data);
        };

        socket.on('player-registered', onPlayerRegistered);

        return () => {
            isMounted = false;
            socket.off('player-registered', onPlayerRegistered);
        };
    }, [socket]);

    // ── UI ──────────────────────────────────────────────────────────────────
    const Content = () => (
        <View style={[styles.contentContainer, { paddingTop: insets.top + 30 }]}>
            <View style={styles.iconGrid}>
                <View style={styles.iconColumn}>
                    <TouchableOpacity onPress={() => navigation.navigate('CommingSoon')}>
                        <Image source={require('../assets/funcation.png')} style={styles.gridIcon} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: "flex-end", flexDirection: "row", gap: 15 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                            <Image source={require('../assets/profile.png')} style={styles.gridIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('CommingSoon')}>
                            <Image source={require('../assets/setting.png')} style={styles.gridIcon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.iconColumn} />
            </View>

            {/* 🎮 Center Buttons */}
            <TouchableOpacity
                onPress={() => navigation.navigate('PlayGame', { gametype: 'PRACTICE' })}
                style={[
                    styles.newButton1,
                    { backgroundColor: theme.primary || '#FB923C' },
                ]}>
                <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
                <Text style={styles.newText}>PRACTICE</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('PlayGame', { gametype: 'PLAY' })}
                style={[
                    styles.newButton,
                    { backgroundColor: theme.primary || '#FB923C' },
                ]}>
                <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
                <Text style={styles.newText}>PLAY</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.safeArea}>
            {/* Badge popup sits above everything */}
            {showBadgePopup && pendingBadges.length > 0 && (
                <BadgePopup
                    badges={pendingBadges}
                    onFinish={() => {
                        setShowBadgePopup(false);
                        setPendingBadges([]);
                    }}
                />
            )}

            {theme.backgroundGradient ? (
                <LinearGradient colors={theme.backgroundGradient} style={styles.container}>
                    <Content />
                </LinearGradient>
            ) : (
                <View
                    style={[
                        styles.container,
                        { backgroundColor: theme.backgroundColor || '#0B1220' },
                    ]}>
                    <Content />
                </View>
            )}
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    contentContainer: {
        flex: 1,
        paddingHorizontal: wp('4%'),
    },
    iconGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: hp('12%'),
        gap: "70%",
    },
    gridIcon: {
        width: wp('8%'),
        height: wp('8%'),
        resizeMode: 'contain',
        marginBottom: hp('1.5%'),
    },
    newButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('12%'),
        marginTop: hp('2%'),
        width: wp('70%'),
        height: hp('7%'),
        borderRadius: wp('5.3%'),
        justifyContent: 'center',
    },
    newButton1: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('12%'),
        marginTop: hp('30%'),
        width: wp('70%'),
        height: hp('7%'),
        borderRadius: wp('5.3%'),
        justifyContent: 'center',
    },
    ticketIcon: {
        width: wp('7%'),
        height: wp('7%'),
        resizeMode: 'contain',
        marginRight: wp('3%'),
    },
    newText: {
        fontSize: normalizeFont(18),
        color: '#fff',
        fontWeight: '700',
    },
});