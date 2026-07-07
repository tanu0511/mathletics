// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Image,
//   ScrollView,
//   SafeAreaView,
//   ActivityIndicator,
//   Dimensions,
//   PixelRatio,
//   Modal,
//   Pressable,
//   Platform,
//   Alert,
//   FlatList,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
// import { useTheme } from '../context/ThemeContext';
// import ImagePicker from 'react-native-image-crop-picker';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { CountryList } from '../utils/CountryList';
// import CustomHeader from '../components/CustomHeader';

// const { width, height } = Dimensions.get('window');
// const scale = width / 375;
// const scaleFont = size => size * PixelRatio.getFontScale();
// const normalize = size =>
//   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// const UpdateProfile = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { theme } = useTheme();
//   const insets = useSafeAreaInsets(); // ✅ Hook

//   const onUpdate = route.params?.onUpdate;

//   // ... (skipping unchanged lines)

//   /* ================= STATE ================= */
//   const [loading, setLoading] = useState(false);

//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [gender, setGender] = useState('');
//   const [country, setCountry] = useState(''); // ✅ Country State
//   const [profileImage, setProfileImage] = useState(null);

//   const [showGenderOptions, setShowGenderOptions] = useState(false);
//   const [showCountryPicker, setShowCountryPicker] = useState(false); // ✅ Modal State
//   const [showYearPicker, setShowYearPicker] = useState(false); // ✅ Year Picker State

//   /* ================= FETCH USER ================= */
//   useEffect(() => {
//     const loadUser = async () => {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('accessToken');
//       console.log("ccccccccccccccccccccccccccccccc", token)

//       const res = await fetch('http://13.203.232.239:3000/api/auth/getUser', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await res.json();

//       if (result.success) {
//         const u = result.user;
//         setFirstName(u.firstName || '');
//         setLastName(u.lastName || '');
//         if (u.dateOfBirth) {
//           const d = new Date(u.dateOfBirth);
//           setDateOfBirth(!isNaN(d) ? d.getFullYear().toString() : u.dateOfBirth);
//         } else {
//           setDateOfBirth('');
//         }
//         setGender(u.gender || '');
//         setCountry(u.country || ''); // ✅ Load Country
//         setProfileImage(u.profileImage || null);
//       }
//       setLoading(false);
//     };

//     loadUser();
//   }, []);

//   // Generate years (Current year down to 100 years ago)
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

//   /* ================= IMAGE PICK ================= */
//   const openPicker = async type => {
//     try {
//       const img =
//         type === 'camera'
//           ? await ImagePicker.openCamera({
//             cropping: true,
//             width: 400,
//             height: 400,
//           })
//           : await ImagePicker.openPicker({
//             cropping: true,
//             width: 400,
//             height: 400,
//           });

//       setProfileImage(img.path);
//     } catch (e) {
//       if (e.code !== 'E_PICKER_CANCELLED') {
//         console.log(e);
//       }
//     }
//   };

//   /* ================= SAVE ================= */
//   const saveProfile = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('accessToken');

//       const formData = new FormData();
//       formData.append('firstName', firstName);
//       formData.append('lastName', lastName);
//       formData.append('dateOfBirth', dateOfBirth);
//       formData.append('gender', gender);
//       formData.append('country', country); // ✅ Send Country

//       if (profileImage && profileImage.startsWith('file')) {
//         const imageUri = Platform.OS === 'ios' ? profileImage.replace('file://', '') : profileImage;
//         formData.append('profileImage', {
//           uri: imageUri,
//           name: 'profile.jpg',
//           type: 'image/jpeg',
//         });
//       }

//       console.log('📤 Sending FormData Update:', JSON.stringify({
//         firstName: firstName,
//         lastName: lastName,
//         dob: dateOfBirth,
//         gender,
//         hasImage: !!(profileImage && profileImage.startsWith('file'))
//       }));

//       const res = await fetch('http://13.203.232.239:3000/api/auth/profile', {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//         body: formData,
//       });

//       console.log('📥 Profile API Status:', res.status);
//       const text = await res.text();
//       console.log('📥 Profile API Response:', text);

//       let result;
//       try {
//         result = JSON.parse(text);
//       } catch (e) {
//         Alert.alert('Server Error', 'Invalid response from server.\n' + text.substring(0, 100));
//         return;
//       }

//       if (res.ok && result.success) {
//         onUpdate?.(result.user);
//         Alert.alert(
//           'Success',
//           'Profile updated successfully',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 navigation.goBack();
//               },
//             },
//           ],
//           { cancelable: false },
//         );
//       } else {
//         Alert.alert('Update Failed', result.message || 'Server returned an error');
//       }
//     } catch (e) {
//       console.log('❌ Profile API Error:', e);
//       Alert.alert('Network Error', 'Something went wrong. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <View style={{ flex: 1 }}>
//       <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//         {/* Removed SafeAreaView wrapper to control padding manually with insets */}
//         <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
//           <CustomHeader
//             title="PROFILE"
//             onBack={() => navigation.goBack()}
//           />
//           <ScrollView showsVerticalScrollIndicator={false}>

//             {loading ? (
//               <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
//             ) : (
//               <View style={styles.form}>
//                 {/* 1. PROFILE IMAGE (Left Aligned + Text on Right) */}
//                 <View style={styles.profileRow}>
//                   <TouchableOpacity onPress={() => openPicker('gallery')}>
//                     <View>
//                       <Image
//                         source={
//                           profileImage
//                             ? { uri: profileImage }
//                             : require('../assets/dummyProfile.jpg')
//                         }
//                         style={styles.profileImg}
//                       />
//                       {/* Camera Icon Overlay */}
//                       <View style={styles.cameraIcon}>
//                         <Icon name="camera" size={16} color="#000" />
//                       </View>
//                     </View>
//                   </TouchableOpacity>

//                   {/* Text on the right */}
//                   <Text style={styles.uploadText}>Upload / Camera / Icons</Text>
//                 </View>


//                 {/* 2. FORM FIELDS (Label Left - Input Right) */}

//                 {/* First Name */}
//                 <View style={styles.fieldRow}>
//                   <Text style={styles.fieldLabel}>First Name:</Text>
//                   <TextInput
//                     style={styles.inlineInput}
//                     value={firstName}
//                     onChangeText={setFirstName}
//                     placeholderTextColor="#94A3B8"
//                   />
//                 </View>

//                 {/* Last Name */}
//                 <View style={styles.fieldRow}>
//                   <Text style={styles.fieldLabel}>Last Name:</Text>
//                   <TextInput
//                     style={styles.inlineInput}
//                     value={lastName}
//                     onChangeText={setLastName}
//                     placeholderTextColor="#94A3B8"
//                   />
//                 </View>

//                 {/* Year of Birth */}
//                 <View style={styles.fieldRow}>
//                   <Text style={styles.fieldLabel}>Year of Birth:</Text>
//                   <TouchableOpacity
//                     style={styles.inlineInput}
//                     onPress={() => setShowYearPicker(true)}
//                   >
//                     <Text style={{ color: dateOfBirth ? 'white' : '#94A3B8', fontSize: normalize(14), paddingVertical: 0 }}>
//                       {dateOfBirth || 'YYYY'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Gender */}
//                 <View style={[styles.fieldRow, { alignItems: 'flex-start' }]}>
//                   <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Gender:</Text>
//                   <View style={{ flex: 1 }}>
//                     <TouchableOpacity
//                       style={styles.dropdownButton}
//                       onPress={() => setShowGenderOptions(!showGenderOptions)}>
//                       <View style={styles.dropdownTextContainer}>
//                         {/* Removed icon to match "clean" text feel of reference, or keep if preferred. 
//                              User said "Only UI layout... match attached reference". 
//                              Reference usually has simple text. Keeping icon as per "Do NOT change... theme" but adjusting layout. 
//                           */}
//                         <Text
//                           style={[
//                             styles.input1,
//                             { color: gender ? 'white' : '#94A3B8' },
//                           ]}>
//                           {gender ? (gender === 'other' ? 'Others' : gender.charAt(0).toUpperCase() + gender.slice(1)) : 'Select Gender'}
//                         </Text>
//                       </View>
//                       <MaterialIcons
//                         name={showGenderOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
//                         size={normalize(20)}
//                         color="#94A3B8"
//                       />
//                     </TouchableOpacity>

//                     {showGenderOptions && (
//                       <View style={styles.dropdownOptions}>
//                         {[
//                           { label: 'Male', value: 'male' },
//                           { label: 'Female', value: 'female' },
//                           { label: 'Others', value: 'other' }
//                         ].map(option => (
//                           <TouchableOpacity
//                             key={option.value}
//                             onPress={() => {
//                               setGender(option.value);
//                               setShowGenderOptions(false);
//                             }}>
//                             <Text style={styles.dropdownOptionText}>{option.label}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </View>
//                     )}
//                   </View>
//                 </View>

//                 {/* Country */}
//                 <View style={[styles.fieldRow, { alignItems: 'flex-start' }]}>
//                   <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Country:</Text>
//                   <View style={{ flex: 1 }}>
//                     <TouchableOpacity
//                       style={styles.dropdownButton}
//                       onPress={() => setShowCountryPicker(true)}>
//                       <View style={styles.dropdownTextContainer}>
//                         <Text
//                           style={[
//                             styles.input1,
//                             {
//                               color: country ? 'white' : '#94A3B8',
//                               fontSize: country ? normalize(22) : normalize(14)
//                             },
//                           ]}>
//                           {country && CountryList.find(c => c.name === country)
//                             ? `${CountryList.find(c => c.name === country).flag}`
//                             : country || 'Select Country'}
//                         </Text>
//                       </View>
//                       <MaterialIcons
//                         name="keyboard-arrow-down"
//                         size={normalize(20)}
//                         color="#94A3B8"
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 {/* Country (Placeholder as per request "Country:" was in list, but no state/logic for it in original code? 
//                      Checking original code... 
//                      Original code has First Name, Last Name, DOB, Gender. 
//                      User requested "Country:" in requirements list. 
//                      "Do NOT change existing state or logic". 
//                      If I add Country input without state, it won't work. 
//                      I will omit Country or add a static/disabled one if strictly required visually. 
//                      Logic > Visual requirement here to avoid breaking functionality. 
//                      I will skip "Country" to avoid introducing broken UI without backing logic. 
//                   */}

//                 {/* 3. BUTTONS (Discard | Save) */}
//                 <View style={styles.buttonRow}>
//                   {/* Discard Button */}
//                   <TouchableOpacity
//                     style={styles.discardButton}
//                     onPress={() => navigation.goBack()}
//                   >
//                     <Text style={styles.discardText}>Discard</Text>
//                   </TouchableOpacity>

//                   {/* Save Button */}
//                   <LinearGradient
//                     colors={[theme.primary, theme.primary]} // Keep original logic
//                     style={styles.saveButtonGradient}
//                   >
//                     <TouchableOpacity onPress={saveProfile} style={{ width: '100%', alignItems: 'center' }}>
//                       <Text style={styles.saveText}>Save</Text>
//                     </TouchableOpacity>
//                   </LinearGradient>
//                 </View>

//               </View>
//             )}
//           </ScrollView>
//         </View>
//       </LinearGradient>

//       {/* COUNTRY PICKER MODAL */}
//       <Modal
//         visible={showCountryPicker}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowCountryPicker(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { height: '80%' }]}>
//             <View style={styles.titleContainer}>
//               <Text style={styles.modalTitle}>Select Country</Text>
//             </View>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               {CountryList.map((item, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.modalOption}
//                   onPress={() => {
//                     setCountry(item.name);
//                     setShowCountryPicker(false);
//                   }}>
//                   <Text style={{ fontSize: 24 }}>{item.flag}</Text>
//                   <Text
//                     style={[
//                       styles.modalOptionText,
//                       country === item.name && { color: '#4da6ff', fontWeight: 'bold' },
//                     ]}>
//                     {item.name}
//                   </Text>
//                   {country === item.name && (
//                     <Icon name="checkmark" size={18} color="#4da6ff" />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setShowCountryPicker(false)}>
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* YEAR PICKER MODAL */}
//       <Modal
//         visible={showYearPicker}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowYearPicker(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <LinearGradient
//               colors={['#1e293b', '#0f172a']} // Dark gradient background
//               style={styles.modalContentGradient}
//             >
//               <View style={styles.titleContainer}>
//                 <Text style={styles.modalTitle}>Select Year</Text>
//                 <TouchableOpacity
//                   style={styles.headerCloseIcon}
//                   onPress={() => setShowYearPicker(false)}
//                 >
//                   <Icon name="close" size={24} color="#94A3B8" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={years}
//                 keyExtractor={(item) => item}
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={{ paddingVertical: 10 }}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={[
//                       styles.modalOption,
//                       dateOfBirth === item && styles.modalOptionSelected
//                     ]}
//                     onPress={() => {
//                       setDateOfBirth(item);
//                       setShowYearPicker(false);
//                     }}>
//                     <Text
//                       style={[
//                         styles.modalOptionText,
//                         dateOfBirth === item && styles.modalOptionTextSelected,
//                       ]}>
//                       {item}
//                     </Text>
//                     {dateOfBirth === item && (
//                       <LinearGradient
//                         colors={['#4fa5c2', '#4fa5c2']} // Blue tint for UpdateProfile maybe? Or keep Orange? App uses Blue for Save button. Let's use Theme Primary if possible or Blue. Saving uses theme.primary. Let's stick to Orange/Blue. I'll use Blue here to match profile screen.
//                         style={styles.checkIconContainer}
//                       >
//                         <Icon name="checkmark" size={12} color="#fff" />
//                       </LinearGradient>
//                     )}
//                   </TouchableOpacity>
//                 )}
//               />
//               {/* Removed Bottom Close Button favoring the top X */}
//             </LinearGradient>
//           </View>
//         </View>
//       </Modal>

//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   header: {
//     // marginTop: normalize(37), // REMOVED
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: normalize(15),
//     marginBottom: 10, // Adjusted simple bottom margin
//     // bottom: 10, // REMOVED
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: normalize(18),
//     fontWeight: '700',
//   },
//   headerSeparator: {
//     height: 1,
//     backgroundColor: '#94A3B8',
//     opacity: 0.5,
//     marginTop: 10,
//     marginBottom: height * 0.02,
//     marginHorizontal: -width * 0.05, // visually extend full width if needed, or remove
//     width: '120%',
//     alignSelf: 'center'
//   },
//   form: {
//     paddingHorizontal: normalize(20),
//     marginTop: normalize(10)
//   },

//   // 1. Image Section
//   profileRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: normalize(30),
//   },
//   profileImg: {
//     width: normalize(70),
//     height: normalize(70),
//     borderRadius: normalize(30),
//     borderWidth: 2,
//     borderColor: '#999',
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#fff', // White circle bg for camera icon
//     borderRadius: 12,
//     padding: 3,
//   },
//   uploadText: {
//     color: '#f29810ff',
//     marginLeft: normalize(20),
//     fontSize: normalize(14),
//     fontWeight: '500',
//     opacity: 0.8
//   },

//   // 2. Fields
//   fieldRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: normalize(20),
//     justifyContent: 'space-between', // Label Left, Input Right
//   },
//   fieldLabel: {
//     color: '#fff',
//     fontSize: normalize(14),
//     width: '35%', // Fixed width for labels so inputs align
//     fontWeight: '600',
//   },
//   inlineInput: {
//     flex: 1, // Take remaining space
//     backgroundColor: '#1c1c36', // Keep dark bg
//     color: '#fff',
//     borderRadius: normalize(8),
//     paddingHorizontal: normalize(12),
//     paddingVertical: normalize(10), // comfortable touch target
//     fontSize: normalize(14),
//   },

//   // Dropdown specific
//   dropdownButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#1c1c36',
//     borderRadius: normalize(8),
//     paddingHorizontal: normalize(12),
//     paddingVertical: normalize(10),
//   },
//   dropdownTextContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   input1: {
//     color: '#fff',
//     fontSize: normalize(14),
//   },
//   dropdownOptions: {
//     backgroundColor: '#1c1c36',
//     borderRadius: 8,
//     marginTop: 5,
//     borderWidth: 1,
//     borderColor: '#333'
//   },
//   dropdownOptionText: {
//     paddingVertical: normalize(10),
//     paddingHorizontal: normalize(15),
//     color: 'white',
//     fontSize: normalize(14),
//   },

//   // 3. Buttons
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: normalize(40),
//     marginBottom: normalize(30),
//     gap: normalize(15)
//   },
//   discardButton: {
//     flex: 1,
//     backgroundColor: '#1E293B', // Dark grey/card color
//     borderRadius: 25,
//     paddingVertical: normalize(14),
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#4fa5c2' // slight border to match theme feel
//   },
//   discardText: {
//     color: '#fff',
//     fontSize: normalize(16),
//     fontWeight: '600'
//   },
//   saveButtonGradient: {
//     flex: 1,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: normalize(14),
//   },
//   saveText: {
//     color: '#fff',
//     fontSize: normalize(16),
//     fontWeight: '700'
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: { // Renamed from modalContent to allow gradient wrapper
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
//     backgroundColor: '#1E293B' // Fallback
//   },
//   modalContentGradient: {
//     flex: 1,
//     padding: 0,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center', // Center title
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.08)',
//     backgroundColor: 'transparent', // Gradient handles it
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
//     borderBottomWidth: 0, // Reset previous
//   },
//   modalOptionSelected: {
//     backgroundColor: 'rgba(79, 165, 194, 0.15)', // Blue tint
//     borderWidth: 1,
//     borderColor: 'rgba(79, 165, 194, 0.3)',
//   },
//   modalOptionText: {
//     fontSize: 16,
//     color: '#94A3B8',
//     fontWeight: '500',
//     flex: 0, // Reset
//   },
//   modalOptionTextSelected: {
//     color: '#4fa5c2', // Blue
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
//   closeButton: { // Keep just in case used elsewhere, but mainly hidden
//     alignItems: 'center',
//     paddingVertical: 18,
//   },
//   closeText: {
//     fontSize: 16,
//     color: '#EF4444',
//   },

// });

// export default UpdateProfile;



// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Dimensions,
//   PixelRatio,
//   Modal,
//   Platform,
//   Alert,
//   FlatList,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useTheme } from '../context/ThemeContext';
// import ImagePicker from 'react-native-image-crop-picker';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { CountryList } from '../utils/CountryList';
// import CustomHeader from '../components/CustomHeader';
// import { useAppTranslation } from '../context/TranslationContext'; // ✅

// const { width, height } = Dimensions.get('window');
// const scale = width / 375;
// const normalize = size =>
//   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// const UpdateProfile = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { theme } = useTheme();
//   const insets = useSafeAreaInsets();
//   const { t } = useAppTranslation(); // ✅

//   const onUpdate = route.params?.onUpdate;

//   /* ─── State ──────────────────────────────────────────────────────────────── */
//   const [loading, setLoading] = useState(false);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [gender, setGender] = useState('');
//   const [country, setCountry] = useState('');
//   const [profileImage, setProfileImage] = useState(null);
//   const [showGenderOptions, setShowGenderOptions] = useState(false);
//   const [showCountryPicker, setShowCountryPicker] = useState(false);
//   const [showYearPicker, setShowYearPicker] = useState(false);

//   /* ─── Fetch user ─────────────────────────────────────────────────────────── */
//   useEffect(() => {
//     const loadUser = async () => {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('accessToken');
//       const res = await fetch('http://13.203.232.239:3000/api/auth/getUser', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await res.json();
//       if (result.success) {
//         const u = result.user;
//         setFirstName(u.firstName || '');
//         setLastName(u.lastName || '');
//         if (u.dateOfBirth) {
//           const d = new Date(u.dateOfBirth);
//           setDateOfBirth(!isNaN(d) ? d.getFullYear().toString() : u.dateOfBirth);
//         } else {
//           setDateOfBirth('');
//         }
//         setGender(u.gender || '');
//         setCountry(u.country || '');
//         setProfileImage(u.profileImage || null);
//       }
//       setLoading(false);
//     };
//     loadUser();
//   }, []);

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

//   /* ─── Gender options (translated) ───────────────────────────────────────── */
//   const genderOptions = [
//     { label: t('Male'),   value: 'male' },
//     { label: t('Female'), value: 'female' },
//     { label: t('Others'), value: 'other' },
//   ];

//   const getGenderLabel = value => {
//     if (!value) return t('Select Gender');                                  // ✅
//     const found = genderOptions.find(o => o.value === value);
//     return found ? found.label : value.charAt(0).toUpperCase() + value.slice(1);
//   };

//   /* ─── Image picker ───────────────────────────────────────────────────────── */
//   const openPicker = async type => {
//     try {
//       const img =
//         type === 'camera'
//           ? await ImagePicker.openCamera({ cropping: true, width: 400, height: 400 })
//           : await ImagePicker.openPicker({ cropping: true, width: 400, height: 400 });
//       setProfileImage(img.path);
//     } catch (e) {
//       if (e.code !== 'E_PICKER_CANCELLED') console.log(e);
//     }
//   };

//   /* ─── Save ───────────────────────────────────────────────────────────────── */
//   const saveProfile = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('accessToken');

//       const formData = new FormData();
//       formData.append('firstName', firstName);
//       formData.append('lastName', lastName);
//       formData.append('dateOfBirth', dateOfBirth);
//       formData.append('gender', gender);
//       formData.append('country', country);

//       if (profileImage && profileImage.startsWith('file')) {
//         const imageUri =
//           Platform.OS === 'ios' ? profileImage.replace('file://', '') : profileImage;
//         formData.append('profileImage', {
//           uri: imageUri,
//           name: 'profile.jpg',
//           type: 'image/jpeg',
//         });
//       }

//       const res = await fetch('http://13.203.232.239:3000/api/auth/profile', {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
//         body: formData,
//       });

//       const text = await res.text();
//       let result;
//       try {
//         result = JSON.parse(text);
//       } catch (e) {
//         Alert.alert(
//           t('Server Error'),                                               // ✅
//           t('Invalid response from server.') + '\n' + text.substring(0, 100),
//         );
//         return;
//       }

//       if (res.ok && result.success) {
//         onUpdate?.(result.user);
//         Alert.alert(
//           t('Success'),                                                    // ✅
//           t('Profile updated successfully'),                               // ✅
//           [{ text: t('OK'), onPress: () => navigation.goBack() }],        // ✅
//           { cancelable: false },
//         );
//       } else {
//         Alert.alert(
//           t('Update Failed'),                                              // ✅
//           result.message || t('Something went wrong. Please check your connection.'),
//         );
//       }
//     } catch (e) {
//       console.log('❌ Profile API Error:', e);
//       Alert.alert(
//         t('Network Error'),                                                // ✅
//         t('Something went wrong. Please check your connection.'),         // ✅
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ─── UI ─────────────────────────────────────────────────────────────────── */
//   return (
//     <View style={{ flex: 1 }}>
//       <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//         <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
//           <CustomHeader
//             title={t('PROFILE')}                                           // ✅
//             onBack={() => navigation.goBack()}
//           />

//           <ScrollView showsVerticalScrollIndicator={false}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
//             ) : (
//               <View style={styles.form}>

//                 {/* Profile image row */}
//                 <View style={styles.profileRow}>
//                   <TouchableOpacity onPress={() => openPicker('gallery')}>
//                     <View>
//                       <Image
//                         source={
//                           profileImage
//                             ? { uri: profileImage }
//                             : require('../assets/dummyProfile.jpg')
//                         }
//                         style={styles.profileImg}
//                       />
//                       <View style={styles.cameraIcon}>
//                         <Icon name="camera" size={16} color="#000" />
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                   <Text style={styles.uploadText}>
//                     {t('Upload / Camera / Icons')}                         {/* ✅ */}
//                   </Text>
//                 </View>

//                 {/* First Name */}
//                 <View style={styles.fieldRow}>
//                   <Text style={styles.fieldLabel}>{t('First Name:')}</Text> {/* ✅ */}
//                   <TextInput
//                     style={styles.inlineInput}
//                     value={firstName}
//                     onChangeText={setFirstName}
//                     placeholderTextColor="#94A3B8"
//                   />
//                 </View>

//                 {/* Last Name */}
//                 <View style={styles.fieldRow}>
//                   <Text style={styles.fieldLabel}>{t('Last Name:')}</Text>  {/* ✅ */}
//                   <TextInput
//                     style={styles.inlineInput}
//                     value={lastName}
//                     onChangeText={setLastName}
//                     placeholderTextColor="#94A3B8"
//                   />
//                 </View>

//                 {/* Year of Birth */}
//                 <View style={styles.fieldRow}>
//                   <Text style={styles.fieldLabel}>{t('Year of Birth:')}</Text> {/* ✅ */}
//                   <TouchableOpacity
//                     style={styles.inlineInput}
//                     onPress={() => setShowYearPicker(true)}>
//                     <Text style={{ color: dateOfBirth ? 'white' : '#94A3B8', fontSize: normalize(14) }}>
//                       {dateOfBirth || t('YYYY')}                           {/* ✅ */}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Gender */}
//                 <View style={[styles.fieldRow, { alignItems: 'flex-start' }]}>
//                   <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
//                     {t('Gender:')}                                          {/* ✅ */}
//                   </Text>
//                   <View style={{ flex: 1 }}>
//                     <TouchableOpacity
//                       style={styles.dropdownButton}
//                       onPress={() => setShowGenderOptions(!showGenderOptions)}>
//                       <View style={styles.dropdownTextContainer}>
//                         <Text style={[styles.input1, { color: gender ? 'white' : '#94A3B8' }]}>
//                           {getGenderLabel(gender)}                         {/* ✅ */}
//                         </Text>
//                       </View>
//                       <MaterialIcons
//                         name={showGenderOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
//                         size={normalize(20)}
//                         color="#94A3B8"
//                       />
//                     </TouchableOpacity>
//                     {showGenderOptions && (
//                       <View style={styles.dropdownOptions}>
//                         {genderOptions.map(option => (                     // ✅ translated
//                           <TouchableOpacity
//                             key={option.value}
//                             onPress={() => {
//                               setGender(option.value);
//                               setShowGenderOptions(false);
//                             }}>
//                             <Text style={styles.dropdownOptionText}>{option.label}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </View>
//                     )}
//                   </View>
//                 </View>

//                 {/* Country */}
//                 <View style={[styles.fieldRow, { alignItems: 'flex-start' }]}>
//                   <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
//                     {t('Country:')}                                         {/* ✅ */}
//                   </Text>
//                   <View style={{ flex: 1 }}>
//                     <TouchableOpacity
//                       style={styles.dropdownButton}
//                       onPress={() => setShowCountryPicker(true)}>
//                       <View style={styles.dropdownTextContainer}>
//                         <Text style={[
//                           styles.input1,
//                           {
//                             color: country ? 'white' : '#94A3B8',
//                             fontSize: country ? normalize(22) : normalize(14),
//                           },
//                         ]}>
//                           {country && CountryList.find(c => c.name === country)
//                             ? `${CountryList.find(c => c.name === country).flag}`
//                             : country || t('Select Country')}              {/* ✅ */}
//                         </Text>
//                       </View>
//                       <MaterialIcons
//                         name="keyboard-arrow-down"
//                         size={normalize(20)}
//                         color="#94A3B8"
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 {/* Buttons */}
//                 <View style={styles.buttonRow}>
//                   <TouchableOpacity
//                     style={styles.discardButton}
//                     onPress={() => navigation.goBack()}>
//                     <Text style={styles.discardText}>{t('Discard')}</Text>  {/* ✅ */}
//                   </TouchableOpacity>

//                   <LinearGradient
//                     colors={[theme.primary, theme.primary]}
//                     style={styles.saveButtonGradient}>
//                     <TouchableOpacity
//                       onPress={saveProfile}
//                       style={{ width: '100%', alignItems: 'center' }}>
//                       <Text style={styles.saveText}>{t('Save')}</Text>     {/* ✅ */}
//                     </TouchableOpacity>
//                   </LinearGradient>
//                 </View>

//               </View>
//             )}
//           </ScrollView>
//         </View>
//       </LinearGradient>

//       {/* ── Country Picker Modal ──────────────────────────────────────────── */}
//       <Modal
//         visible={showCountryPicker}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowCountryPicker(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { height: '80%' }]}>
//             <View style={styles.titleContainer}>
//               <Text style={styles.modalTitle}>{t('Select Country')}</Text>  {/* ✅ */}
//             </View>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               {CountryList.map((item, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.modalOption}
//                   onPress={() => {
//                     setCountry(item.name);
//                     setShowCountryPicker(false);
//                   }}>
//                   <Text style={{ fontSize: 24 }}>{item.flag}</Text>
//                   <Text style={[
//                     styles.modalOptionText,
//                     country === item.name && { color: '#4da6ff', fontWeight: 'bold' },
//                   ]}>
//                     {item.name}
//                   </Text>
//                   {country === item.name && (
//                     <Icon name="checkmark" size={18} color="#4da6ff" />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setShowCountryPicker(false)}>
//               <Text style={styles.closeText}>{t('Close')}</Text>            {/* ✅ */}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* ── Year Picker Modal ─────────────────────────────────────────────── */}
//       <Modal
//         visible={showYearPicker}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowYearPicker(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <LinearGradient
//               colors={['#1e293b', '#0f172a']}
//               style={styles.modalContentGradient}>
//               <View style={styles.titleContainer}>
//                 <Text style={styles.modalTitle}>{t('Select Year')}</Text>   {/* ✅ */}
//                 <TouchableOpacity
//                   style={styles.headerCloseIcon}
//                   onPress={() => setShowYearPicker(false)}>
//                   <Icon name="close" size={24} color="#94A3B8" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={years}
//                 keyExtractor={item => item}
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={{ paddingVertical: 10 }}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={[
//                       styles.modalOption,
//                       dateOfBirth === item && styles.modalOptionSelected,
//                     ]}
//                     onPress={() => {
//                       setDateOfBirth(item);
//                       setShowYearPicker(false);
//                     }}>
//                     <Text style={[
//                       styles.modalOptionText,
//                       dateOfBirth === item && styles.modalOptionTextSelected,
//                     ]}>
//                       {item}
//                     </Text>
//                     {dateOfBirth === item && (
//                       <LinearGradient
//                         colors={['#4fa5c2', '#4fa5c2']}
//                         style={styles.checkIconContainer}>
//                         <Icon name="checkmark" size={12} color="#fff" />
//                       </LinearGradient>
//                     )}
//                   </TouchableOpacity>
//                 )}
//               />
//             </LinearGradient>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default UpdateProfile;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: normalize(15),
//     marginBottom: 10,
//   },
//   headerTitle: { color: '#fff', fontSize: normalize(18), fontWeight: '700' },
//   headerSeparator: {
//     height: 1,
//     backgroundColor: '#94A3B8',
//     opacity: 0.5,
//     marginTop: 10,
//     marginBottom: height * 0.02,
//     width: '120%',
//     alignSelf: 'center',
//   },
//   form: {
//     paddingHorizontal: normalize(20),
//     marginTop: normalize(10),
//   },
//   profileRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: normalize(30),
//   },
//   profileImg: {
//     width: normalize(70),
//     height: normalize(70),
//     borderRadius: normalize(30),
//     borderWidth: 2,
//     borderColor: '#999',
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 3,
//   },
//   uploadText: {
//     color: '#f29810ff',
//     marginLeft: normalize(20),
//     fontSize: normalize(14),
//     fontWeight: '500',
//     opacity: 0.8,
//   },
//   fieldRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: normalize(20),
//     justifyContent: 'space-between',
//   },
//   fieldLabel: {
//     color: '#fff',
//     fontSize: normalize(14),
//     width: '35%',
//     fontWeight: '600',
//   },
//   inlineInput: {
//     flex: 1,
//     backgroundColor: '#1c1c36',
//     color: '#fff',
//     borderRadius: normalize(8),
//     paddingHorizontal: normalize(12),
//     paddingVertical: normalize(10),
//     fontSize: normalize(14),
//   },
//   dropdownButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#1c1c36',
//     borderRadius: normalize(8),
//     paddingHorizontal: normalize(12),
//     paddingVertical: normalize(10),
//   },
//   dropdownTextContainer: { flexDirection: 'row', alignItems: 'center' },
//   input1: { color: '#fff', fontSize: normalize(14) },
//   dropdownOptions: {
//     backgroundColor: '#1c1c36',
//     borderRadius: 8,
//     marginTop: 5,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   dropdownOptionText: {
//     paddingVertical: normalize(10),
//     paddingHorizontal: normalize(15),
//     color: 'white',
//     fontSize: normalize(14),
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: normalize(40),
//     marginBottom: normalize(30),
//     gap: normalize(15),
//   },
//   discardButton: {
//     flex: 1,
//     backgroundColor: '#1E293B',
//     borderRadius: 25,
//     paddingVertical: normalize(14),
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#4fa5c2',
//   },
//   discardText: { color: '#fff', fontSize: normalize(16), fontWeight: '600' },
//   saveButtonGradient: {
//     flex: 1,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: normalize(14),
//   },
//   saveText: { color: '#fff', fontSize: normalize(16), fontWeight: '700' },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: '#1E293B',
//     borderRadius: 16,
//     overflow: 'hidden',
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
//     backgroundColor: '#1E293B',
//   },
//   modalContentGradient: { flex: 1, padding: 0 },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.08)',
//   },
//   modalTitle: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
//   headerCloseIcon: { position: 'absolute', right: 20, padding: 5 },
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
//     backgroundColor: 'rgba(79, 165, 194, 0.15)',
//     borderWidth: 1,
//     borderColor: 'rgba(79, 165, 194, 0.3)',
//   },
//   modalOptionText: { fontSize: 16, color: '#94A3B8', fontWeight: '500' },
//   modalOptionTextSelected: { color: '#4fa5c2', fontWeight: '700', fontSize: 18 },
//   checkIconContainer: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButton: { alignItems: 'center', paddingVertical: 18 },
//   closeText: { fontSize: 16, color: '#EF4444' },
// });

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
  Modal,
  Platform,
  Alert,
  FlatList,
  Animated,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CountryList } from '../utils/CountryList';
import CustomHeader from '../components/CustomHeader';
import { useAppTranslation } from '../context/TranslationContext';
import BadgePopup from './BadgePopup';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens


const { width, height } = Dimensions.get('window');
const scale = width / 375;
const normalize = size =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const BASE_URL = 'http://13.203.232.239:3000';

// ─── Badge Helpers ──────────────────────────────────────────────────────────

const isJustEarned = (earnedAt, withinSeconds = 10) => {
  if (!earnedAt) return false;
  const diff = (Date.now() - new Date(earnedAt).getTime()) / 1000;
  return diff <= withinSeconds;
};

const checkProfileBadges = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/badges/my/earned`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    const badges = Array.isArray(data?.badges) ? data.badges : [];
    
    // Filter for profile badges (1=Profile Perfectionist, 2=Picture Perfect)
    const profileBadges = badges.filter(
      b => [1, 2].includes(b.badgeId) && isJustEarned(b.earnedAt)
    );
    
    if (profileBadges.length > 0) {
      console.log('[Badge] 🏅 Profile badges earned:', profileBadges);
    }
    
    return profileBadges;
  } catch (err) {
    console.error('[Badge] Error checking profile badges:', err);
    return [];
  }
};

// ────────────────────────────────────────────────────────────────────────────

const UpdateProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();

  const onUpdate = route.params?.onUpdate;

  /* ─── State ──────────────────────────────────────────────────────────────── */
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  
  // ── Badge state ──────────────────────────────────────────────────────────
  const [earnedBadges, setEarnedBadges] = useState([]);

  /* ─── Load user from AsyncStorage (getUser API returns 404) ─────────────── */
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        // Try 'userData' key first, then fall back to 'fullLoginResponse'
        const userDataRaw = await AsyncStorage.getItem('userData');
        const fullResponseRaw = await AsyncStorage.getItem('fullLoginResponse');

        let u = null;

        if (userDataRaw) {
          try {
            u = JSON.parse(userDataRaw);
            console.log('✅ [UpdateProfile] Loaded from "userData":', u?.username);
          } catch (e) {
            console.log('❌ [UpdateProfile] Failed to parse "userData":', e.message);
          }
        }

        if (!u && fullResponseRaw) {
          try {
            const full = JSON.parse(fullResponseRaw);
            u = full?.user || full?.player || null;
            console.log('✅ [UpdateProfile] Loaded from "fullLoginResponse":', u?.username);
          } catch (e) {
            console.log('❌ [UpdateProfile] Failed to parse "fullLoginResponse":', e.message);
          }
        }

        if (u) {
          setFirstName(u.firstName || '');
          setLastName(u.lastName || '');
          if (u.dateOfBirth) {
            const d = new Date(u.dateOfBirth);
            setDateOfBirth(!isNaN(d) ? d.getFullYear().toString() : u.dateOfBirth);
          } else {
            setDateOfBirth('');
          }
          setGender(u.gender || '');
          setCountry(u.country || '');
          setProfileImage(u.profileImage || null);
        } else {
          console.log('❌ [UpdateProfile] No user found in AsyncStorage');
        }
      } catch (e) {
        console.log('❌ [UpdateProfile] loadUser error:', e.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  /* ─── Gender options (translated) ───────────────────────────────────────── */
  const genderOptions = [
    { label: t('Male'),   value: 'male' },
    { label: t('Female'), value: 'female' },
    { label: t('Others'), value: 'other' },
  ];

  const getGenderLabel = value => {
    if (!value) return t('Select Gender');
    const found = genderOptions.find(o => o.value === value);
    return found ? found.label : value.charAt(0).toUpperCase() + value.slice(1);
  };

  /* ─── Image picker ───────────────────────────────────────────────────────── */
  const openPicker = async type => {
    try {
      const img =
        type === 'camera'
          ? await ImagePicker.openCamera({ cropping: true, width: 400, height: 400 })
          : await ImagePicker.openPicker({ cropping: true, width: 400, height: 400 });
      setProfileImage(img.path);
    } catch (e) {
      if (e.code !== 'E_PICKER_CANCELLED') console.log(e);
    }
  };

  /* ─── Save ───────────────────────────────────────────────────────────────── */
  const saveProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');

      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('gender', gender);
      formData.append('country', country);

      if (profileImage && profileImage.startsWith('file')) {
        const imageUri =
          Platform.OS === 'ios' ? profileImage.replace('file://', '') : profileImage;
        formData.append('profileImage', {
          uri: imageUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }

      const res = await fetch('http://13.203.232.239:3000/api/auth/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        body: formData,
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        Alert.alert(
          t('Server Error'),
          t('Invalid response from server.') + '\n' + text.substring(0, 100),
        );
        return;
      }

      if (res.ok && result.success) {
        // ✅ Update AsyncStorage with the new user data so ProfileScreen
        // reflects the changes immediately on next open
        try {
          const updatedUser = result.user || result.player;
          if (updatedUser) {
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            console.log('✅ [UpdateProfile] Updated "userData" in AsyncStorage');

            // Also update fullLoginResponse if it exists
            const fullRaw = await AsyncStorage.getItem('fullLoginResponse');
            if (fullRaw) {
              const full = JSON.parse(fullRaw);
              const updatedFull = { ...full, user: updatedUser, player: updatedUser };
              await AsyncStorage.setItem('fullLoginResponse', JSON.stringify(updatedFull));
              console.log('✅ [UpdateProfile] Updated "fullLoginResponse" in AsyncStorage');
            }
          }
        } catch (storageErr) {
          console.log('⚠️ [UpdateProfile] Failed to update AsyncStorage after save:', storageErr.message);
        }

        onUpdate?.(result.user);
        
        // ── Check for profile badges ──────────────────────────────────────
        const profileBadges = await checkProfileBadges(token);
        if (profileBadges.length > 0) {
          setEarnedBadges(profileBadges);
          // Show alert after badge popup
          setTimeout(() => {
            Alert.alert(
              t('Success'),
              t('Profile updated successfully'),
              [{ text: t('OK'), onPress: () => navigation.goBack() }],
              { cancelable: false },
            );
          }, 3000 + profileBadges.length * 800);
        } else {
          Alert.alert(
            t('Success'),
            t('Profile updated successfully'),
            [{ text: t('OK'), onPress: () => navigation.goBack() }],
            { cancelable: false },
          );
        }
      } else {
        Alert.alert(
          t('Update Failed'),
          result.message || t('Something went wrong. Please check your connection.'),
        );
      }
    } catch (e) {
      console.log('❌ Profile API Error:', e);
      Alert.alert(
        t('Network Error'),
        t('Something went wrong. Please check your connection.'),
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─── UI ─────────────────────────────────────────────────────────────────── */
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
        {earnedBadges.length > 0 && (
          <BadgePopup
            badges={earnedBadges}
            onFinish={() => setEarnedBadges([])}
          />
        )}
        <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
          <CustomHeader
            title={t('PROFILE')}
            onBack={() => navigation.goBack()}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
            ) : (
              <View style={styles.form}>

                {/* Profile image row */}
                <View style={styles.profileRow}>
                  <TouchableOpacity onPress={() => openPicker('gallery')}>
                    <View>
                      <Image
                        source={
                          profileImage
                            ? { uri: profileImage }
                            : require('../assets/dummyProfile.jpg')
                        }
                        style={styles.profileImg}
                      />
                      <View style={styles.cameraIcon}>
                        <Icon name="camera" size={16} color="#000" />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.uploadText}>
                    {t('Upload / Camera / Icons')}
                  </Text>
                </View>

                {/* First Name */}
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{t('First Name:')}</Text>
                  <TextInput
                    style={styles.inlineInput}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                {/* Last Name */}
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{t('Last Name:')}</Text>
                  <TextInput
                    style={styles.inlineInput}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                {/* Year of Birth */}
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{t('Year of Birth:')}</Text>
                  <TouchableOpacity
                    style={styles.inlineInput}
                    onPress={() => setShowYearPicker(true)}>
                    <Text style={{ color: dateOfBirth ? 'white' : '#94A3B8', fontSize: normalize(14) }}>
                      {dateOfBirth || t('YYYY')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Gender */}
                <View style={[styles.fieldRow, { alignItems: 'flex-start' }]}>
                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                    {t('Gender:')}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowGenderOptions(!showGenderOptions)}>
                      <View style={styles.dropdownTextContainer}>
                        <Text style={[styles.input1, { color: gender ? 'white' : '#94A3B8' }]}>
                          {getGenderLabel(gender)}
                        </Text>
                      </View>
                      <MaterialIcons
                        name={showGenderOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={normalize(20)}
                        color="#94A3B8"
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
                </View>

                {/* Country */}
                <View style={[styles.fieldRow, { alignItems: 'flex-start' }]}>
                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                    {t('Country:')}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowCountryPicker(true)}>
                      <View style={styles.dropdownTextContainer}>
                        <Text style={[
                          styles.input1,
                          {
                            color: country ? 'white' : '#94A3B8',
                            fontSize: country ? normalize(22) : normalize(14),
                          },
                        ]}>
                          {country && CountryList.find(c => c.name === country)
                            ? `${CountryList.find(c => c.name === country).flag}`
                            : country || t('Select Country')}
                        </Text>
                      </View>
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        size={normalize(20)}
                        color="#94A3B8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.discardButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.discardText}>{t('Discard')}</Text>
                  </TouchableOpacity>

                  <LinearGradient
                    colors={[theme.primary, theme.primary]}
                    style={styles.saveButtonGradient}>
                    <TouchableOpacity
                      onPress={saveProfile}
                      style={{ width: '100%', alignItems: 'center' }}>
                      <Text style={styles.saveText}>{t('Save')}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>

              </View>
            )}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* ── Country Picker Modal ──────────────────────────────────────────── */}
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>{t('Select Country')}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {CountryList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    setCountry(item.name);
                    setShowCountryPicker(false);
                  }}>
                  <Text style={{ fontSize: 24 }}>{item.flag}</Text>
                  <Text style={[
                    styles.modalOptionText,
                    country === item.name && { color: '#4da6ff', fontWeight: 'bold' },
                  ]}>
                    {item.name}
                  </Text>
                  {country === item.name && (
                    <Icon name="checkmark" size={18} color="#4da6ff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCountryPicker(false)}>
              <Text style={styles.closeText}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Year Picker Modal ─────────────────────────────────────────────── */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#1e293b', '#0f172a']}
              style={styles.modalContentGradient}>
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
                keyExtractor={item => item}
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
                        colors={['#4fa5c2', '#4fa5c2']}
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
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(15),
    marginBottom: 10,
  },
  headerTitle: { color: '#fff', fontSize: normalize(18), fontWeight: '700' },
  headerSeparator: {
    height: 1,
    backgroundColor: '#94A3B8',
    opacity: 0.5,
    marginTop: 10,
    marginBottom: height * 0.02,
    width: '120%',
    alignSelf: 'center',
  },
  form: {
    paddingHorizontal: normalize(20),
    marginTop: normalize(10),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(30),
  },
  profileImg: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(30),
    borderWidth: 2,
    borderColor: '#999',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 3,
  },
  uploadText: {
    color: '#f29810ff',
    marginLeft: normalize(20),
    fontSize: normalize(14),
    fontWeight: '500',
    opacity: 0.8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
    justifyContent: 'space-between',
  },
  fieldLabel: {
    color: '#fff',
    fontSize: normalize(14),
    width: '35%',
    fontWeight: '600',
  },
  inlineInput: {
    flex: 1,
    backgroundColor: '#1c1c36',
    color: '#fff',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    fontSize: normalize(14),
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1c36',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
  },
  dropdownTextContainer: { flexDirection: 'row', alignItems: 'center' },
  input1: { color: '#fff', fontSize: normalize(14) },
  dropdownOptions: {
    backgroundColor: '#1c1c36',
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownOptionText: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    color: 'white',
    fontSize: normalize(14),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(40),
    marginBottom: normalize(30),
    gap: normalize(15),
  },
  discardButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 25,
    paddingVertical: normalize(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4fa5c2',
  },
  discardText: { color: '#fff', fontSize: normalize(16), fontWeight: '600' },
  saveButtonGradient: {
    flex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(14),
  },
  saveText: { color: '#fff', fontSize: normalize(16), fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
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
    backgroundColor: '#1E293B',
  },
  modalContentGradient: { flex: 1, padding: 0 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  headerCloseIcon: { position: 'absolute', right: 20, padding: 5 },
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
    backgroundColor: 'rgba(79, 165, 194, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(79, 165, 194, 0.3)',
  },
  modalOptionText: { fontSize: 16, color: '#94A3B8', fontWeight: '500' },
  modalOptionTextSelected: { color: '#4fa5c2', fontWeight: '700', fontSize: 18 },
  checkIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: { alignItems: 'center', paddingVertical: 18 },
  closeText: { fontSize: 16, color: '#EF4444' },
});