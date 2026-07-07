// // // import React, { useEffect, useRef } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   Animated,
// // //   Dimensions,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';

// // // const { width } = Dimensions.get('window');

// // // const BadgePopup = ({ badges = [], onFinish }) => {
// // //   const scaleAnim = useRef(new Animated.Value(0.6)).current;
// // //   const opacityAnim = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     // Popup animation
// // //     Animated.parallel([
// // //       Animated.spring(scaleAnim, {
// // //         toValue: 1,
// // //         friction: 6,
// // //         useNativeDriver: true,
// // //       }),
// // //       Animated.timing(opacityAnim, {
// // //         toValue: 1,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }),
// // //     ]).start();

// // //     // Auto close based on badge count
// // //     const timer = setTimeout(() => {
// // //       Animated.timing(opacityAnim, {
// // //         toValue: 0,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }).start(() => {
// // //         onFinish && onFinish();
// // //       });
// // //     }, 2000 + badges.length * 800);

// // //     return () => clearTimeout(timer);
// // //   }, []);

// // //   return (
// // //     <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
// // //       <Animated.View
// // //         style={[
// // //           styles.container,
// // //           { transform: [{ scale: scaleAnim }] },
// // //         ]}
// // //       >
// // //         <Text style={styles.title}>🎉 You Earned Badges</Text>

// // //         {badges.map((badge, index) => {
// // //           const translateY = useRef(new Animated.Value(30)).current;
// // //           const itemOpacity = useRef(new Animated.Value(0)).current;

// // //           useEffect(() => {
// // //             Animated.sequence([
// // //               Animated.delay(index * 300),
// // //               Animated.parallel([
// // //                 Animated.timing(itemOpacity, {
// // //                   toValue: 1,
// // //                   duration: 300,
// // //                   useNativeDriver: true,
// // //                 }),
// // //                 Animated.timing(translateY, {
// // //                   toValue: 0,
// // //                   duration: 300,
// // //                   useNativeDriver: true,
// // //                 }),
// // //               ]),
// // //             ]).start();
// // //           }, []);

// // //           return (
// // //             <Animated.View
// // //               key={badge.id}
// // //               style={[
// // //                 styles.badgeCard,
// // //                 {
// // //                   borderColor: badge.color || '#fff',
// // //                   opacity: itemOpacity,
// // //                   transform: [{ translateY }],
// // //                 },
// // //               ]}
// // //             >
// // //               <Icon
// // //                 name={badge.icon || 'star'}
// // //                 size={28}
// // //                 color={badge.color || '#FFD700'}
// // //               />

// // //               <View style={{ marginLeft: 10 }}>
// // //                 <Text style={styles.badgeTitle}>
// // //                   {badge.title}
// // //                 </Text>
// // //                 <Text style={styles.badgeDesc}>
// // //                   {badge.description}
// // //                 </Text>
// // //               </View>
// // //             </Animated.View>
// // //           );
// // //         })}
// // //       </Animated.View>
// // //     </Animated.View>
// // //   );
// // // };

// // // export default BadgePopup;

// // // const styles = StyleSheet.create({
// // //   overlay: {
// // //     position: 'absolute',
// // //     width: '100%',
// // //     height: '100%',
// // //     backgroundColor: 'rgba(0,0,0,0.75)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     zIndex: 999,
// // //   },
// // //   container: {
// // //     width: width * 0.82,
// // //     backgroundColor: '#0F172A',
// // //     borderRadius: 20,
// // //     padding: 20,
// // //     alignItems: 'center',
// // //   },
// // //   title: {
// // //     color: '#fff',
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     marginBottom: 15,
// // //   },
// // //   badgeCard: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     padding: 12,
// // //     borderRadius: 14,
// // //     marginTop: 10,
// // //     width: '100%',
// // //     backgroundColor: '#020617',
// // //   },
// // //   badgeTitle: {
// // //     color: '#fff',
// // //     fontWeight: '700',
// // //     fontSize: 14,
// // //   },
// // //   badgeDesc: {
// // //     color: '#94A3B8',
// // //     fontSize: 12,
// // //   },
// // // });



// // // // import React, { useEffect, useRef } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   Animated,
// // // //   Dimensions,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // const { width } = Dimensions.get('window');

// // // // const BadgePopup = ({ badges = [], onFinish }) => {
// // // //   const scaleAnim = useRef(new Animated.Value(0.6)).current;
// // // //   const opacityAnim = useRef(new Animated.Value(0)).current;

// // // //   useEffect(() => {
// // // //     // Popup animation
// // // //     Animated.parallel([
// // // //       Animated.spring(scaleAnim, {
// // // //         toValue: 1,
// // // //         friction: 6,
// // // //         useNativeDriver: true,
// // // //       }),
// // // //       Animated.timing(opacityAnim, {
// // // //         toValue: 1,
// // // //         duration: 300,
// // // //         useNativeDriver: true,
// // // //       }),
// // // //     ]).start();

// // // //     // Auto close based on badge count
// // // //     const timer = setTimeout(() => {
// // // //       Animated.timing(opacityAnim, {
// // // //         toValue: 0,
// // // //         duration: 300,
// // // //         useNativeDriver: true,
// // // //       }).start(() => {
// // // //         onFinish && onFinish();
// // // //       });
// // // //     }, 2000 + badges.length * 800);

// // // //     return () => clearTimeout(timer);
// // // //   }, []);

// // // //   return (
// // // //     <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
// // // //       <Animated.View
// // // //         style={[
// // // //           styles.container,
// // // //           { transform: [{ scale: scaleAnim }] },
// // // //         ]}
// // // //       >
// // // //         <Text style={styles.title}>🎉 You Earned Badges</Text>

// // // //         {badges.map((badge, index) => {
// // // //   const translateY = new Animated.Value(30);
// // // //   const itemOpacity = new Animated.Value(0);

// // // //   Animated.sequence([
// // // //     Animated.delay(index * 300),
// // // //     Animated.parallel([
// // // //       Animated.timing(itemOpacity, {
// // // //         toValue: 1,
// // // //         duration: 300,
// // // //         useNativeDriver: true,
// // // //       }),
// // // //       Animated.timing(translateY, {
// // // //         toValue: 0,
// // // //         duration: 300,
// // // //         useNativeDriver: true,
// // // //       }),
// // // //     ]),
// // // //   ]).start();

// // // //   return (
// // // //     <Animated.View
// // // //       key={badge.id}
// // // //       style={{
// // // //         opacity: itemOpacity,
// // // //         transform: [{ translateY }],
// // // //       }}
// // // //     >
// // // //               <Icon
// // // //                 name={badge.icon || 'star'}
// // // //                 size={28}
// // // //                 color={badge.color || '#FFD700'}
// // // //               />

// // // //               <View style={{ marginLeft: 10 }}>
// // // //                 <Text style={styles.badgeTitle}>
// // // //                   {badge.title}
// // // //                 </Text>
// // // //                 <Text style={styles.badgeDesc}>
// // // //                   {badge.description}
// // // //                 </Text>
// // // //               </View>
// // // //             </Animated.View>
// // // //           );
// // // //         })}
// // // //       </Animated.View>
// // // //     </Animated.View>
// // // //   );
// // // // };

// // // // export default BadgePopup;

// // // // const styles = StyleSheet.create({
// // // //   overlay: {
// // // //     position: 'absolute',
// // // //     width: '100%',
// // // //     height: '100%',
// // // //     backgroundColor: 'rgba(0,0,0,0.75)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     zIndex: 999,
// // // //   },
// // // //   container: {
// // // //     width: width * 0.82,
// // // //     backgroundColor: '#0F172A',
// // // //     borderRadius: 20,
// // // //     padding: 20,
// // // //     alignItems: 'center',
// // // //   },
// // // //   title: {
// // // //     color: '#fff',
// // // //     fontSize: 20,
// // // //     fontWeight: '700',
// // // //     marginBottom: 15,
// // // //   },
// // // //   badgeCard: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     padding: 12,
// // // //     borderRadius: 14,
// // // //     marginTop: 10,
// // // //     width: '100%',
// // // //     backgroundColor: '#020617',
// // // //   },
// // // //   badgeTitle: {
// // // //     color: '#fff',
// // // //     fontWeight: '700',
// // // //     fontSize: 14,
// // // //   },
// // // //   badgeDesc: {
// // // //     color: '#94A3B8',
// // // //     fontSize: 12,
// // // //   },
// // // // });




// // // import React, { useEffect, useRef, useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   Animated,
// // //   Dimensions,
// // //   Image,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';

// // // const { width } = Dimensions.get('window');

// // // const BadgePopup = ({ badges = [], onFinish }) => {
// // //   const scaleAnim = useRef(new Animated.Value(0.6)).current;
// // //   const opacityAnim = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     // Entrance animation
// // //     Animated.parallel([
// // //       Animated.spring(scaleAnim, {
// // //         toValue: 1,
// // //         friction: 6,
// // //         useNativeDriver: true,
// // //       }),
// // //       Animated.timing(opacityAnim, {
// // //         toValue: 1,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }),
// // //     ]).start();

// // //     // Auto-dismiss: 2s base + 0.8s per badge
// // //     const timer = setTimeout(() => {
// // //       Animated.timing(opacityAnim, {
// // //         toValue: 0,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }).start(() => onFinish && onFinish());
// // //     }, 2000 + badges.length * 800);

// // //     return () => clearTimeout(timer);
// // //   }, []);

// // //   return (
// // //     <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
// // //       <Animated.View
// // //         style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
// // //         <Text style={styles.title}>🎉 You Earned Badges!</Text>

// // //         {badges.map((badge, index) => (
// // //           <BadgeRow key={badge.id} badge={badge} index={index} />
// // //         ))}
// // //       </Animated.View>
// // //     </Animated.View>
// // //   );
// // // };

// // // // ── Separate component so hooks are called unconditionally ──────────────────
// // // const BadgeRow = ({ badge, index }) => {
// // //   const translateY = useRef(new Animated.Value(30)).current;
// // //   const itemOpacity = useRef(new Animated.Value(0)).current;
// // //   const [imageError, setImageError] = useState(false);
// // //   const [imageLoaded, setImageLoaded] = useState(false);

// // //   useEffect(() => {
// // //     console.log('[BadgePopup] Rendering badge:', {
// // //       badgeId: badge.id,
// // //       title: badge.title,
// // //       hasIconUrl: !!badge.iconUrl,
// // //       iconUrl: badge.iconUrl,
// // //       icon: badge.icon,
// // //     });

// // //     Animated.sequence([
// // //       Animated.delay(index * 300),
// // //       Animated.parallel([
// // //         Animated.timing(itemOpacity, {
// // //           toValue: 1,
// // //           duration: 300,
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(translateY, {
// // //           toValue: 0,
// // //           duration: 300,
// // //           useNativeDriver: true,
// // //         }),
// // //       ]),
// // //     ]).start();
// // //   }, []);

// // //   const handleImageLoad = () => {
// // //     console.log('[BadgePopup] Image loaded successfully');
// // //     setImageLoaded(true);
// // //   };

// // //   const handleImageError = (error) => {
// // //     console.log('[BadgePopup] Image failed to load:', error);
// // //     setImageError(true);
// // //   };

// // //   return (
// // //     <Animated.View
// // //       style={[
// // //         styles.badgeCard,
// // //         {
// // //           borderColor: badge.color || '#FFD700',
// // //           opacity: itemOpacity,
// // //           transform: [{ translateY }],
// // //         },
// // //       ]}>
// // //       {/* Use S3 iconUrl if present and loads successfully, otherwise fall back to Ionicons */}
// // //       {badge.iconUrl && !imageError ? (
// // //         <Image
// // //           source={{ uri: badge.iconUrl }}
// // //           style={styles.badgeImage}
// // //           resizeMode="contain"
// // //           onLoad={handleImageLoad}
// // //           onError={handleImageError}
// // //         />
// // //       ) : (
// // //         <View style={[styles.badgeImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a3e' }]}>
// // //           <Icon
// // //             name={badge.icon || 'star'}
// // //             size={28}
// // //             color={badge.color || '#FFD700'}
// // //           />
// // //         </View>
// // //       )}

// // //       <View style={{ marginLeft: 12, flex: 1 }}>
// // //         <Text style={styles.badgeTitle}>{badge.title}</Text>
// // //         <Text style={styles.badgeDesc}>{badge.description}</Text>
// // //       </View>
// // //     </Animated.View>
// // //   );
// // // };

// // // export default BadgePopup;

// // // const styles = StyleSheet.create({
// // //   overlay: {
// // //     position: 'absolute',
// // //     width: '100%',
// // //     height: '100%',
// // //     backgroundColor: 'rgba(0,0,0,0.75)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     zIndex: 999,
// // //   },
// // //   container: {
// // //     width: width * 0.82,
// // //     backgroundColor: '#0F172A',
// // //     borderRadius: 20,
// // //     padding: 20,
// // //     alignItems: 'center',
// // //   },
// // //   title: {
// // //     color: '#fff',
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     marginBottom: 15,
// // //   },
// // //   badgeCard: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     padding: 12,
// // //     borderRadius: 14,
// // //     marginTop: 10,
// // //     width: '100%',
// // //     backgroundColor: '#020617',
// // //   },
// // //   badgeImage: {
// // //     width: 36,
// // //     height: 36,
// // //   },
// // //   badgeTitle: {
// // //     color: '#fff',
// // //     fontWeight: '700',
// // //     fontSize: 14,
// // //   },
// // //   badgeDesc: {
// // //     color: '#94A3B8',
// // //     fontSize: 12,
// // //     marginTop: 2,
// // //   },
// // // });


// // import React, { useEffect, useRef, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Animated,
// //   Dimensions,
// // } from 'react-native';
// // import { SvgUri } from 'react-native-svg';
// // import Icon from 'react-native-vector-icons/Ionicons';

// // const { width } = Dimensions.get('window');

// // const BadgePopup = ({ badges = [], onFinish }) => {
// //   const scaleAnim = useRef(new Animated.Value(0.6)).current;
// //   const opacityAnim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     Animated.parallel([
// //       Animated.spring(scaleAnim, {
// //         toValue: 1,
// //         friction: 6,
// //         useNativeDriver: true,
// //       }),
// //       Animated.timing(opacityAnim, {
// //         toValue: 1,
// //         duration: 300,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();

// //     // Auto-dismiss: 2s base + 0.8s per badge
// //     const timer = setTimeout(() => {
// //       Animated.timing(opacityAnim, {
// //         toValue: 0,
// //         duration: 300,
// //         useNativeDriver: true,
// //       }).start(() => onFinish && onFinish());
// //     }, 2000 + badges.length * 800);

// //     return () => clearTimeout(timer);
// //   }, []);

// //   return (
// //     <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
// //       <Animated.View
// //         style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
// //         <Text style={styles.title}>🎉 Badge Earned!</Text>

// //         {badges.map((badge, index) => (
// //           <BadgeRow key={badge.badgeId ?? badge.id ?? index} badge={badge} index={index} />
// //         ))}
// //       </Animated.View>
// //     </Animated.View>
// //   );
// // };

// // // ── Separate component so hooks are called unconditionally ──────────────────
// // const BadgeRow = ({ badge, index }) => {
// //   const translateY = useRef(new Animated.Value(30)).current;
// //   const itemOpacity = useRef(new Animated.Value(0)).current;
// //   const [svgError, setSvgError] = useState(false);

// //   useEffect(() => {
// //     console.log('[BadgePopup] Rendering badge:', {
// //       badgeId: badge.badgeId ?? badge.id,
// //       title: badge.title,
// //       hasIconUrl: !!badge.iconUrl,
// //       iconUrl: badge.iconUrl,
// //       icon: badge.icon,
// //     });

// //     Animated.sequence([
// //       Animated.delay(index * 300),
// //       Animated.parallel([
// //         Animated.timing(itemOpacity, {
// //           toValue: 1,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(translateY, {
// //           toValue: 0,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //       ]),
// //     ]).start();
// //   }, []);

// //   return (
// //     <Animated.View
// //       style={[
// //         styles.badgeCard,
// //         {
// //           borderColor: badge.color || '#FFD700',
// //           opacity: itemOpacity,
// //           transform: [{ translateY }],
// //         },
// //       ]}>

// //       {/* Icon — centered, big */}
// //       <View style={styles.iconWrapper}>
// //         {badge.iconUrl && !svgError ? (
// //           <SvgUri
// //             uri={badge.iconUrl}
// //             width={72}
// //             height={72}
// //             onError={() => {
// //               console.warn(`[BadgePopup] ❌ SVG failed for "${badge.title}":`, badge.iconUrl);
// //               setSvgError(true);
// //             }}
// //           />
// //         ) : (
// //           <Icon
// //             name={badge.icon || 'star'}
// //             size={64}
// //             color={badge.color || '#FFD700'}
// //           />
// //         )}
// //       </View>

// //       {/* Title + description stacked below icon */}
// //       <Text style={styles.badgeTitle}>{badge.title}</Text>
// //       <Text style={styles.badgeDesc}>{badge.description}</Text>
// //     </Animated.View>
// //   );
// // };

// // export default BadgePopup;

// // const styles = StyleSheet.create({
// //   overlay: {
// //     position: 'absolute',
// //     width: '100%',
// //     height: '100%',
// //     backgroundColor: 'rgba(0,0,0,0.75)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     zIndex: 999,
// //   },
// //   container: {
// //     width: width * 0.82,
// //     backgroundColor: '#0F172A',
// //     borderRadius: 20,
// //     padding: 24,
// //     alignItems: 'center',
// //   },
// //   title: {
// //     color: '#fff',
// //     fontSize: 20,
// //     fontWeight: '700',
// //     marginBottom: 15,
// //   },
// //   badgeCard: {
// //     alignItems: 'center',          // everything centered horizontally
// //     borderWidth: 1,
// //     padding: 20,
// //     borderRadius: 14,
// //     marginTop: 10,
// //     width: '100%',
// //     backgroundColor: '#020617',
// //   },
// //   iconWrapper: {
// //     marginBottom: 12,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   badgeTitle: {
// //     color: '#fff',
// //     fontWeight: '700',
// //     fontSize: 16,
// //     textAlign: 'center',
// //     marginBottom: 6,
// //   },
// //   badgeDesc: {
// //     color: '#94A3B8',
// //     fontSize: 13,
// //     textAlign: 'center',
// //     lineHeight: 18,
// //   },
// // });


import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const BadgePopup = ({ badges = [], onFinish }) => {
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const isSwipingRef = useRef(false); // Track if user is swiping
  const isMountedRef = useRef(true); // FIX: Track if component is mounted

  // ── Pan Responder for swipe gesture ────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) {
          // Mark as swiping if moved more than 10px
          if (Math.abs(gestureState.dy) > 10) {
            isSwipingRef.current = true;
          }
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Threshold for dismissal: swipe up more than 50px
        if (gestureState.dy < -50) {
          dismissPopup();
        } else {
          // Snap back to original position
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
        isSwipingRef.current = false;
      },
    })
  ).current;

  const dismissPopup = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // FIX: Only call onFinish if component is still mounted
      if (isMountedRef.current && onFinish) {
        console.log('[BadgePopup] Calling onFinish callback');
        try {
          onFinish();
        } catch (err) {
          console.error('[BadgePopup] Error in onFinish:', err);
        }
      }
    });
  };

  const handlePress = () => {
    // Only navigate if not swiping
    if (isSwipingRef.current) {
      return;
    }
    console.log('Badge popup pressed!');
    // ✅ Only navigate if navigation is available
    if (navigation?.navigate) {
      navigation.navigate('Achivements');
    }
    if (onFinish) onFinish();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(() => {
      dismissPopup();
    }, 3000);

    return () => {
      isMountedRef.current = false; // FIX: Mark as unmounted
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: opacityAnim,
          transform: [
            { translateY },
            { translateY: panY },
          ],
        },
      ]}
      {...panResponder.panHandlers}
      pointerEvents="auto"
    >
      <View
        style={styles.touchableArea}
        onTouchEnd={handlePress}
      >
        <View style={styles.container}>
          <Text style={styles.header}>🎉 Badge Earned!</Text>

          {badges.map((badge, index) => (
            <BadgeRow
              key={badge.badgeId ?? badge.id ?? index}
              badge={badge}
              index={index}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// ── Badge Row ─────────────────────────────────────────────
const BadgeRow = ({ badge, index }) => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [svgError, setSvgError] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 200),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.badgeCard,
        {
          borderColor: badge.color || '#FFD700',
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Icon */}
      <View style={styles.iconWrapper}>
        {badge.iconUrl && !svgError ? (
          <SvgUri
            uri={badge.iconUrl}
            width={36}
            height={36}
            onError={() => setSvgError(true)}
          />
        ) : (
          <Icon
            name={badge.icon || 'star'}
            size={30}
            color={badge.color || '#FFD700'}
          />
        )}
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text style={styles.badgeTitle}>{badge.title}</Text>
        <Text style={styles.badgeDesc}>{badge.description}</Text>
      </View>
    </Animated.View>
  );
};

export default BadgePopup;

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 999,
  },
  touchableArea: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
  },
  header: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#020617',
  },
  iconWrapper: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  badgeDesc: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});


