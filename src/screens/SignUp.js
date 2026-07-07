// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Image,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
//   FlatList,
//   Alert,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Toast from 'react-native-toast-message';
// import { useNavigation } from '@react-navigation/native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Icon6 from 'react-native-vector-icons/FontAwesome6';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import AuthHeader from '../components/AuthHeader';
// import { wp, hp, normalizeFont } from '../utils/Responsive';
// import { useAppTranslation } from '../context/TranslationContext';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { useSocket } from '../context/Socket';

// const { width, height } = Dimensions.get('window');

// const BASE_URL = 'http://13.203.232.239:3000';

// export default function SignUp() {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const { t } = useAppTranslation();
//   const socket = useSocket();
//   const { login } = React.useContext(require('../context/AuthProvider').AuthContext);

//   const [username, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [country, setCountry] = useState('');
//   const [countryFlag, setCountryFlag] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [gender, setGender] = useState('');
//   const [showGenderOptions, setShowGenderOptions] = useState(false);
//   const [showYearPicker, setShowYearPicker] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isTicked, setIsTicked] = useState(false);
//   const [tncError, setTncError] = useState(false);

//   // ─── Configure Google Sign-In ─────────────────────────────────────────────
//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: '899856448839-j630i19f4dg05blt9jd8f6co2ambcpf5.apps.googleusercontent.com',
//       offlineAccess: true,
//       forceCodeForRefreshToken: true,
//     });
//   }, []);

//   // ─── Socket Register ──────────────────────────────────────────────────────
//   const registerSocket = (player) => {
//     if (!player) return;
//     if (socket?.connected) {
//       socket.emit('register-player', {
//         userId: player._id || player.id,
//         username: player.username,
//         email: player.email,
//         rating: player?.pr?.pvp?.medium || 1000,
//         diff: player.preferences?.defaultDifficulty || 'easy',
//         timer: player.preferences?.defaultTimer || 60,
//         symbol: player.preferences?.defaultSymbol || ['sum', 'difference'],
//       });
//     }
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

//   const validateEmail = email => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   // ─── Google Sign-Up / Login ───────────────────────────────────────────────
//   const handleGoogleSignUp = async () => {
//     try {
//       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

//       const signInResult = await GoogleSignin.signIn();

//       const idToken = signInResult?.data?.idToken;
//       const userData = signInResult?.data?.user;

//       console.log('🔵 Full signInResult:', JSON.stringify(signInResult, null, 2));
//       console.log('🟢 idToken:', idToken);
//       console.log('🟡 userData:', JSON.stringify(userData, null, 2));

//       if (!idToken) {
//         Alert.alert(t('Error'), t('Failed to get Google token. Please try again.'));
//         return;
//       }

//       if (!userData) {
//         Alert.alert(t('Error'), t('Failed to get user info. Please try again.'));
//         return;
//       }

//       const requestBody = {
//         authProvider: 'google',
//         id_token: idToken,
//       };

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
//         const token = data.token;
//         const loggedInPlayer = data.player || data.user;

//         if (!token || !loggedInPlayer) {
//           console.log('🔴 Missing token or player in response:', data);
//           Alert.alert(t('Error'), t('Login response is incomplete. Please try again.'));
//           return;
//         }

//         console.log('✅ Google Sign-Up/Login success — player:', JSON.stringify(loggedInPlayer, null, 2));

//         await login(token, loggedInPlayer, { ...data, player: loggedInPlayer });
//         registerSocket(loggedInPlayer);
//         navigation.navigate('NotificationPermissionScreen');
//       } else {
//         Alert.alert(
//           t('Google Sign-Up Failed'),
//           data?.message || t('Something went wrong. Please try again.'),
//         );
//       }
//     } catch (error) {
//       console.log('🔴 Google Sign-Up Error code:', error?.code);
//       console.log('🔴 Google Sign-Up Error message:', error?.message);
//       console.log('🔴 Google Sign-Up Error full:', JSON.stringify(error, null, 2));

//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         console.log('⚪ User cancelled sign-in');
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         Alert.alert(t('Please wait'), t('Sign-in is already in progress.'));
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         Alert.alert(t('Error'), t('Google Play Services not available.'));
//       } else {
//         Alert.alert(t('Error'), t('Google sign-up failed. Please try again.'));
//       }
//     }
//   };

//   // ─── Email / Password Sign-Up ─────────────────────────────────────────────
//   const handleSignUp = async () => {
//     let tempErrors = {};

//     if (!isTicked) {
//       setTncError(true);
//       return;
//     } else {
//       setTncError(false);
//     }

//     if (!username.trim()) tempErrors.username = t('Username is required');
//     if (!email.trim()) tempErrors.email = t('Email is required');
//     else if (!validateEmail(email)) tempErrors.email = t('Invalid email format');
//     if (!password.trim()) tempErrors.password = t('Password is required');

//     if (Object.keys(tempErrors).length > 0) {
//       setErrors(tempErrors);
//       return;
//     }

//     setErrors({});

//     try {
//       const response = await fetch(`${BASE_URL}/api/auth/signup`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email,
//           username,
//           password,
//           country,
//           countryFlag,
//           dateOfBirth,
//           gender: gender || undefined,
//         }),
//       });

//       const data = await response.json();

//       if (response.status === 400 && data.message?.includes('OTP already sent')) {
//         Toast.show({
//           type: 'info',
//           text1: t('OTP Already Sent'),
//           text2: t('Redirecting to verification screen...'),
//         });
//         navigation.navigate('EmailVerification', {
//           userData: { username, email, password, country, countryFlag, dateOfBirth, gender },
//         });
//       }

//       console.log('Signup Response Data:', data);

//       if (!response.ok || data.success === false) {
//         handleApiErrors(data);
//         return;
//       }

//       Toast.show({
//         type: 'success',
//         text1: t('OTP Sent'),
//         text2: `${t('OTP Sent')} ${email}`,
//       });

//       navigation.navigate('EmailVerification', {
//         userData: { username, email, password, country, countryFlag, dateOfBirth, gender },
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: t('Network Error'),
//         text2: t('Please try again later.'),
//       });
//     }
//   };

//   const handleApiErrors = (data) => {
//     let fieldErrors = {};

//     if (data.message) {
//       const msg = data.message.toLowerCase();
//       if (msg.includes('username')) fieldErrors.username = data.message;
//       if (msg.includes('email')) fieldErrors.email = data.message;
//       if (msg.includes('password')) fieldErrors.password = data.message;
//     }

//     if (data.errors) {
//       Object.keys(data.errors).forEach(key => {
//         fieldErrors[key] = data.errors[key];
//       });
//     }

//     setErrors(fieldErrors);

//     if (Object.keys(fieldErrors).length === 0 && data.message) {
//       Toast.show({
//         type: 'error',
//         text1: t('Sign Up Failed'),
//         text2: data.message,
//       });
//     }
//   };

//   const genderOptions = [
//     { label: t('Male'), value: 'male' },
//     { label: t('Female'), value: 'female' },
//     { label: t('Others'), value: 'other' },
//   ];

//   const getGenderLabel = (value) => {
//     if (!value) return t('Select Gender');
//     const found = genderOptions.find(o => o.value === value);
//     return found ? found.label : value.charAt(0).toUpperCase() + value.slice(1);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={normalizeFont(20)}>
//       <LinearGradient colors={['#0f162b', '#0f162b']} style={styles.container}>
//         <ScrollView
//           contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 0 }]}
//           keyboardShouldPersistTaps="handled">

//           <View style={styles.formContainer}>
//             <AuthHeader title={t('Sign - Up')} />

//             <InputField
//               icon={require('../assets/gender.png')}
//               placeholder={t('Username *')}
//               value={username}
//               onChangeText={setUserName}
//               error={errors.username}
//             />

//             <InputField
//               icon={require('../assets/face.png')}
//               placeholder={t('Email *')}
//               value={email}
//               onChangeText={text => {
//                 setEmail(text);
//                 if (validateEmail(text) && errors.email) {
//                   setErrors(prev => ({ ...prev, email: undefined }));
//                 }
//               }}
//               keyboardType="email-address"
//               error={errors.email}
//             />

//             {/* Password field */}
//             <View style={[styles.inputContainer, errors.password && styles.errorBorder]}>
//               <MaterialIcons
//                 name="lock"
//                 size={normalizeFont(20)}
//                 color="#94A3B8"
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder={t('Enter your Password *')}
//                 placeholderTextColor="#94A3B8"
//                 value={password}
//                 onChangeText={text => {
//                   setPassword(text);
//                   if (text.length >= 6 && errors.password) {
//                     setErrors(prev => ({ ...prev, password: undefined }));
//                   }
//                 }}
//                 secureTextEntry={!showPassword}
//               />
//               <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                 <MaterialIcons
//                   name={showPassword ? 'visibility' : 'visibility-off'}
//                   size={normalizeFont(20)}
//                   color="#94A3B8"
//                 />
//               </TouchableOpacity>
//             </View>
//             {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

//             {/* Gender dropdown */}
//             <View style={[styles.dropdownContainer, errors.gender && styles.errorBorder]}>
//               <TouchableOpacity
//                 style={styles.dropdownButton}
//                 onPress={() => setShowGenderOptions(!showGenderOptions)}>
//                 <View style={styles.dropdownTextContainer}>
//                   <MaterialIcons
//                     name="person"
//                     size={normalizeFont(24)}
//                     color="#94A3B8"
//                     style={styles.genderIcon}
//                   />
//                   <Text style={[styles.input1, { color: gender ? 'white' : '#94A3B8' }]}>
//                     {getGenderLabel(gender)}
//                   </Text>
//                 </View>
//                 <MaterialIcons
//                   name={showGenderOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
//                   size={normalizeFont(24)}
//                   color="#94A3B8"
//                   style={styles.dropdownIcon}
//                 />
//               </TouchableOpacity>
//               {showGenderOptions && (
//                 <View style={styles.dropdownOptions}>
//                   {genderOptions.map(option => (
//                     <TouchableOpacity
//                       key={option.value}
//                       onPress={() => {
//                         setGender(option.value);
//                         setShowGenderOptions(false);
//                       }}>
//                       <Text style={styles.dropdownOptionText}>{option.label}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </View>

//             {/* Year of Birth */}
//             <View style={[styles.inputContainer, errors.dateOfBirth && styles.errorBorder]}>
//               <MaterialIcons
//                 name="calendar-month"
//                 size={normalizeFont(20)}
//                 color="#94A3B8"
//                 style={styles.inputIcon}
//               />
//               <TouchableOpacity
//                 style={{ flex: 1, justifyContent: 'center', height: normalizeFont(40) }}
//                 onPress={() => setShowYearPicker(true)}>
//                 <Text style={{ color: dateOfBirth ? 'white' : '#94A3B8', fontSize: normalizeFont(16) }}>
//                   {dateOfBirth || t('Year of Birth')}
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* T&C checkbox */}
//             <View style={styles.tickContainer}>
//               <TouchableOpacity onPress={() => setIsTicked(!isTicked)} activeOpacity={0.8}>
//                 <Text style={[
//                   styles.tickBox,
//                   isTicked && styles.tickChecked,
//                   tncError && !isTicked && styles.errorBorder,
//                 ]}>
//                   {isTicked ? '✔' : ''}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('TermsAndConditions')}>
//                 <Text style={styles.tncText}>{t('Please Read T&C')}</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
//               <Text style={styles.loginButtonText}>{t('Sign - Up')}</Text>
//             </TouchableOpacity>

//             <Toast />

//             {/* Divider */}
//             <View style={styles.dividerContainer}>
//               <View style={styles.divider} />
//               <Text style={styles.dividerText}>{t('or continue with')}</Text>
//               <View style={styles.divider} />
//             </View>

//             {/* Social buttons — Google now wired up */}
//             <View style={styles.socialContainer}>
//               <TouchableOpacity
//                 style={styles.socialButton}
//                 onPress={handleGoogleSignUp}>
//                 <Icon6 name="google" size={normalizeFont(20)} color="#fff" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.socialButton}
//                 onPress={() => Alert.alert('Info', t('Twitter login coming soon'))}>
//                 <Icon6 name="x-twitter" size={normalizeFont(20)} color="#fff" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.socialButton}
//                 onPress={() => Alert.alert('Info', t('Facebook login coming soon'))}>
//                 <Icon6 name="facebook" size={normalizeFont(20)} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//               <Text style={styles.registerText}>
//                 {t('Already a member?')}{' '}
//                 <Text style={styles.registerLink}>{t('Sign - In')}</Text>
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         {/* Year Picker Modal */}
//         <Modal
//           visible={showYearPicker}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setShowYearPicker(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.modalContentGradient}>
//                 <View style={styles.titleContainer}>
//                   <Text style={styles.modalTitle}>{t('Select Year')}</Text>
//                   <TouchableOpacity
//                     style={styles.headerCloseIcon}
//                     onPress={() => setShowYearPicker(false)}>
//                     <Icon name="close" size={24} color="#94A3B8" />
//                   </TouchableOpacity>
//                 </View>
//                 <FlatList
//                   data={years}
//                   keyExtractor={(item) => item}
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={{ paddingVertical: 10 }}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       style={[
//                         styles.modalOption,
//                         dateOfBirth === item && styles.modalOptionSelected,
//                       ]}
//                       onPress={() => {
//                         setDateOfBirth(item);
//                         setShowYearPicker(false);
//                       }}>
//                       <Text style={[
//                         styles.modalOptionText,
//                         dateOfBirth === item && styles.modalOptionTextSelected,
//                       ]}>
//                         {item}
//                       </Text>
//                       {dateOfBirth === item && (
//                         <LinearGradient
//                           colors={['#FB923C', '#F97316']}
//                           style={styles.checkIconContainer}>
//                           <Icon name="checkmark" size={12} color="#fff" />
//                         </LinearGradient>
//                       )}
//                     </TouchableOpacity>
//                   )}
//                 />
//               </LinearGradient>
//             </View>
//           </View>
//         </Modal>
//       </LinearGradient>
//     </KeyboardAvoidingView>
//   );
// }

// // ─── Input Field Component ────────────────────────────────────────────────────
// const InputField = ({ icon, error, ...props }) => (
//   <>
//     <View style={[styles.inputContainer, error && styles.errorBorder]}>
//       <Image style={styles.inputIcon} source={icon} />
//       <TextInput style={styles.input} placeholderTextColor="#94A3B8" {...props} />
//     </View>
//     {error && <Text style={styles.errorText}>{error}</Text>}
//   </>
// );

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     top: normalizeFont(-20),
//     left: normalizeFont(0),
//   },
//   tickContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: normalizeFont(20),
//     marginBottom: normalizeFont(10),
//     marginEnd: 'auto',
//     start: 10,
//   },
//   tickBox: {
//     borderWidth: 1,
//     borderColor: '#8e8e8e',
//     width: normalizeFont(35),
//     height: normalizeFont(25),
//     marginRight: 20,
//     textAlign: 'center',
//     color: '#fff',
//     borderRadius: 4,
//   },
//   tickChecked: { backgroundColor: '#fff', color: 'black' },
//   tncText: { color: '#fff', fontSize: normalizeFont(12) },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingBottom: normalizeFont(50),
//     paddingTop: normalizeFont(50),
//   },
//   formContainer: {
//     width: width > 500 ? 500 : width * 0.9,
//     alignSelf: 'center',
//     padding: normalizeFont(20),
//   },
//   title: {
//     fontSize: normalizeFont(32),
//     fontWeight: '600',
//     color: 'white',
//     marginBottom: normalizeFont(70),
//     textAlign: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 10,
//     marginBottom: normalizeFont(10),
//     paddingHorizontal: normalizeFont(15),
//   },
//   inputIcon: {
//     marginRight: normalizeFont(10),
//     height: normalizeFont(20),
//     width: normalizeFont(20),
//   },
//   input: {
//     flex: 1,
//     height: normalizeFont(40),
//     color: 'white',
//     fontSize: normalizeFont(16),
//   },
//   loginButton: {
//     backgroundColor: '#FB923C',
//     borderRadius: 50,
//     height: normalizeFont(45),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: normalizeFont(20),
//     marginTop: normalizeFont(20),
//   },
//   loginButtonText: {
//     color: 'white',
//     fontSize: normalizeFont(16),
//     fontWeight: 'bold',
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: normalizeFont(10),
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#FFF',
//   },
//   dividerText: {
//     color: '#94A3B8',
//     paddingHorizontal: normalizeFont(10),
//     fontSize: normalizeFont(14),
//   },
//   socialContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   socialButton: {
//     width: normalizeFont(40),
//     height: normalizeFont(40),
//     borderRadius: normalizeFont(20),
//     backgroundColor: '#17677F',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: width * 0.02,
//   },
//   registerText: {
//     marginTop: normalizeFont(15),
//     color: '#94A3B8',
//     textAlign: 'center',
//     fontSize: normalizeFont(14),
//   },
//   registerLink: {
//     color: '#ff8c00',
//     fontSize: normalizeFont(16),
//   },
//   dropdownContainer: {
//     marginBottom: normalizeFont(10),
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 10,
//   },
//   dropdownButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: normalizeFont(12),
//     paddingHorizontal: normalizeFont(15),
//     alignItems: 'center',
//   },
//   dropdownTextContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   genderIcon: {
//     marginRight: normalizeFont(10),
//   },
//   input1: {
//     color: '#94A3B8',
//     fontSize: normalizeFont(16),
//   },
//   dropdownIcon: {
//     marginTop: normalizeFont(3),
//   },
//   dropdownOptions: {
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 10,
//   },
//   dropdownOptionText: {
//     paddingVertical: normalizeFont(12),
//     paddingHorizontal: normalizeFont(15),
//     color: 'white',
//     fontSize: normalizeFont(16),
//   },
//   errorBorder: {
//     borderWidth: 1,
//     borderColor: 'red',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: normalizeFont(12),
//     marginBottom: normalizeFont(10),
//     marginLeft: normalizeFont(5),
//     alignSelf: 'flex-end',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '85%',
//     height: '60%',
//     borderRadius: 24,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   modalContentGradient: {
//     flex: 1,
//     padding: 0,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.08)',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#fff',
//     letterSpacing: 0.5,
//   },
//   headerCloseIcon: {
//     position: 'absolute',
//     right: 20,
//     padding: 5,
//   },
//   modalOption: {
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 10,
//     marginVertical: 4,
//     borderRadius: 12,
//   },
//   modalOptionSelected: {
//     backgroundColor: 'rgba(251, 146, 60, 0.15)',
//     borderWidth: 1,
//     borderColor: 'rgba(251, 146, 60, 0.3)',
//   },
//   modalOptionText: {
//     fontSize: 16,
//     color: '#94A3B8',
//     fontWeight: '500',
//   },
//   modalOptionTextSelected: {
//     color: '#FB923C',
//     fontWeight: '700',
//     fontSize: 18,
//   },
//   checkIconContainer: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });



import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon6 from 'react-native-vector-icons/FontAwesome6';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthHeader from '../components/AuthHeader';
import { wp, hp, normalizeFont } from '../utils/Responsive';
import { useAppTranslation } from '../context/TranslationContext';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useSocket } from '../context/Socket';

const { width, height } = Dimensions.get('window');

const BASE_URL = 'http://13.203.232.239:3000';

export default function SignUp() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const socket = useSocket();
  const { login } = React.useContext(require('../context/AuthProvider').AuthContext);

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [countryFlag, setCountryFlag] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState('');
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [isTicked, setIsTicked] = useState(false);
  const [tncError, setTncError] = useState(false);

  // ─── Configure Google Sign-In ─────────────────────────────────────────────
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '899856448839-j630i19f4dg05blt9jd8f6co2ambcpf5.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  // ─── Socket Register ──────────────────────────────────────────────────────
  const registerSocket = (player) => {
    if (!player) return;
    if (socket?.connected) {
      socket.emit('register-player', {
        userId: player._id || player.id,
        username: player.username,
        email: player.email,
        rating: player?.pr?.pvp?.medium || 1000,
        diff: player.preferences?.defaultDifficulty || 'easy',
        timer: player.preferences?.defaultTimer || 60,
        symbol: player.preferences?.defaultSymbol || ['sum', 'difference'],
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ─── Google Sign-Up / Login ───────────────────────────────────────────────
  const handleGoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult?.data?.idToken;
      const userData = signInResult?.data?.user;

      console.log('🔵 Full signInResult:', JSON.stringify(signInResult, null, 2));
      console.log('🟢 idToken:', idToken);
      console.log('🟡 userData:', JSON.stringify(userData, null, 2));

      if (!idToken) {
        Alert.alert(t('Error'), t('Failed to get Google token. Please try again.'));
        return;
      }

      if (!userData) {
        Alert.alert(t('Error'), t('Failed to get user info. Please try again.'));
        return;
      }

      const requestBody = {
        authProvider: 'google',
        id_token: idToken,
      };

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
          console.log('🔴 Missing accessToken or player in response:', data);
          Alert.alert(t('Error'), t('Login response is incomplete. Please try again.'));
          return;
        }

        console.log('✅ Google Sign-Up/Login success — player:', JSON.stringify(loggedInPlayer, null, 2));

        // ✅ Save both tokens
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        await login(accessToken, loggedInPlayer, { ...data, player: loggedInPlayer });
        registerSocket(loggedInPlayer);
        navigation.navigate('NotificationPermissionScreen');
      } else {
        Alert.alert(
          t('Google Sign-Up Failed'),
          data?.message || t('Something went wrong. Please try again.'),
        );
      }
    } catch (error) {
      console.log('🔴 Google Sign-Up Error code:', error?.code);
      console.log('🔴 Google Sign-Up Error message:', error?.message);
      console.log('🔴 Google Sign-Up Error full:', JSON.stringify(error, null, 2));

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('⚪ User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert(t('Please wait'), t('Sign-in is already in progress.'));
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(t('Error'), t('Google Play Services not available.'));
      } else {
        Alert.alert(t('Error'), t('Google sign-up failed. Please try again.'));
      }
    }
  };

  // ─── Email / Password Sign-Up ─────────────────────────────────────────────
  const handleSignUp = async () => {
    let tempErrors = {};

    if (!isTicked) {
      setTncError(true);
      return;
    } else {
      setTncError(false);
    }

    if (!username.trim()) tempErrors.username = t('Username is required');
    if (!email.trim()) tempErrors.email = t('Email is required');
    else if (!validateEmail(email)) tempErrors.email = t('Invalid email format');
    if (!password.trim()) tempErrors.password = t('Password is required');

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          password,
          country,
          countryFlag,
          dateOfBirth,
          gender: gender || undefined,
        }),
      });

      const data = await response.json();

      if (response.status === 400 && data.message?.includes('OTP already sent')) {
        Toast.show({
          type: 'info',
          text1: t('OTP Already Sent'),
          text2: t('Redirecting to verification screen...'),
        });
        navigation.navigate('EmailVerification', {
          userData: { username, email, password, country, countryFlag, dateOfBirth, gender },
        });
      }

      console.log('Signup Response Data:', data);

      if (!response.ok || data.success === false) {
        handleApiErrors(data);
        return;
      }

      Toast.show({
        type: 'success',
        text1: t('OTP Sent'),
        text2: `${t('OTP Sent')} ${email}`,
      });

      navigation.navigate('EmailVerification', {
        userData: { username, email, password, country, countryFlag, dateOfBirth, gender },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('Network Error'),
        text2: t('Please try again later.'),
      });
    }
  };

  const handleApiErrors = (data) => {
    let fieldErrors = {};

    if (data.message) {
      const msg = data.message.toLowerCase();
      if (msg.includes('username')) fieldErrors.username = data.message;
      if (msg.includes('email')) fieldErrors.email = data.message;
      if (msg.includes('password')) fieldErrors.password = data.message;
    }

    if (data.errors) {
      Object.keys(data.errors).forEach(key => {
        fieldErrors[key] = data.errors[key];
      });
    }

    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length === 0 && data.message) {
      Toast.show({
        type: 'error',
        text1: t('Sign Up Failed'),
        text2: data.message,
      });
    }
  };

  const genderOptions = [
    { label: t('Male'), value: 'male' },
    { label: t('Female'), value: 'female' },
    { label: t('Others'), value: 'other' },
  ];

  const getGenderLabel = (value) => {
    if (!value) return t('Select Gender');
    const found = genderOptions.find(o => o.value === value);
    return found ? found.label : value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={normalizeFont(20)}>
      <LinearGradient colors={['#0f162b', '#0f162b']} style={styles.container}>
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 0 }]}
          keyboardShouldPersistTaps="handled">

          <View style={styles.formContainer}>
            <AuthHeader title={t('Sign - Up')} />

            <InputField
              icon={require('../assets/gender.png')}
              placeholder={t('Username *')}
              value={username}
              onChangeText={setUserName}
              error={errors.username}
            />

            <InputField
              icon={require('../assets/face.png')}
              placeholder={t('Email *')}
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (validateEmail(text) && errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              keyboardType="email-address"
              error={errors.email}
            />

            {/* Password field */}
            <View style={[styles.inputContainer, errors.password && styles.errorBorder]}>
              <MaterialIcons
                name="lock"
                size={normalizeFont(20)}
                color="#94A3B8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={t('Enter your Password *')}
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (text.length >= 6 && errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
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
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Gender dropdown */}
            <View style={[styles.dropdownContainer, errors.gender && styles.errorBorder]}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowGenderOptions(!showGenderOptions)}>
                <View style={styles.dropdownTextContainer}>
                  <MaterialIcons
                    name="person"
                    size={normalizeFont(24)}
                    color="#94A3B8"
                    style={styles.genderIcon}
                  />
                  <Text style={[styles.input1, { color: gender ? 'white' : '#94A3B8' }]}>
                    {getGenderLabel(gender)}
                  </Text>
                </View>
                <MaterialIcons
                  name={showGenderOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={normalizeFont(24)}
                  color="#94A3B8"
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>
              {showGenderOptions && (
                <View style={styles.dropdownOptions}>
                  {genderOptions.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        setGender(option.value);
                        setShowGenderOptions(false);
                      }}>
                      <Text style={styles.dropdownOptionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Year of Birth */}
            <View style={[styles.inputContainer, errors.dateOfBirth && styles.errorBorder]}>
              <MaterialIcons
                name="calendar-month"
                size={normalizeFont(20)}
                color="#94A3B8"
                style={styles.inputIcon}
              />
              <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', height: normalizeFont(40) }}
                onPress={() => setShowYearPicker(true)}>
                <Text style={{ color: dateOfBirth ? 'white' : '#94A3B8', fontSize: normalizeFont(16) }}>
                  {dateOfBirth || t('Year of Birth')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* T&C checkbox */}
            <View style={styles.tickContainer}>
              <TouchableOpacity onPress={() => setIsTicked(!isTicked)} activeOpacity={0.8}>
                <Text style={[
                  styles.tickBox,
                  isTicked && styles.tickChecked,
                  tncError && !isTicked && styles.errorBorder,
                ]}>
                  {isTicked ? '✔' : ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('TermsAndConditions')}>
                <Text style={styles.tncText}>{t('Please Read T&C')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
              <Text style={styles.loginButtonText}>{t('Sign - Up')}</Text>
            </TouchableOpacity>

            <Toast />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>{t('or continue with')}</Text>
              <View style={styles.divider} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignUp}>
                <Icon6 name="google" size={normalizeFont(20)} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Alert.alert('Info', t('Twitter login coming soon'))}>
                <Icon6 name="x-twitter" size={normalizeFont(20)} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Alert.alert('Info', t('Facebook login coming soon'))}>
                <Icon6 name="facebook" size={normalizeFont(20)} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.registerText}>
                {t('Already a member?')}{' '}
                <Text style={styles.registerLink}>{t('Sign - In')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Year Picker Modal */}
        <Modal
          visible={showYearPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowYearPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.modalContentGradient}>
                <View style={styles.titleContainer}>
                  <Text style={styles.modalTitle}>{t('Select Year')}</Text>
                  <TouchableOpacity
                    style={styles.headerCloseIcon}
                    onPress={() => setShowYearPicker(false)}>
                    <Icon name="close" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={years}
                  keyExtractor={(item) => item}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 10 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        dateOfBirth === item && styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        setDateOfBirth(item);
                        setShowYearPicker(false);
                      }}>
                      <Text style={[
                        styles.modalOptionText,
                        dateOfBirth === item && styles.modalOptionTextSelected,
                      ]}>
                        {item}
                      </Text>
                      {dateOfBirth === item && (
                        <LinearGradient
                          colors={['#FB923C', '#F97316']}
                          style={styles.checkIconContainer}>
                          <Icon name="checkmark" size={12} color="#fff" />
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// ─── Input Field Component ────────────────────────────────────────────────────
const InputField = ({ icon, error, ...props }) => (
  <>
    <View style={[styles.inputContainer, error && styles.errorBorder]}>
      <Image style={styles.inputIcon} source={icon} />
      <TextInput style={styles.input} placeholderTextColor="#94A3B8" {...props} />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: normalizeFont(-20),
    left: normalizeFont(0),
  },
  tickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeFont(20),
    marginBottom: normalizeFont(10),
    marginEnd: 'auto',
    start: 10,
  },
  tickBox: {
    borderWidth: 1,
    borderColor: '#8e8e8e',
    width: normalizeFont(35),
    height: normalizeFont(25),
    marginRight: 20,
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4,
  },
  tickChecked: { backgroundColor: '#fff', color: 'black' },
  tncText: { color: '#fff', fontSize: normalizeFont(12) },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: normalizeFont(50),
    paddingTop: normalizeFont(50),
  },
  formContainer: {
    width: width > 500 ? 500 : width * 0.9,
    alignSelf: 'center',
    padding: normalizeFont(20),
  },
  title: {
    fontSize: normalizeFont(32),
    fontWeight: '600',
    color: 'white',
    marginBottom: normalizeFont(70),
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: normalizeFont(10),
    paddingHorizontal: normalizeFont(15),
  },
  inputIcon: {
    marginRight: normalizeFont(10),
    height: normalizeFont(20),
    width: normalizeFont(20),
  },
  input: {
    flex: 1,
    height: normalizeFont(40),
    color: 'white',
    fontSize: normalizeFont(16),
  },
  loginButton: {
    backgroundColor: '#FB923C',
    borderRadius: 50,
    height: normalizeFont(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalizeFont(20),
    marginTop: normalizeFont(20),
  },
  loginButtonText: {
    color: 'white',
    fontSize: normalizeFont(16),
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: normalizeFont(10),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFF',
  },
  dividerText: {
    color: '#94A3B8',
    paddingHorizontal: normalizeFont(10),
    fontSize: normalizeFont(14),
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: normalizeFont(40),
    height: normalizeFont(40),
    borderRadius: normalizeFont(20),
    backgroundColor: '#17677F',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.02,
  },
  registerText: {
    marginTop: normalizeFont(15),
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: normalizeFont(14),
  },
  registerLink: {
    color: '#ff8c00',
    fontSize: normalizeFont(16),
  },
  dropdownContainer: {
    marginBottom: normalizeFont(10),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalizeFont(12),
    paddingHorizontal: normalizeFont(15),
    alignItems: 'center',
  },
  dropdownTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderIcon: {
    marginRight: normalizeFont(10),
  },
  input1: {
    color: '#94A3B8',
    fontSize: normalizeFont(16),
  },
  dropdownIcon: {
    marginTop: normalizeFont(3),
  },
  dropdownOptions: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  dropdownOptionText: {
    paddingVertical: normalizeFont(12),
    paddingHorizontal: normalizeFont(15),
    color: 'white',
    fontSize: normalizeFont(16),
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: normalizeFont(12),
    marginBottom: normalizeFont(10),
    marginLeft: normalizeFont(5),
    alignSelf: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    height: '60%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContentGradient: {
    flex: 1,
    padding: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerCloseIcon: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 12,
  },
  modalOptionSelected: {
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.3)',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  modalOptionTextSelected: {
    color: '#FB923C',
    fontWeight: '700',
    fontSize: 18,
  },
  checkIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});