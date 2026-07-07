

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   SafeAreaView,
//   BackHandler,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Icon6 from 'react-native-vector-icons/FontAwesome6';
// import AuthHeader from '../components/AuthHeader';
// import { wp, normalizeFont } from '../utils/Responsive';
// import { useSocket } from '../context/Socket';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { useAppTranslation } from '../context/TranslationContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useBadge } from '../context/BadgeContext';

// const { width } = Dimensions.get('window');

// const BASE_URL = 'http://13.203.232.239:3000';
// const WEB_CLIENT_ID = '899856448839-j630i19f4dg05blt9jd8f6co2ambcpf5.apps.googleusercontent.com';

// export default function Login() {
//   const insets = useSafeAreaInsets();
//   const passwordInputRef = useRef(null);
//   const navigation = useNavigation();
//   const { login } = React.useContext(require('../context/AuthProvider').AuthContext);
//   const socket = useSocket();
//   const { t } = useAppTranslation();

//   const { reinitSocket, checkNewUserBadges } = useBadge();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [loginError, setLoginError] = useState('');

//   // ─── Configure Google Sign-In ─────────────────────────────────────────────
//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: WEB_CLIENT_ID,
//       offlineAccess: true,
//       forceCodeForRefreshToken: true,
//     });
//   }, []);

//   // ─── Block hardware back on login screen ──────────────────────────────────
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => true,
//     );
//     return () => backHandler.remove();
//   }, []);

//   // ─── Helpers ──────────────────────────────────────────────────────────────
//   const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   const registerSocket = (player) => {
//     if (socket?.connected) {
//       socket.emit('register-player', {

//         userId: player._id || player.id,
//         username: player.username,
//         email: player.email,
//         rating: player?.pr?.pvp?.medium || 1000,
//         diff: player.preferences?.defaultDifficulty || 'easy',
//         timer: player.preferences?.defaultTimer || 60,
//         symbol: player.preferences?.defaultSymbol || ['sum', 'difference'],
//       }
    
//     );
//                   console.log("registering socket for player:", player);

//     }
//   };

//   // ─── Forgot Password ──────────────────────────────────────────────────────
//   const handleForgotPassword = async () => {
//     if (!email.trim()) {
//       setEmailError(t('This field is required'));
//       return;
//     }
//     if (!validateEmail(email.trim())) {
//       setEmailError(t('Please enter a valid email'));
//       return;
//     }
//     setEmailError('');

//     try {
//       const response = await fetch(`${BASE_URL}/api/auth/sendForgotPassOtp`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });
//       const result = await response.json();

//       if (response.ok) {
//         Toast.show({
//           type: 'success',
//           text1: t('OTP Sent'),
//           text2: `${t('OTP sent to')} ${email}`,
//         });
//         navigation.navigate('ForgetPassword', { email });
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: t('Failed'),
//           text2: result.message || t('Something went wrong. Please try again.'),
//         });
//       }
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: t('Network Error'),
//         text2: t('Please try again later.'),
//       });
//     }
//   };

//   // ─── Google Login ─────────────────────────────────────────────────────────
//   const handleGoogleLogin = async () => {
//     try {
//       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

//       const signInResult = await GoogleSignin.signIn();

//       const idToken = signInResult?.data?.idToken;
//       const userData = signInResult?.data?.user;

//       console.log('🔵 Full signInResult:', JSON.stringify(signInResult, null, 2));
//       console.log('🟢 idToken:', idToken);
//       console.log('🟡 userData:', JSON.stringify(userData, null, 2));

//       if (!idToken) {
//         console.log('🔴 idToken is missing or null');
//         Alert.alert(t('Error'), t('Failed to get Google token. Please try again.'));
//         return;
//       }

//       if (!userData) {
//         console.log('🔴 userData is missing or null');
//         Alert.alert(t('Error'), t('Failed to get user info. Please try again.'));
//         return;
//       }

//       const requestBody = { authProvider: 'google', id_token: idToken };
//       console.log('📤 Sending to backend:', JSON.stringify(requestBody, null, 2));

//       const response = await fetch(`${BASE_URL}/api/auth/google-login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestBody),
//       });

//       const data = await response.json();
//       console.log('📥 Backend status:', response.status);
//       console.log('📥 Backend response:', JSON.stringify(data, null, 2));

//       if (response.ok) {
//         // ✅ NEW: read accessToken + refreshToken instead of old token field
//         const { accessToken, refreshToken, player, user } = data;
//         const loggedInPlayer = player || user;

//         if (!accessToken || !loggedInPlayer) {
//           console.log('🔴 Missing accessToken or player:', data);
//           Alert.alert(t('Error'), t('Login response is incomplete. Please try again.'));
//           return;
//         }

//         console.log('✅ Google login success');

//         // ✅ Save both tokens
//         await AsyncStorage.setItem('accessToken', accessToken);
//         await AsyncStorage.setItem('refreshToken', refreshToken);

//         // 1. Save auth data + register game socket
//         await login(accessToken, loggedInPlayer, data);
//         registerSocket(loggedInPlayer);

//         // 2. Init badge socket
//         await reinitSocket();
//         console.log('🏅 Badge socket reinitiated after Google login');

//         // 3. Navigate to WelcomeScreen
//         navigation.navigate('WelcomeScreen');

//         // 4. REST safety net: wait 2s for the socket badge:earned event to arrive first.
//         //    If it already fired, shownBadgeKeysRef deduplicates so nothing is shown twice.
//         //    If it hasn't fired (e.g. slow connection), this REST call catches any badges.
//         setTimeout(async () => {
//           console.log('[Login] 🔍 Post-Google-login badge REST check...');
//           try {
//             await checkNewUserBadges();
//             console.log('[Login] ✅ Post-Google-login badge check done');
//           } catch (err) {
//             console.error('[Login] ❌ Post-Google-login badge check failed:', err);
//           }
//         }, 2000);
//       }
//     } catch (error) {
//       console.log('🔴 Google Login Error code:', error?.code);
//       console.log('🔴 Google Login Error message:', error?.message);

//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         console.log('⚪ User cancelled sign-in');
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         Alert.alert(t('Please wait'), t('Sign-in is already in progress.'));
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         Alert.alert(t('Error'), t('Google Play Services not available.'));
//       } else {
//         Alert.alert(t('Error'), t('Google login failed. Please try again.'));
//       }
//     }
//   };

//   // ─── Facebook Login ───────────────────────────────────────────────────────
//   const handleFacebookLogin = async () => {
//     try {
//       Alert.alert(
//         t('Coming Soon'),
//         t('Facebook login integration is coming soon. Please use Email or Google login.'),
//       );
//     } catch (error) {
//       console.error('[Facebook Login] Error:', error?.message);
//       Alert.alert(t('Error'), t('Facebook login failed. Please try again.'));
//     }
//   };

//   // ─── Email / Password Login ───────────────────────────────────────────────
//   const handleLogin = async () => {
//     let valid = true;

//     if (!email.trim()) {
//       setEmailError(t('This field is required'));
//       valid = false;
//     } else if (!validateEmail(email)) {
//       setEmailError(t('Please enter a valid email'));
//       valid = false;
//     } else {
//       setEmailError('');
//     }

//     if (!password.trim()) {
//       setPasswordError(t('This field is required'));
//       valid = false;
//     } else {
//       setPasswordError('');
//     }

//     if (!valid) return;

//     try {
//       const response = await fetch(`${BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // ✅ NEW: read accessToken + refreshToken instead of old token field
//         const { accessToken, refreshToken, player: user } = data;

//         if (accessToken && user) {
//           console.log('✅ Email login success');

//           // ✅ Save both tokens
//           await AsyncStorage.setItem('accessToken', accessToken);
//           await AsyncStorage.setItem('refreshToken', refreshToken);

//           // 1. Save auth data + register game socket
//           await login(accessToken, user, data);
//           registerSocket(user);

//           // 2. Init badge socket
//           await reinitSocket();
//           console.log('🏅 Badge socket reinitiated after Email login');

//           // 3. Navigate to WelcomeScreen
//           navigation.navigate('WelcomeScreen');

//           // 4. REST safety net: wait 2s for the socket badge:earned event to arrive first.
//           //    If it already fired, shownBadgeKeysRef deduplicates so nothing is shown twice.
//           //    If it hasn't fired (e.g. slow connection), this REST call catches any badges.
//           setTimeout(async () => {
//             console.log('[Login] 🔍 Post-email-login badge REST check...');
//             try {
//               await checkNewUserBadges();
//               console.log('[Login] ✅ Post-email-login badge check done');
//             } catch (err) {
//               console.error('[Login] ❌ Post-email-login badge check failed:', err);
//             }
//           }, 2000);
//         } else {
//           Alert.alert(t('Login Failed'), t('Token or user data not received'));
//         }
//       } else {
//         const msg = data?.message?.toLowerCase() || '';
//         if (response.status === 404 || msg.includes('email') || msg.includes('user')) {
//           setLoginError(t('Your email is wrong'));
//         } else if (response.status === 401 || msg.includes('password')) {
//           setLoginError(t('Your password is wrong'));
//         } else {
//           setLoginError(data?.message || t('ID / Password is Incorrect'));
//         }
//       }
//     } catch (error) {
//       Alert.alert(t('Error'), t('Something went wrong. Please try again.'));
//     }
//   };

//   // ─── UI ───────────────────────────────────────────────────────────────────
//   return (
//     <SafeAreaView style={[styles.container, { paddingTop: insets.top + 30 }]}>
//       <LinearGradient colors={['#0f162b', '#0f162b']} style={styles.formContainer}>

//         <AuthHeader title={t('Sign - In')} />

//         {loginError !== '' && (
//           <View style={styles.loginErrorBox}>
//             <Text style={styles.loginErrorText}>{loginError}</Text>
//           </View>
//         )}

//         <Toast />

//         {/* Email */}
//         <View style={[styles.inputContainer, emailError ? styles.errorBorder : null]}>
//           <MaterialIcons name="email" size={normalizeFont(20)} color="#94A3B8" style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder={t('Enter your Email')}
//             placeholderTextColor="#94A3B8"
//             value={email}
//             returnKeyType="next"
//             onSubmitEditing={() => passwordInputRef.current?.focus()}
//             onChangeText={(text) => { setEmail(text); setEmailError(''); }}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//         </View>
//         {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

//         {/* Password */}
//         <View style={[styles.inputContainer, passwordError ? styles.errorBorder : null]}>
//           <MaterialIcons name="lock" size={normalizeFont(20)} color="#94A3B8" style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             ref={passwordInputRef}
//             placeholder={t('Enter your Password')}
//             placeholderTextColor="#94A3B8"
//             value={password}
//             onChangeText={(text) => { setPassword(text); setPasswordError(''); }}
//             secureTextEntry={!showPassword}
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <MaterialIcons
//               name={showPassword ? 'visibility' : 'visibility-off'}
//               size={normalizeFont(20)}
//               color="#94A3B8"
//             />
//           </TouchableOpacity>
//         </View>
//         {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

//         {/* Forgot Password */}
//         <TouchableOpacity onPress={handleForgotPassword} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//           <Text style={styles.forgotPassword}>{t('Forgot Password')}</Text>
//         </TouchableOpacity>

//         {/* Sign In Button */}
//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           <Text style={styles.loginButtonText}>{t('Sign - In')}</Text>
//         </TouchableOpacity>

//         {/* Divider */}
//         <View style={styles.dividerContainer}>
//           <View style={styles.divider} />
//           <Text style={styles.dividerText}>{t('or continue with')}</Text>
//           <View style={styles.divider} />
//         </View>

//         {/* Social Buttons */}
//         <View style={styles.socialContainer}>
//           <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
//             <Icon6 name="google" size={normalizeFont(20)} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', t('Twitter login coming soon'))}>
//             <Icon6 name="x-twitter" size={normalizeFont(20)} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
//             <Icon6 name="facebook" size={normalizeFont(20)} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Register Link */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate('SignUp')}
//           activeOpacity={0.7}
//           hitSlop={{ top: 0, bottom: 10, left: 10, right: 10 }}>
//           <Text style={styles.registerText}>
//             {t('Not a member?')}{' '}
//             <Text style={styles.registerLink}>{t('Register now')}</Text>
//           </Text>
//         </TouchableOpacity>

//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', backgroundColor: '#0f162b' },
//   formContainer: { width: width > 500 ? 500 : wp('90%'), padding: normalizeFont(20) },
//   inputContainer: {
//     flexDirection: 'row', alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 10, marginBottom: normalizeFont(10),
//     paddingHorizontal: normalizeFont(15),
//   },
//   inputIcon: { marginRight: normalizeFont(10) },
//   input: { flex: 1, height: normalizeFont(43), color: 'white', fontSize: normalizeFont(16), paddingRight: normalizeFont(10) },
//   errorText: { color: 'red', fontSize: normalizeFont(12), marginTop: -normalizeFont(8), marginBottom: normalizeFont(10), marginLeft: normalizeFont(5) },
//   errorBorder: { borderWidth: 1, borderColor: 'red' },
//   forgotPassword: { color: '#94A3B8', textAlign: 'right', marginBottom: normalizeFont(20), fontSize: normalizeFont(14) },
//   loginButton: { backgroundColor: '#FB923C', borderRadius: 50, height: normalizeFont(50), justifyContent: 'center', alignItems: 'center', marginBottom: normalizeFont(20) },
//   loginButtonText: { color: 'white', fontSize: normalizeFont(18), fontWeight: 'bold' },
//   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: normalizeFont(20) },
//   divider: { flex: 1, height: 1, backgroundColor: '#FFF' },
//   dividerText: { color: '#94A3B8', paddingHorizontal: normalizeFont(10), fontSize: normalizeFont(14) },
//   socialContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: normalizeFont(10) },
//   socialButton: {
//     width: normalizeFont(40), height: normalizeFont(40), borderRadius: normalizeFont(20),
//     backgroundColor: '#17677F', justifyContent: 'center', alignItems: 'center', marginHorizontal: wp('2%'),
//   },
//   registerText: { marginTop: normalizeFont(30), color: '#94A3B8', textAlign: 'center', fontSize: normalizeFont(14) },
//   registerLink: { color: '#ff8c00' },
//   loginErrorBox: { width: '100%', paddingVertical: normalizeFont(6), paddingHorizontal: normalizeFont(10), marginBottom: normalizeFont(15), borderRadius: 5 },
//   loginErrorText: { color: 'red', fontSize: normalizeFont(14), fontStyle: 'italic' },
// });



import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon6 from 'react-native-vector-icons/FontAwesome6';
import AuthHeader from '../components/AuthHeader';
import { wp, normalizeFont } from '../utils/Responsive';
import { useSocket } from '../context/Socket';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAppTranslation } from '../context/TranslationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBadge } from '../context/BadgeContext';

const { width } = Dimensions.get('window');

const BASE_URL = 'http://13.203.232.239:3000';
const WEB_CLIENT_ID = '899856448839-j630i19f4dg05blt9jd8f6co2ambcpf5.apps.googleusercontent.com';

export default function Login() {
  const insets = useSafeAreaInsets();
  const passwordInputRef = useRef(null);
  const navigation = useNavigation();
  const { login } = React.useContext(require('../context/AuthProvider').AuthContext);
  const socket = useSocket();
  const { t } = useAppTranslation();

  const { reinitSocket } = useBadge();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  // ─── Configure Google Sign-In ─────────────────────────────────────────────
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  // ─── Block hardware back on login screen ──────────────────────────────────
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const registerSocket = (player) => {
    if (socket?.connected) {
      socket.emit('register-player', {

        userId: player._id || player.id,
        username: player.username,
        email: player.email,
        rating: player?.pr?.pvp?.medium || 1000,
        diff: player.preferences?.defaultDifficulty || 'easy',
        timer: player.preferences?.defaultTimer || 60,
        symbol: player.preferences?.defaultSymbol || ['sum', 'difference'],
      }
    
    );
                  console.log("registering socket for player:", player);

    }
  };

  // ─── Forgot Password ──────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setEmailError(t('This field is required'));
      return;
    }
    if (!validateEmail(email.trim())) {
      setEmailError(t('Please enter a valid email'));
      return;
    }
    setEmailError('');

    try {
      const response = await fetch(`${BASE_URL}/api/auth/sendForgotPassOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: t('OTP Sent'),
          text2: `${t('OTP sent to')} ${email}`,
        });
        navigation.navigate('ForgetPassword', { email });
      } else {
        Toast.show({
          type: 'error',
          text1: t('Failed'),
          text2: result.message || t('Something went wrong. Please try again.'),
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('Network Error'),
        text2: t('Please try again later.'),
      });
    }
  };

  // ─── Google Login ─────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult?.data?.idToken;
      const userData = signInResult?.data?.user;

      console.log('🔵 Full signInResult:', JSON.stringify(signInResult, null, 2));
      console.log('🟢 idToken:', idToken);
      console.log('🟡 userData:', JSON.stringify(userData, null, 2));

      if (!idToken) {
        console.log('🔴 idToken is missing or null');
        Alert.alert(t('Error'), t('Failed to get Google token. Please try again.'));
        return;
      }

      if (!userData) {
        console.log('🔴 userData is missing or null');
        Alert.alert(t('Error'), t('Failed to get user info. Please try again.'));
        return;
      }

      const requestBody = { authProvider: 'google', id_token: idToken };
      console.log('📤 Sending to backend:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${BASE_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('📥 Backend status:', response.status);
      console.log('📥 Backend response:', JSON.stringify(data, null, 2));

      if (response.ok) {
        // ✅ NEW: read accessToken + refreshToken instead of old token field
        const { accessToken, refreshToken, player, user } = data;
        const loggedInPlayer = player || user;

        if (!accessToken || !loggedInPlayer) {
          console.log('🔴 Missing accessToken or player:', data);
          Alert.alert(t('Error'), t('Login response is incomplete. Please try again.'));
          return;
        }

        console.log('✅ Google login success');

        // ✅ Save both tokens
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        // 1. Save auth data + register game socket
        await login(accessToken, loggedInPlayer, data);
        registerSocket(loggedInPlayer);

        // 2. Init badge socket
        await reinitSocket();
        console.log('🏅 Badge socket reinitiated after Google login');

        // 3. Navigate to WelcomeScreen
        navigation.navigate('WelcomeScreen');
      }
    } catch (error) {
      console.log('🔴 Google Login Error code:', error?.code);
      console.log('🔴 Google Login Error message:', error?.message);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('⚪ User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert(t('Please wait'), t('Sign-in is already in progress.'));
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(t('Error'), t('Google Play Services not available.'));
      } else {
        Alert.alert(t('Error'), t('Google login failed. Please try again.'));
      }
    }
  };

  // ─── Facebook Login ───────────────────────────────────────────────────────
  const handleFacebookLogin = async () => {
    try {
      Alert.alert(
        t('Coming Soon'),
        t('Facebook login integration is coming soon. Please use Email or Google login.'),
      );
    } catch (error) {
      console.error('[Facebook Login] Error:', error?.message);
      Alert.alert(t('Error'), t('Facebook login failed. Please try again.'));
    }
  };

  // ─── Email / Password Login ───────────────────────────────────────────────
  const handleLogin = async () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError(t('This field is required'));
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t('Please enter a valid email'));
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError(t('This field is required'));
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ NEW: read accessToken + refreshToken instead of old token field
        const { accessToken, refreshToken, player: user } = data;

        if (accessToken && user) {
          console.log('✅ Email login success');

          // ✅ Save both tokens
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', refreshToken);

          // 1. Save auth data + register game socket
          await login(accessToken, user, data);
          registerSocket(user);

          // 2. Init badge socket
          await reinitSocket();
          console.log('🏅 Badge socket reinitiated after Email login');

          // 3. Navigate to WelcomeScreen
          navigation.navigate('WelcomeScreen');
        } else {
          Alert.alert(t('Login Failed'), t('Token or user data not received'));
        }
      } else {
        const msg = data?.message?.toLowerCase() || '';
        if (response.status === 404 || msg.includes('email') || msg.includes('user')) {
          setLoginError(t('Your email is wrong'));
        } else if (response.status === 401 || msg.includes('password')) {
          setLoginError(t('Your password is wrong'));
        } else {
          setLoginError(data?.message || t('ID / Password is Incorrect'));
        }
      }
    } catch (error) {
      Alert.alert(t('Error'), t('Something went wrong. Please try again.'));
    }
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 30 }]}>
      <LinearGradient colors={['#0f162b', '#0f162b']} style={styles.formContainer}>

        <AuthHeader title={t('Sign - In')} />

        {loginError !== '' && (
          <View style={styles.loginErrorBox}>
            <Text style={styles.loginErrorText}>{loginError}</Text>
          </View>
        )}

        <Toast />

        {/* Email */}
        <View style={[styles.inputContainer, emailError ? styles.errorBorder : null]}>
          <MaterialIcons name="email" size={normalizeFont(20)} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('Enter your Email')}
            placeholderTextColor="#94A3B8"
            value={email}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            onChangeText={(text) => { setEmail(text); setEmailError(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password */}
        <View style={[styles.inputContainer, passwordError ? styles.errorBorder : null]}>
          <MaterialIcons name="lock" size={normalizeFont(20)} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            ref={passwordInputRef}
            placeholder={t('Enter your Password')}
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={(text) => { setPassword(text); setPasswordError(''); }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={normalizeFont(20)}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.forgotPassword}>{t('Forgot Password')}</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>{t('Sign - In')}</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>{t('or continue with')}</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Icon6 name="google" size={normalizeFont(20)} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', t('Twitter login coming soon'))}>
            <Icon6 name="x-twitter" size={normalizeFont(20)} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <Icon6 name="facebook" size={normalizeFont(20)} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          activeOpacity={0.7}
          hitSlop={{ top: 0, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.registerText}>
            {t('Not a member?')}{' '}
            <Text style={styles.registerLink}>{t('Register now')}</Text>
          </Text>
        </TouchableOpacity>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#0f162b' },
  formContainer: { width: width > 500 ? 500 : wp('90%'), padding: normalizeFont(20) },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10, marginBottom: normalizeFont(10),
    paddingHorizontal: normalizeFont(15),
  },
  inputIcon: { marginRight: normalizeFont(10) },
  input: { flex: 1, height: normalizeFont(43), color: 'white', fontSize: normalizeFont(16), paddingRight: normalizeFont(10) },
  errorText: { color: 'red', fontSize: normalizeFont(12), marginTop: -normalizeFont(8), marginBottom: normalizeFont(10), marginLeft: normalizeFont(5) },
  errorBorder: { borderWidth: 1, borderColor: 'red' },
  forgotPassword: { color: '#94A3B8', textAlign: 'right', marginBottom: normalizeFont(20), fontSize: normalizeFont(14) },
  loginButton: { backgroundColor: '#FB923C', borderRadius: 50, height: normalizeFont(50), justifyContent: 'center', alignItems: 'center', marginBottom: normalizeFont(20) },
  loginButtonText: { color: 'white', fontSize: normalizeFont(18), fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: normalizeFont(20) },
  divider: { flex: 1, height: 1, backgroundColor: '#FFF' },
  dividerText: { color: '#94A3B8', paddingHorizontal: normalizeFont(10), fontSize: normalizeFont(14) },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: normalizeFont(10) },
  socialButton: {
    width: normalizeFont(40), height: normalizeFont(40), borderRadius: normalizeFont(20),
    backgroundColor: '#17677F', justifyContent: 'center', alignItems: 'center', marginHorizontal: wp('2%'),
  },
  registerText: { marginTop: normalizeFont(30), color: '#94A3B8', textAlign: 'center', fontSize: normalizeFont(14) },
  registerLink: { color: '#ff8c00' },
  loginErrorBox: { width: '100%', paddingVertical: normalizeFont(6), paddingHorizontal: normalizeFont(10), marginBottom: normalizeFont(15), borderRadius: 5 },
  loginErrorText: { color: 'red', fontSize: normalizeFont(14), fontStyle: 'italic' },
});