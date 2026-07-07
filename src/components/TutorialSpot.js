
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Modal,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   PixelRatio,
//   InteractionManager,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useTheme } from '../context/ThemeContext';
// import { useTutorialStep, tutorialManager } from '../utils/tutorialManager';

// const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
// const RF = (size) => (size * SCREEN_W) / 375;
// const scaleFont = (size) => RF(size) * PixelRatio.getFontScale();

// const MASK_COLOR = 'rgba(4,8,20,0.82)';
// // Matches BottomTab.js's tabBarStyle height, so tooltip docks above the tab bar.
// const TAB_BAR_HEIGHT = 60;

// const TutorialSpot = ({ screenKey, stepKey, text, isLast = false, onNext, children }) => {
//   const wrapRef = useRef(null);
//   const [rect, setRect] = useState(null);
//   const pendingStep = useTutorialStep(screenKey);
//   const isActive = pendingStep?.key === stepKey;
//   const insets = useSafeAreaInsets();
//   const { theme } = useTheme();

//   const anim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (!isActive) {
//       setRect(null);
//       anim.setValue(0);
//       return undefined;
//     }
//     let cancelled = false;
//     let timeoutId;

//     // Wait for any in-flight navigation transition / animation to finish before
//     // measuring. Without this, a step that becomes active the instant a screen
//     // is pushed (e.g. SelectOpponent's "options" step) can measure mid-slide-in,
//     // capturing a stale/offset position and producing a wrongly-sized highlight.
//     const interactionHandle = InteractionManager.runAfterInteractions(() => {
//       if (cancelled) return;
//       timeoutId = setTimeout(() => {
//         wrapRef.current?.measureInWindow((x, y, w, h) => {
//           if (!cancelled && w > 0 && h > 0) setRect({ x, y, w, h });
//         });
//       }, 250);
//     });

//     return () => {
//       cancelled = true;
//       clearTimeout(timeoutId);
//       interactionHandle?.cancel?.();
//     };
//   }, [isActive]);

//   useEffect(() => {
//     if (!rect) return undefined;
//     anim.setValue(0);
//     Animated.spring(anim, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }).start();
//     return undefined;
//   }, [rect]);

//   const handleNext = () => {
//     tutorialManager.markStepDone(screenKey, stepKey);
//     onNext?.();
//   };
//   const handleSkip = () => tutorialManager.skip();

//   if (!isActive || !rect) {
//     return (
//       <View ref={wrapRef} collapsable={false}>
//         {children}
//       </View>
//     );
//   }

//   const accent = theme.primary || '#FB923C';
//   const cardBg = theme.cardBackground || '#1E293B';

//   const PAD = RF(8);
//   const PAD_TOP = RF(3);
//   const box = {
//     left: rect.x - PAD,
//     top: rect.y - PAD_TOP,
//     width: rect.w + PAD * 2,
//     height: rect.h + PAD_TOP + PAD,
//   };

//   // Spotlight mask: 4 dark strips surrounding the target, leaving it fully clear/bright.
//   const maskStrips = [
//     { left: 0, top: 0, width: SCREEN_W, height: Math.max(0, box.top) }, // above
//     {
//       left: 0,
//       top: box.top + box.height,
//       width: SCREEN_W,
//       height: Math.max(0, SCREEN_H - (box.top + box.height)),
//     }, // below
//     { left: 0, top: box.top, width: Math.max(0, box.left), height: box.height }, // left
//     {
//       left: box.left + box.width,
//       top: box.top,
//       width: Math.max(0, SCREEN_W - (box.left + box.width)),
//       height: box.height,
//     }, // right
//   ];

//   const { current, total } = tutorialManager.getGlobalProgress();
//   const cardScale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });

//   return (
//     <View ref={wrapRef} collapsable={false}>
//       {children}
//       <Modal transparent visible animationType="fade" onRequestClose={handleNext}>
//         <View style={styles.overlay} pointerEvents="box-none">
//           {/* dark spotlight mask around the target */}
//           {maskStrips.map((s, i) => (
//             <View key={i} pointerEvents="none" style={[styles.maskStrip, s]} />
//           ))}

//           {/* crisp highlight border around the clear/lit target */}
//           <View
//             pointerEvents="none"
//             style={[styles.highlight, { ...box, borderColor: accent, borderRadius: RF(16) }]}
//           />

//           {/* Re-render the real target content inside the Modal itself, positioned over
//               the spotlight. The Modal is its own native layer, so the mask's "gap" does
//               NOT reveal the screen underneath (this is what was showing up as a blank
//               highlighted box) — we have to draw the actual content here instead. */}
//           <View
//             pointerEvents="auto"
//             style={{
//               position: 'absolute',
//               left: rect.x,
//               top: rect.y,
//               width: rect.w,
//               height: rect.h,
//             }}
//           >
//             {children}
//           </View>

//           {/* tooltip card — ALWAYS docked at the same spot (bottom, above safe area),
//               so Skip / Next never move around between steps */}
//           <Animated.View
//             style={[
//               styles.tooltip,
//               {
//                 bottom: TAB_BAR_HEIGHT + insets.bottom + RF(14),
//                 backgroundColor: cardBg,
//                 opacity: anim,
//                 transform: [{ scale: cardScale }],
//               },
//             ]}
//           >
//             <View style={styles.tooltipHeaderRow}>
//               <View style={[styles.bulbCircle, { backgroundColor: accent + '26' }]}>
//                 <Icon name="bulb" size={RF(16)} color={accent} />
//               </View>
//               <Text style={[styles.progressText, { color: accent }]}>
//                 {current}/{total}
//               </Text>
//             </View>

//             <Text style={styles.tooltipText}>{text}</Text>

//             <View style={styles.tooltipFooterRow}>
//               <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//                 <Text style={styles.skipInlineText}>Skip tour</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.nextBtn, { backgroundColor: accent }]}
//                 onPress={handleNext}
//                 activeOpacity={0.85}
//               >
//                 <Text style={styles.nextBtnText}>{isLast ? 'Got it' : 'Next'}</Text>
//                 <Icon
//                   name={isLast ? 'checkmark' : 'arrow-forward'}
//                   size={RF(14)}
//                   color="#fff"
//                   style={{ marginLeft: RF(4) }}
//                 />
//               </TouchableOpacity>
//             </View>
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default TutorialSpot;

// const styles = StyleSheet.create({
//   overlay: { flex: 1 },
//   maskStrip: {
//     position: 'absolute',
//     backgroundColor: MASK_COLOR,
//   },
//   highlight: {
//     position: 'absolute',
//     borderWidth: 2.5,
//   },
//   tooltip: {
//     position: 'absolute',
//     left: RF(16),
//     right: RF(16),
//     borderRadius: RF(16),
//     padding: RF(16),
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.35,
//     shadowRadius: 12,
//     elevation: 10,
//   },
//   tooltipHeaderRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: RF(8),
//   },
//   bulbCircle: {
//     width: RF(28),
//     height: RF(28),
//     borderRadius: RF(14),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   progressText: {
//     fontSize: scaleFont(11),
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   tooltipText: {
//     color: '#fff',
//     fontSize: scaleFont(14.5),
//     lineHeight: RF(20),
//     marginBottom: RF(14),
//     fontWeight: '500',
//   },
//   tooltipFooterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   skipInlineText: {
//     color: '#94A3B8',
//     fontSize: scaleFont(13),
//     fontWeight: '600',
//   },
//   nextBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: RF(18),
//     paddingVertical: RF(9),
//     borderRadius: RF(24),
//   },
//   nextBtnText: { color: '#fff', fontWeight: '700', fontSize: scaleFont(13.5) },
// });

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PixelRatio,
  InteractionManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import {
  tutorialManager,
  useTutorialPendingStep,
  registerTarget,
  unregisterTarget,
  getTarget,
  subscribeTargets,
} from '../utils/tutorialManager';
// remove: import { useNavigation } from '@react-navigation/native';
import { navigationRef} from '../navigation/navigationRef' // ⚠️ adjust path to wherever App.js actually is

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const RF = (size) => (size * SCREEN_W) / 375;
const scaleFont = (size) => RF(size) * PixelRatio.getFontScale();

const MASK_COLOR = 'rgba(4,8,20,0.82)';
const TAB_BAR_HEIGHT = 60;

export const TutorialTarget = ({ id, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const measure = () =>
      new Promise((resolve) => {
        ref.current?.measureInWindow((x, y, w, h) => {
          resolve(w > 0 && h > 0 ? { x, y, w, h } : null);
        });
      });
    registerTarget(id, measure);
    return () => unregisterTarget(id);
  }, [id]);

  return (
    <View ref={ref} collapsable={false}>
      {children}
    </View>
  );
};

export const TutorialOverlay = () => {
  const [tick, setTick] = useState(0);
  const [rects, setRects] = useState(null);
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => tutorialManager.subscribe(() => setTick((x) => x + 1)), []);
  useEffect(() => subscribeTargets(() => setTick((x) => x + 1)), []);

  const step = useTutorialPendingStep();

  useEffect(() => {
    if (!step) {
      setRects(null);
      anim.setValue(0);
      return undefined;
    }
    let cancelled = false;
    let timeoutId;

    const handle = InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;
      timeoutId = setTimeout(async () => {
        const measureFns = step.targets.map((id) => getTarget(id));
        if (measureFns.some((fn) => !fn)) {
          if (!cancelled) setRects(null);
          return;
        }
        const results = await Promise.all(measureFns.map((fn) => fn()));
        if (!cancelled) setRects(results.every(Boolean) ? results : null);
      }, 250);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      handle?.cancel?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.key, tick]);

  useEffect(() => {
    if (!rects) return undefined;
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }).start();
    return undefined;
  }, [rects]);

  if (!step || !rects) return null;

  // const handleNext = () => {
  //   tutorialManager.markStepDone(step.key);
  //   if (step.navigateTo) navigation.navigate(step.navigateTo);
  // };

  const handleNext = () => {
  tutorialManager.markStepDone(step.key);
  if (step.navigateTo && navigationRef.isReady()) {
    navigationRef.navigate(step.navigateTo);
  }
};
  const handleSkip = () => tutorialManager.skip();

  const accent = theme.primary || '#FB923C';
  const cardBg = theme.cardBackground || '#1E293B';
  const PAD = RF(8);
  const PAD_TOP = RF(3);

  const boxes = rects
    .map((r) => ({
      left: r.x - PAD,
      top: r.y - PAD_TOP,
      width: r.w + PAD * 2,
      height: r.h + PAD_TOP + PAD,
    }))
    .sort((a, b) => a.top - b.top);

  const maskStrips = [{ left: 0, top: 0, width: SCREEN_W, height: Math.max(0, boxes[0].top) }];
  boxes.forEach((box, i) => {
    maskStrips.push({ left: 0, top: box.top, width: Math.max(0, box.left), height: box.height });
    maskStrips.push({
      left: box.left + box.width,
      top: box.top,
      width: Math.max(0, SCREEN_W - (box.left + box.width)),
      height: box.height,
    });
    if (i < boxes.length - 1) {
      const next = boxes[i + 1];
      maskStrips.push({
        left: 0,
        top: box.top + box.height,
        width: SCREEN_W,
        height: Math.max(0, next.top - (box.top + box.height)),
      });
    }
  });
  const last = boxes[boxes.length - 1];
  maskStrips.push({
    left: 0,
    top: last.top + last.height,
    width: SCREEN_W,
    height: Math.max(0, SCREEN_H - (last.top + last.height)),
  });

  const { current, total } = tutorialManager.getGlobalProgress();
  const isLast = tutorialManager.isLastStep(step.key);
  const cardScale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {maskStrips.map((s, i) => (
        <View key={i} pointerEvents="none" style={[styles.maskStrip, s]} />
      ))}

      {boxes.map((box, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={[styles.highlight, { ...box, borderColor: accent, borderRadius: RF(16) }]}
        />
      ))}

      <Animated.View
        pointerEvents="auto"
        style={[
          styles.tooltip,
          {
            bottom: TAB_BAR_HEIGHT + insets.bottom + RF(14),
            backgroundColor: cardBg,
            opacity: anim,
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        <View style={styles.tooltipHeaderRow}>
          <View style={[styles.bulbCircle, { backgroundColor: accent + '26' }]}>
            <Icon name="bulb" size={RF(16)} color={accent} />
          </View>
          <Text style={[styles.progressText, { color: accent }]}>
            {current}/{total}
          </Text>
        </View>

        <Text style={styles.tooltipText}>{step.text}</Text>

        <View style={styles.tooltipFooterRow}>
          <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.skipInlineText}>Skip tour</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: accent }]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>{isLast ? 'Got it' : 'Next'}</Text>
            <Icon
              name={isLast ? 'checkmark' : 'arrow-forward'}
              size={RF(14)}
              color="#fff"
              style={{ marginLeft: RF(4) }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  maskStrip: { position: 'absolute', backgroundColor: MASK_COLOR },
  highlight: { position: 'absolute', borderWidth: 2.5 },
  tooltip: {
    position: 'absolute',
    left: RF(16),
    right: RF(16),
    borderRadius: RF(16),
    padding: RF(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  tooltipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RF(8),
  },
  bulbCircle: {
    width: RF(28),
    height: RF(28),
    borderRadius: RF(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: { fontSize: scaleFont(11), fontWeight: '700', letterSpacing: 0.5 },
  tooltipText: {
    color: '#fff',
    fontSize: scaleFont(14.5),
    lineHeight: RF(20),
    marginBottom: RF(14),
    fontWeight: '500',
  },
  tooltipFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skipInlineText: { color: '#94A3B8', fontSize: scaleFont(13), fontWeight: '600' },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RF(18),
    paddingVertical: RF(9),
    borderRadius: RF(24),
  },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: scaleFont(13.5) },
});