// Webrtccompo.js
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    ScrollView,
    Pressable,
    Animated,
    Easing,
    ActivityIndicator,
    StyleSheet,
    Modal,
    Alert,
    TouchableWithoutFeedback,
    FlatList,
    NativeModules,
    DeviceEventEmitter,
    TextInput,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TimerSettingsModal from './TimerSettingsModal';
import MusicPlayerModal from './MusicPlayerModal';
import ZegoUIKitPrebuiltLiveAudioRoom, {
    HOST_DEFAULT_CONFIG,
    AUDIENCE_DEFAULT_CONFIG,
    ZegoMenuBarButtonName,
    ZegoLiveAudioRoomLayoutAlignment,
} from '@zegocloud/zego-uikit-prebuilt-live-audio-room-rn';
import ZegoUIKit from '@zegocloud/zego-uikit-rn';
import TabComponent from '../Home/TabComponent';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { getCountryFromMobile } from '../Utils/CountryUtils';
import {
    useFocusEffect,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import BGEmitter from './BGEmitter';
import { setSeatControllerRef } from './SeatController';
import { getRoomLockedStatus } from './RoomLockController';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import SeatSettingsModal from '../Settings/SeatSettingsModal';
import * as MusicFiles from 'react-native-get-music-files';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const { width, height } = Dimensions.get('window');
const stickerSize = (width - 24 - 5 * 8) / 4;

// Expanded Emoji List (Faces Only)
const EMOJI_LIST = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    , '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️',
    '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗',
    '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶',
    '😎', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔',
    '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵',
    '🥶', '🥴', '😵', '😵‍💫', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
    '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
    '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
    '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
    '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾'
];

// Helper Component for Shaking Emoji
const ShakingEmoji = ({ emoji, onPress }) => {
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shake = Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
            Animated.delay(1000 + Math.random() * 2000) // Random delay between shakes
        ]);

        const loop = Animated.loop(shake);
        loop.start();
        return () => loop.stop();
    }, []);

    const rotate = shakeAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-10deg', '10deg']
    });

    return (
        <TouchableOpacity onPress={onPress} style={{ padding: 8, margin: 4 }}>
            <Animated.Text style={{ fontSize: 28, transform: [{ rotate }] }}>
                {emoji}
            </Animated.Text>
        </TouchableOpacity>
    );
};

// Helper Component for Profile Shaking Emoji (Larger & No Click)
const ProfileShakingEmoji = ({ emoji }) => {
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Faster, continuous shake without long delays
        const shake = Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
            Animated.delay(100) // Very short pause
        ]);

        const loop = Animated.loop(shake);
        loop.start();
        return () => loop.stop();
    }, []);

    const rotate = shakeAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-25deg', '25deg']
    });

    // Added Scale Pulse
    const scale = shakeAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [1.1, 1, 1.1]
    });

    return (
        <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
            <Text style={{ fontSize: 45, textAlign: 'center' }}>
                {emoji}
            </Text>
        </Animated.View>
    );
};

const MyIconButton = ({ name, onPress, type = 'ionicon', color = '#fff', size = 24, style }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            {
                width: 35,
                height: 35,
                borderRadius: 19,
                backgroundColor: 'rgba(100, 150, 255, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.2)',
                marginHorizontal: 4,
            },
            style,
        ]}>
        {type === 'ionicon' ? (
            <Ionicons name={name} size={size} color={color} />
        ) : (
            <MaterialCommunityIcons name={name} size={size} color={color} />
        )}
    </TouchableOpacity>
);

const WelcomeBubble = ({
    avatar,
    name,
    badgeImage,
    level = 0,
    guestName,
    roomName,
}) => {
    console.log('WelcomeBubble Avatar Prop:', avatar);
    const [imgError, setImgError] = useState(false);

    return (
        <View
            style={{
                width: "100%", // Increased width as requested
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 15,
                borderBottomLeftRadius: 2, // Restored notch style
                padding: 10,
                zIndex: 900,
                flexDirection: 'row',
                alignItems: 'flex-start',
            }}>
            {/* Avatar */}
            <View style={{ marginRight: 10 }}>
                <Image
                    source={
                        avatar && !imgError
                            ? { uri: avatar }
                            : require('../Images/dp1.jpg')
                    }
                    onError={() => setImgError(true)}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: '#FFD700',
                    }}
                />
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
                {/* Header Line */}
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                    {/* Owner Badge */}
                    <View
                        style={{
                            backgroundColor: '#FF5733',
                            borderRadius: 4,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            marginRight: 6,
                            alignSelf: 'flex-start', // Prevent stretch
                        }}>
                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
                            Owner
                        </Text>
                    </View>

                    {/* Name */}
                    <Text
                        numberOfLines={1}
                        style={{
                            color: '#5ab4d2', // Cyan
                            fontWeight: 'bold',
                            fontSize: 13,
                            marginRight: 6,
                            maxWidth: 100, // Limit name width
                        }}>
                        {name || 'Host'}
                    </Text>

                    {/* Custom Badge */}
                    {badgeImage && (
                        <Image
                            source={{ uri: badgeImage }}
                            style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 6 }}
                        />
                    )}

                    {/* Level Badge */}
                    <View
                        style={{
                            backgroundColor: '#d946ef',
                            borderRadius: 4,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            alignSelf: 'flex-start',
                        }}>
                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
                            Lv.{level}
                        </Text>
                    </View>
                </View>

                {/* Message Body */}
                <Text style={{ color: '#fff', fontSize: 14, lineHeight: 18 }}>
                    <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>@{guestName || 'User'}</Text>{' '}
                    Welcome to my chatroom <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>{roomName || 'Room'}</Text>. You can
                    We're glad you're here. Enjoy your stay and don't hesitate to reach out if you need anything.
                </Text>
            </View>
        </View>
    );
};


const Webrtccompo = (props) => {
    const {
        onclose,
        visible,
        requests,
        onAccept,
        onReject,
        onClose,
        roomData,
        isPipMode
    } = props;

    // React Navigation passes 'route' prop to screens, but we can also use passed roomData
    const route = props.route;
    const navigation = useNavigation();

    // Combine params from route or direct props
    const params = route?.params || roomData || {};

    const {
        roomId: roomID,
        userID,
        userName,
        profileUrl,
        room_Image,
        creator: hostID,
        follower_count,
        following_count,
        user_code,
        room_id,
        room_name,
        room_background_Image,
        level,
        frame_image: frameImage, // Alias to match usage in saveRecentRoom
        badge_image: initialBadgeImage,
        creator_name,
        creator_phone,
        creator_profile_picture, // ✅ Received from Home
        annoucement, // ✅ Announcement
    } = params;
    console.log('📢 Room Announcement:', annoucement);
    console.log('Webrtccompo Params -> room_Image:', room_Image, 'profileUrl:', profileUrl, 'creator_name:', creator_name);
    console.log('creator_phonejjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', roomID);
    const countryData = getCountryFromMobile(creator_phone);
    const countryFlag = countryData ? countryData.flag : null;
    // Save visited room to Recent History
    useEffect(() => {
        const saveRecentRoom = async () => {
            try {
                const roomData = {
                    roomId: roomID,
                    room_name: room_name || 'Unknown Room',
                    room_Image: room_Image || '',
                    creator: hostID,
                    creator_name: creator_name || 'Unknown',
                    room_id: room_id,
                    room_background_Image: room_background_Image || '',
                    badge_image: badgeImage || '',
                    level: (level !== undefined && level !== null) ? level : '',
                    frame_image: frameImage || '',
                    creator_phone: creator_phone || '',
                    visitedAt: Date.now(),
                };
                console.log('🛡️ Webrtccompo Initial Badge:', roomData);

                const storedRecent = await AsyncStorage.getItem('recent_rooms');
                let recentRooms = storedRecent ? JSON.parse(storedRecent) : [];

                // Remove duplicates (same roomId)
                recentRooms = recentRooms.filter(r => r.roomId !== roomID);

                // Add to top
                recentRooms.unshift(roomData);

                // Keep max 20
                if (recentRooms.length > 20) {
                    recentRooms = recentRooms.slice(0, 20);
                }

                await AsyncStorage.setItem('recent_rooms', JSON.stringify(recentRooms));
                console.log('✅ Room saved to Recent History:', room_name);
            } catch (error) {
                console.error('Failed to save recent room:', error);
            }
        };

        if (roomID) {
            saveRecentRoom();
        }
    }, [roomID, room_name, room_Image, hostID, room_id, room_background_Image, badgeImage, level, frameImage, creator_name]);

    const [showTab, setShowTab] = useState(false);
    const RBSheetRef = useRef(null);
    const giftModalRef = useRef(null);
    const animationValue = useRef(new Animated.Value(0)).current;
    const [animatedGift, setAnimatedGift] = useState(null);
    const [stickerData, setStickerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [leftRoom, setLeftRoom] = useState(false);
    const [myRole, setMyRole] = useState(null); // null until determined
    const [isRoleReady, setIsRoleReady] = useState(false);
    const [kickoutOptionsVisible, setKickoutOptionsVisible] = useState(false);
    const [muteUsers, setMuteUsers] = useState([]);
    const [audienceList, setAudienceList] = useState([]);
    const [notificationConfig, setNotificationConfig] = useState([]);
    const [bgImage, setBgImage] = useState(null);
    const [currentBG, setCurrentBG] = useState(null);
    const [refreshKey, setRefreshKey] = useState(Date.now());
    const [updatedBackground, setUpdatedBackground] = useState(null);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [roomPassword, setRoomPassword] = useState('');
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [activeEmojiPage, setActiveEmojiPage] = useState(0);

    // Chunk EMOJI_LIST into pages of 24 (4 rows x 6 cols or similar fits)
    // Screen width based calculation might be better but fixed size is easier for now.
    // 4 rows * 7 cols = 28. Let's try 3 rows * 7 cols = 21 for cleaner look.
    const emojiPages = useMemo(() => {
        const pageSize = 21;
        const pages = [];
        for (let i = 0; i < EMOJI_LIST.length; i += pageSize) {
            pages.push(EMOJI_LIST.slice(i, i + pageSize));
        }
        return pages;
    }, []);

    // 🔹 ENTRANCE ANIMATION STATE
    const [entranceQueue, setEntranceQueue] = useState([]);
    const [currentEntrance, setCurrentEntrance] = useState(null);
    const entranceAnim = useRef(new Animated.Value(width)).current;
    // 🔹 API HELPER: Report Room Entry/Exit
    const reportRoomEntryExit = async (action) => {
        try {
            console.log(`📡 ROOM TIME API: ${action.toUpperCase()} - Room: ${roomID}`);

            const loginData = await AsyncStorage.getItem('Login');
            let token = null;
            if (loginData) {
                const parsed = JSON.parse(loginData);
                token = parsed?.data?.data?.token;
            }

            await axios.post('https://mufoapp.com/chat/rooms/time/', {
                room_code: roomID,
                action: action
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            console.error('❌ Room Time API Error:', err);
        }
    };

    useEffect(() => {
        reportRoomEntryExit('join');
        return () => {
            reportRoomEntryExit('exit');
        };
    }, []);

    const audienceIdsRef = useRef(new Set());
    const isFirstAudienceLoad = useRef(true);

    useEffect(() => {
        if (!currentEntrance && entranceQueue.length > 0) {
            const nextUser = entranceQueue[0];
            setCurrentEntrance(nextUser);
            setEntranceQueue(prev => prev.slice(1));
        }
    }, [entranceQueue, currentEntrance]);

    useEffect(() => {
        if (currentEntrance) {
            entranceAnim.setValue(width); // Start from Right
            Animated.sequence([
                Animated.timing(entranceAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
                Animated.delay(2000), // Visible for 2s
                Animated.timing(entranceAnim, {
                    toValue: -width, // Exit to Left
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.ease),
                })
            ]).start(() => {
                setCurrentEntrance(null);
            });
        }
    }, [currentEntrance]);

    // Gift modal
    const [giftModalVisible, setGiftModalVisible] = useState(false);
    const [giftModalMessage, setGiftModalMessage] = useState('');

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    // SCALES for Success Modal
    const successScale = useRef(new Animated.Value(0)).current;
    const successOpacity = useRef(new Animated.Value(0)).current;

    // Minimize Logic
    // const [isPipMode, setIsPipMode] = useState(false);

    useEffect(() => {
        // Listen for Native PiP Mode changes
        const subscription = DeviceEventEmitter.addListener('PIP_MODE_CHANGE', (isPip) => {
            console.log('PIP Mode Changed:', isPip);
            setIsPipMode(isPip);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // 🔹 ANNOUNCEMENT LIVE UPDATE
    const [currentAnnouncement, setCurrentAnnouncement] = useState(annoucement || '');

    const fetchLatestAnnouncement = async () => {
        try {
            const response = await fetch(`https://mufoapp.com/chat/rooms/${hostID}/`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                // Find current room if multiple exist, otherwise take first
                const room = data.find(r => r.room_id.toString() === roomID.toString()) || data[0];
                if (room && room.annoucement !== undefined) {
                    console.log('🔄 Fetched Fresh Announcement:', room.annoucement);
                    setCurrentAnnouncement(room.annoucement);
                }
            }
        } catch (err) {
            console.log('Error fetching announcement:', err);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchLatestAnnouncement();
        }, [hostID, roomID])
    );

    const handleMinimize = () => {
        setLeaveConfirmVisible(false);

        // Prioritize In-App Minimize (Overlay)
        if (props.onMinimize) {
            console.log("🔽 Triggering In-App Minimize");
            props.onMinimize();
            return;
        }

        // Fallback: Enter Native PiP Mode
        if (NativeModules.AppModule && NativeModules.AppModule.enterPipMode) {
            NativeModules.AppModule.enterPipMode(300, 400)
                .then((success) => {
                    console.log("✅ PiP Mode Entered:", success);
                })
                .catch((error) => {
                    console.error("❌ PiP Error:", error);
                    let message = "Could not enter Minimize mode.";
                    if (error.code === 'E_PIP_NOT_SUPPORTED') message = "This feature requires Android 8.0 or higher.";
                    else if (error.code === 'E_PIP_NOT_AVAILABLE') message = "This device does not support Picture-in-Picture.";
                    else if (error.code === 'E_PIP_FAILED') message = "System failed to enter PiP mode.";

                    Alert.alert("Minimize Failed", message);
                });
        } else {
            console.warn("AppModule.enterPipMode not found & no onMinimize prop");
            Alert.alert("Setup Issue", "Native Module not updated. Please rebuild the app (npm run android).");
        }
    };



    // Chat States
    const [chatVisible, setChatVisible] = useState(false);
    const [messageText, setMessageText] = useState('');

    // Sofa/Seat States
    const [isSeatRequested, setIsSeatRequested] = useState(false);
    const [seatRequests, setSeatRequests] = useState([]); // Host Side: List of users requesting seat


    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        return `https://mufoapp.com/${cleanPath}`;
    };

    // 🔹 HOST: Handle Seat Request
    const handleAcceptRequest = (userInfo) => {
        if (prebuiltRef.current) {
            console.log("✅ Accepting Seat Request for:", userInfo.userID);
            prebuiltRef.current.acceptSeatTakingRequest(userInfo.userID)
                .then(() => {
                    setSeatRequests(prev => prev.filter(u => u.userID !== userInfo.userID));
                })
                .catch(err => console.error("Accept Error:", err));
        }
    };

    const handleRejectRequest = (userInfo) => {
        if (prebuiltRef.current) {
            console.log("❌ Rejecting Seat Request for:", userInfo.userID);
            prebuiltRef.current.rejectSeatTakingRequest(userInfo.userID)
                .catch(err => console.error("Reject Error:", err)); // often void
            setSeatRequests(prev => prev.filter(u => u.userID !== userInfo.userID));
        }
    };

    // 🔹 TOGGLE MIC FUNCTION (Robust)
    const toggleMic = () => {
        try {
            const newMicState = !isMicOn;
            const targetUserID = userID?.toString() || '';

            if (!targetUserID) {
                console.warn("Cannot toggle mic: UserID is empty");
                return;
            }

            // Force Zego Update
            if (prebuiltRef.current) {
                prebuiltRef.current.turnMicrophoneOn(targetUserID, newMicState);
            } else {
                console.warn("prebuiltRef is null, cannot toggle mic");
            }

            setIsMicOn(newMicState);
            console.log(`🎙 Mic Toggled: ${newMicState ? 'ON' : 'OFF'} for user ${targetUserID}`);

        } catch (err) {
            console.error("Mic Toggle Error:", err);
        }
    };

    useEffect(() => {
        // Listen for Zego Mic State Updates to keep UI in sync
        const onMicStateChange = (userId, state) => {
            if (userId === userID?.toString()) {
                console.log(`🔄 Zego Mic State Updated Event: ${state ? 'ON' : 'OFF'}`);
                setIsMicOn(state);
            }
        };

        // Note: We need to register this if Zego provides a listener. 
        // If ZegoUIKitPrebuiltLiveAudioRoom doesn't expose a direct event here, 
        // we rely on the button press. 
        // However, we can use ZegoUIKit to listen if available.
    }, []);

    // Side profile modal (slide in from right)
    const [sideModalVisible, setSideModalVisible] = useState(false);
    const sideTranslateX = useRef(new Animated.Value(width)).current;
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileDetails, setProfileDetails] = useState(null);
    const [leaveConfirmVisible, setLeaveConfirmVisible] = useState(false);
    const [allSeatsClosed, setAllSeatsClosed] = useState(false);

    const [seatRequestModalVisible, setSeatRequestModalVisible] = useState(false);
    const [giftData, setGiftData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const seatRequestedRef = useRef(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [seatUIState, setSeatUIState] = useState('idle');

    // Success Modal
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successData, setSuccessData] = useState(null);

    // const slideAnim = useRef(new Animated.Value(width)).current; // start off-screen

    // small action menu (three-dot) state
    const [actionMenuVisible, setActionMenuVisible] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [quickToolsVisible, setQuickToolsVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('online');
    const isHost = hostID?.toString() === userID?.toString();
    const prebuiltRef = useRef();
    const shortProfileFileName = profileUrl ? profileUrl.split('/').pop() : '';

    // 🔹 EMOJI REACTION STATE
    const emojiSheetRef = useRef(null);
    const [activeReactions, setActiveReactions] = useState({}); // { [userID]: { emoji, id } }
    // const EMOJI_LIST = ['😂', '❤️', '👍', '🔥', '🎉', '😮', '😢', '😡'];

    const sendEmojiReaction = (emoji) => {
        emojiSheetRef.current?.close();

        // 1. Send Signaling Message (Hidden)
        const message = `EMOJI_REACTION:::${emoji}`;
        ZegoUIKit.sendInRoomMessage(message);

        // 2. Show Locally Immediately
        handleReactionReceived(userID.toString(), emoji);
    };

    const handleReactionReceived = (senderId, emoji) => {
        const reactionId = Date.now();

        // Update State to trigger render
        setActiveReactions(prev => ({
            ...prev,
            [senderId]: { emoji, id: reactionId }
        }));

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setActiveReactions(prev => {
                if (prev[senderId]?.id === reactionId) {
                    const newState = { ...prev };
                    delete newState[senderId];
                    return newState;
                }
                return prev;
            });
        }, 3000);
    };


    // New states for gift user list
    const [giftUserListVisible, setGiftUserListVisible] = useState(false);
    const [selectedGiftUser, setSelectedGiftUser] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null); // New State for Gift Selection
    // Animation for Pulse Effect
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (selectedGift) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [selectedGift]);


    useEffect(() => {
        console.log('🎯 FINAL ICON:', isMicOn ? 'ON' : 'OFF');
    }, [isMicOn]);

    useFocusEffect(
        React.useCallback(() => {
            fetchRoomBG();
            checkKickoutStatus();
        }, []),
    );


    const updateCoinsAfterGift = async newCoins => {
        try {
            const data = await AsyncStorage.getItem('Login');
            if (!data) return;

            const tokens = JSON.parse(data);

            // 👇 coins update
            tokens.data.data.coins = newCoins;

            await AsyncStorage.setItem('Login', JSON.stringify(tokens));

            // 👇 UI update
            setUserCoins(newCoins);
        } catch (e) {
            console.log('Update coins error:', e);
        }
    };

    // console.log(
    //   'prebuiltRef.current value@@@@@@@@@@@@@@@@@@@@@@@@@@@',
    //   prebuiltRef.current,
    // );

    useEffect(() => {
        if (prebuiltRef.current) {
            setSeatControllerRef(prebuiltRef.current); // GLOBAL SET
        }
    }, [prebuiltRef.current]);

    useEffect(() => {
        if (modalVisible) {
            if (isHost) loadJoinRequests();
            loadMembers();
        }
    }, [modalVisible]);

    // 🔹 EMOJI LISTENER (Safe Implementation)
    useEffect(() => {
        // Just a safety check to ensure we can listen
        // Ideally ZegoUIKitPrebuilt handles this, but if we need custom listener:
        // We will rely on onInRoomMessageReceived inside config if it works, 
        // otherwise this useEffect is a placeholder for future SDK integration.
        // Since 'onInRoomMessageReceived' in config might have caused issues or been ignored.
        // For now, let's stick to Local + Sending. 
        // If the user wants real-ti7me receiving, we need to know the exact SDK method.
        // Assuming ZegoUIKit has a static listener:
        /*
        const onMessage = (messageList) => {
            messageList.forEach(msg => {
              if (msg.message.startsWith('EMOJI_REACTION:::')) {
                  const emoji = msg.message.split(':::')[1];
                  const senderID = msg.sender.userID;
                  handleReactionReceived(senderID, emoji);
              }
            });
        };
        ZegoUIKit.onInRoomMessageReceived(onMessage);     
        return () => ZegoUIKit.onInRoomMessageReceived(null); 
        */
    }, []);

    // seat request receive hote hi
    const onSeatRequestReceived = (data) => {
        const requestWithTime = {
            ...data,
            requestedAt: Date.now(), // 🔥 current time
        };

        setSeatRequests(prev => [requestWithTime, ...prev]);
    };

    const getTimeAgo = (time) => {
        const diff = Math.floor((Date.now() - time) / 1000);

        if (diff < 10) return 'just now';
        if (diff < 60) return `${diff}s ago`;

        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes} min ago`;

        const hours = Math.floor(minutes / 60);
        return `${hours} hr ago`;
    };


    //check Room lock
    const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [userPin, setUserPin] = useState(['', '', '', '']);
    const handleUserPin = (text, index) => {
        if (/^\d$/.test(text) || text === '') {
            const copy = [...userPin];
            copy[index] = text;
            setUserPin(copy);

            if (text !== '' && index < 3) {
                pinRefs[index + 1].current.focus();
            }
            if (text === '' && index > 0) {
                pinRefs[index - 1].current.focus();
            }
        }
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(
                    `https://mufoapp.com/chat/room/lock/status/${roomID}`,
                );
                const data = await response.json();

                console.log('➡ ROOM LOCK:', data);

                // room locked but current user is NOT host
                if (data?.is_locked === true && userID !== hostID) {
                    setRoomPassword(data?.password);
                    setPasswordModalVisible(true); // <-- OPEN PIN MODAL
                }
            } catch (err) {
                console.log('❌ Error fetching lock status:', err);
            }
        };

        fetchStatus();
    }, []);

    const checkEnteredPin = () => {
        const entered = userPin.join('');

        if (entered.length !== 4) {
            Alert.alert('Error', 'Please enter 4-digit password');
            return;
        }

        if (entered === roomPassword) {
            // SUCCESS → Enter the room
            setPasswordModalVisible(false);
            return; // Room screen continue normally
        }

        // WRONG PASSWORD
        Alert.alert('Wrong Password', 'Please try again');
        setUserPin(['', '', '', '', '']);
        pinRefs[0].current.focus();
    };

    useEffect(() => {
        const listener = ({ roomID: updatedRoom, newBG }) => {
            if (updatedRoom === roomID) {
                // console.log('🔥 BACKGROUND UPDATED LIVE:', newBG);

                setUpdatedBackground(newBG); // <-- YOUR STATE
            }
        };

        BGEmitter.on('bgChanged', listener);

        return () => BGEmitter.removeListener('bgChanged', listener);
    }, []);


    const [roomLevel, setRoomLevel] = useState(level || 0);
    const [badgeImage, setBadgeImage] = useState(initialBadgeImage || '');

    const fetchRoomBG = async () => {
        try {
            const res = await fetch(
                `https://mufoapp.com/chat/get-room/${roomID}/`
            );
            const json = await res.json();

            // ✅ BACKGROUND IMAGE
            const customBg = await AsyncStorage.getItem('custom_bg_' + roomID);
            if (customBg) {
                console.log('Using Custom BG:', customBg);
                setCurrentBG(customBg); // Local URI
                setUpdatedBackground(customBg); // Ensure it respects local update
            } else {
                const img = json.room_background_Image;
                if (img) {
                    setCurrentBG(`https://mufoapp.com${img}?t=${Date.now()}`);
                }
            }

            // ✅ LEVEL SET
            if (json.level !== undefined && json.level !== null) {
                setRoomLevel(json.level);
            }

            // ✅ BADGE IMAGE
            console.log('🌍 API Badge Response:', json.badge_image);
            if (json.badge_image !== undefined && json.badge_image !== null) {
                setBadgeImage(json.badge_image);
                console.log('🛡️ Badge Available:', json.badge_image);
            } else {
                console.log('❌ Badge NOT Available');
            }
        } catch (error) {
            console.log('fetchRoomBG error:', error);
        }
    };

    // console.log('FINAL BG:', bgImage, updatedBackground, room_background_Image);

    useEffect(() => {
        ZegoUIKitPrebuiltLiveAudioRoom.onSeatChanged = seatList => {
            console.log('🔥 Seat Updated:', seatList);
        };
        return () => {
            ZegoUIKitPrebuiltLiveAudioRoom.onSeatChanged = null;
        };
    }, []);

    useEffect(() => {
        console.log('Audience updated:', audienceList);
    }, [audienceList]);

    // 🔹 AUTO-SEND WELCOME MESSAGE ON JOIN
    useEffect(() => {
        // Prevent Host from welcoming themselves
        // Prevent Host from welcoming themselves - REMOVED so Announcement can show
        // if (userID === hostID) return;

        const timer = setTimeout(() => {
            // Send a hidden/special message that itemBuilder will render as the Welcome Bubble
            const welcomeMsg = '✨WELCOME_MSG✨';
            ZegoUIKit.sendInRoomMessage(welcomeMsg);
        }, 1500); // Small delay to ensure joined
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        console.log('Wating User List:', notificationConfig);
    }, [notificationConfig]);

    useEffect(() => {
        const getUserDetail = async () => {
            try {
                const data = await AsyncStorage.getItem('Login');
                const tokens = JSON.parse(data);
                const currentUserId = tokens?.data?.data?.id;

                if (currentUserId?.toString() === hostID?.toString()) {
                    setMyRole('creator');
                } else {
                    setMyRole('user');
                }
                setIsRoleReady(true); // ✅ mark ready
            } catch (e) {
                console.log('Error checking role:', e);
                setIsRoleReady(true);
            }
        };
        getUserDetail();
    }, []);

    // 🔹 MANUAL LISTENER: Force catch seat requests if the prop fails
    useEffect(() => {
        const callbackID = 'ManualSeatRequestListener';

        // Check if signaling plugin is available
        if (ZegoUIKit.getSignalingPlugin && ZegoUIKit.getSignalingPlugin().onInvitationReceived) {
            console.log("✅ Registering Manual Invitation Listener");

            const signaling = ZegoUIKit.getSignalingPlugin();

            // 1. Invitation Received
            signaling.onInvitationReceived(callbackID, ({ inviter, type, data }) => {
                console.log('🔥 [Manual Listener] Invitation Received:', { inviter, type, data });

                // Type 2 = Request to take seat
                if (type === 2) {
                    // Map properties safely (handle ID vs userID, Name vs userName)
                    const newUser = {
                        userID: inviter.userID || inviter.id || '',
                        userName: inviter.userName || inviter.name || 'Unknown',
                        avatar: inviter.avatar || '',
                        requestedAt: Date.now(), // 🔥 Add timestamp
                    };

                    if (!newUser.userID) {
                        console.warn("⚠️ Received invitation with no valid UserID:", inviter);
                        return;
                    }

                    setSeatRequests(prev => {
                        const exists = prev.find(u => u.userID === newUser.userID);
                        if (exists) {
                            console.log("⚠️ User already in seat request list:", newUser.userID);
                            return prev;
                        }
                        console.log("✅ Adding user to seat requests:", newUser);
                        return [newUser, ...prev];
                    });
                }
            });

            // 2. Invitation Canceled (User cancelled their own request)
            if (signaling.onInvitationCanceled) {
                signaling.onInvitationCanceled(callbackID, ({ inviter, data }) => {
                    console.log('🚫 [Manual Listener] Invitation Canceled:', { inviter });
                    const canceledUserID = inviter.userID || inviter.id;

                    if (canceledUserID) {
                        setSeatRequests(prev => prev.filter(u => u.userID !== canceledUserID));
                        console.log("🗑 Removed cancelled request for:", canceledUserID);
                    }
                });
            }

            // 3. Invitation Timeout - REMOVED per requirement
            // The request must not be removed automatically on timeout

        } else {
            console.warn("⚠️ ZegoUIKit.getSignalingPlugin not available via ZegoUIKit");
        }

        return () => {
            if (ZegoUIKit.getSignalingPlugin) {
                const signaling = ZegoUIKit.getSignalingPlugin();
                if (signaling && signaling.onInvitationReceived) signaling.onInvitationReceived(callbackID, null);
            }
        };
    }, []);

    // 🔹 REFRESH TIMER: Update "Time Ago" every 30 seconds
    useEffect(() => {
        let interval;
        if (seatRequests.length > 0) {
            interval = setInterval(() => {
                setRefreshKey(Date.now()); // Force re-render
            }, 30000);
        }
        return () => clearInterval(interval);
    }, [seatRequests.length]);

    const blockUser = async userId => {
        try {
            const loginRaw = await AsyncStorage.getItem('Login');
            if (!loginRaw) {
                console.warn('⚠️ No login data found in AsyncStorage');
                return;
            }

            const tokens = JSON.parse(loginRaw);
            const token = tokens?.data?.access;
            const response = await fetch(
                `https://mufoapp.com/chat/room/block/${roomID}`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_id: userId }),
                },
            );

            const data = await response.json();
            console.log('BLOCKED ===>', data);

            if (response.ok) {
                setBlockedUsers(prev => [...prev, userId]);
            }
        } catch (error) {
            console.log('Block error:', error);
        }
    };

    const unblockUser = async userId => {
        try {
            const loginRaw = await AsyncStorage.getItem('Login');
            if (!loginRaw) {
                console.warn('⚠️ No login data found in AsyncStorage');
                return;
            }

            const tokens = JSON.parse(loginRaw);
            const token = tokens?.data?.access;
            const response = await fetch(
                `https://mufoapp.com/chat/room/unblock/${roomID}`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_id: userId }),
                },
            );

            const data = await response.json();
            console.log('UNBLOCKED ===>', data);

            if (response.ok) {
                setBlockedUsers(prev => prev.filter(id => id !== userId));
            }
        } catch (error) {
            console.log('Unblock error:', error);
        }
    };

    //handle join request
    const handleJoin = async () => {
        try {
            const data = await AsyncStorage.getItem('Login');
            if (!data) {
                console.warn('⚠️ No login data found in AsyncStorage');
                return;
            }

            const tokens = JSON.parse(data);
            const accessToken = tokens?.data?.access;

            const response = await axios.post(
                `https://mufoapp.com/chat/room/join/${roomID}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            console.log('✅ Join API Success:', response.data);

            Alert.alert(
                'Request Sent',
                'Your request to join the room has been sent.',
            );
        } catch (error) {
            console.log('❌ Join API Error:', error.response?.data || error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Something went wrong!',
            );
        }
    };

    //show the join request
    const [joinRequests, setJoinRequests] = useState([]);

    // SHOW JOIN REQUESTS
    const loadJoinRequests = async () => {
        try {
            // 1️⃣ TOKEN LOAD FROM ASYNC STORAGE (same as handleJoin)
            const data = await AsyncStorage.getItem('Login');
            if (!data) {
                console.warn('⚠️ No login data found in AsyncStorage');
                return;
            }

            const tokens = JSON.parse(data);
            const accessToken = tokens?.data?.access;

            // 2️⃣ API CALL USING AXIOS (recommended)
            const response = await axios.get(
                `https://mufoapp.com/chat/room/join-requests/${roomID}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            console.log('📥 Join Request Data:', response.data);
            setJoinRequests(response.data);
        } catch (err) {
            console.log('❌ loadJoinRequests Error:', err.response?.data || err);
        }
    };
    // Accept and Reject request
    const getAccessToken = async () => {
        try {
            const data = await AsyncStorage.getItem('Login');
            if (!data) return null;

            const tokens = JSON.parse(data);
            return tokens?.data?.access;
        } catch (e) {
            return null;
        }
    };
    const handleAccept = async requestId => {
        try {
            const token = await getAccessToken();
            if (!token) return Alert.alert('Error', 'Token not found!');

            const response = await axios.post(
                `https://mufoapp.com/chat/join-request/handle/${requestId}`,
                { action: 'accept' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            console.log('ACCEPT SUCCESS:', response.data);

            Alert.alert('Accepted', 'User request accepted!');

            loadJoinRequests(); // refresh list
        } catch (err) {
            console.log('ACCEPT ERROR:', err.response?.data || err);
            Alert.alert(
                'Error',
                err.response?.data?.message || 'Something went wrong',
            );
        }
    };

    // Room Members

    const [members, setMembers] = useState([]);
    const [allGifts, setAllGifts] = useState([]);

    const loadMembers = async () => {
        try {
            const response = await axios.get(
                `https://mufoapp.com/chat/room/members/${roomID}`,
            );

            console.log('📌 Members Data:', response.data);
            setMembers(response.data);
        } catch (err) {
            console.log('❌ loadMembers Error:', err.response?.data || err);
        }
    };

    const toggleUserSelect = user => {
        setSelectedUsers(prev => {
            const exists = prev.find(u => u.userID === user.userID);

            if (exists) {
                setSelectAll(false); // If deselecting anyone, turn off Select All
                return prev.filter(u => u.userID !== user.userID);
            } else {
                return [...prev, user];
            }
        });
    };
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
            setSelectAll(false);
        } else {
            setSelectedUsers(audienceList);
            setSelectAll(true);
        }
    };


    const [routes] = useState([
        { key: 'jewellery', title: 'Jewellery' },
        { key: 'cars', title: 'Cars' },
        { key: 'frames', title: 'Frames' },
        { key: 'emojis', title: 'Emojis' },
        { key: 'custom', title: 'Custom' },
        { key: 'countries', title: 'Countries' },
        { key: 'love', title: 'Love' },
        { key: 'lucky', title: 'lucky' },
        { key: 'vip', title: 'VIP' },
        { key: 'luxury', title: 'Luxury' },
        { key: 'flowers', title: 'Flowers' },

    ]);
    const filterGift = cat => {
        return allGifts.filter(
            item => item.category?.toLowerCase() === cat.toLowerCase(),
        );
    };

    const renderScene = SceneMap({
        jewellery: () => <StoreGrid data={filterGift('jewellery')} />,
        cars: () => <StoreGrid data={filterGift('cars')} />,
        frames: () => <StoreGrid data={filterGift('frames')} />,
        emojis: () => <StoreGrid data={filterGift('emojis')} />,
        countries: () => <StoreGrid data={filterGift('countries')} />,
        love: () => <StoreGrid data={filterGift('love')} />,
        vip: () => <StoreGrid data={filterGift('vip')} />,
        luxury: () => <StoreGrid data={filterGift('luxury')} />,
        lucky: () => <StoreGrid data={filterGift('lucky')} />,
        flowers: () => <StoreGrid data={filterGift('flowers')} />,
        custom: () => <StoreGrid data={filterGift('custom')} />,
    });

    const [userCoins, setUserCoins] = useState(0);

    const getUserCoins = async () => {
        try {
            const data = await AsyncStorage.getItem('Login');
            if (!data) return;

            const tokens = JSON.parse(data);
            // console.log('Coins fetch error888888888888888888888888', tokens);
            const coins = tokens?.data?.data?.coins ?? 0;

            setUserCoins(coins);
        } catch (e) {
            console.log('Coins fetch error', e);
        }
    };

    useEffect(() => {
        getUserCoins();
    }, []);


    // fetch gifts (unchanged)
    useEffect(() => {
        fetchGifts();
    }, []);

    const fetchGifts = async () => {
        try {
            const response = await fetch('https://mufoapp.com/coins/get_all_gifts/');
            const json = await response.json();

            if (json.success) {
                setAllGifts(json.data); // 👈 MOST IMPORTANT
                setGiftData(json.data);

                const uniqueCats = [...new Set(json.data.map(item => item.category))];
                setCategories(uniqueCats);
                setActiveCategory(uniqueCats[0]);
            }
        } catch (error) {
            console.log('Gift API Error:', error);
        }
    };

    // Open bottom sheet for sending gift
    const openGiftModal = user => {
        setSelectedGiftUser(user);
        if (RBSheetRef.current) RBSheetRef.current.open();
    };

    // open profile side modal (dummy data)
    const openProfileSideModal = user => {
        if (!user) return;
        setProfileLoading(true);
        setProfileDetails(null);
        setSideModalVisible(true);

        Animated.timing(sideTranslateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
        }).start();

        // Merge userInfo (from Zego) + current user params
        setTimeout(() => {
            const dummyProfile = {
                name: user.userName || userName || 'None',
                userID: user.userID || userID || '',
                avatar: user.avatar
                    ? `https://mymufo.s3.amazonaws.com/images/${user.avatar}`
                    : profileUrl ||
                    'https://mymufo.s3.amazonaws.com/images/default_profile.jpg',
                level: 7,
                followers: user.follower_count ?? follower_count ?? 0,
                following: user.following_count ?? following_count ?? 0,
                ID: user.user_code ?? user_code ?? '',
            };

            setProfileDetails(dummyProfile);
            setProfileLoading(false);
        }, 800);
    };

    const showGiftModal = message => {
        setGiftModalMessage(message);
        setGiftModalVisible(true);
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);

        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 5,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        setTimeout(() => {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setGiftModalVisible(false);
            });
        }, 1500);
    };
    const handleMultiGiftSend = async gift => {
        if (selectedUsers.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one user to send the gift to.');
            return;
        }

        const totalCost = gift.price * selectedUsers.length;

        if (userCoins < totalCost) {
            Alert.alert('Insufficient Coins', `You need ${totalCost} coins to send this gift to the selected users.`);
            return;
        }

        const data = await AsyncStorage.getItem('Login');
        if (!data) return;
        const tokens = JSON.parse(data);
        const token = tokens?.data?.access;

        let successCount = 0;

        // Show loading or some indication? For now just proceed.

        for (const user of selectedUsers) {
            const payload = {
                sender_id: userID,
                receiver_id: user.userID || user.id,
                gift_id: gift.id,
            };

            try {
                await axios.post(
                    'https://mufoapp.com/User/send-gift/',
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                );
                successCount++;
            } catch (error) {
                console.log(`Failed to send to ${user.userName}:`, error);
            }
        }

        if (successCount > 0) {
            // Update Coins locally
            const updatedCoins = userCoins - (gift.price * successCount);
            updateCoinsAfterGift(updatedCoins);

            // Show Success Modal (Reuse one from handleGiftSend or just a simple one)
            // We can set successData and show modal manually to match style
            setSuccessData({ message: `Gift sent to ${successCount} user(s)!`, gift: gift });

            // Trigger animation for the FIRST user or generic?
            setAnimatedGift(gift);
            animationValue.setValue(0);

            Animated.sequence([
                Animated.parallel([
                    Animated.timing(animationValue, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.out(Easing.quad),
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1.5,
                        useNativeDriver: true,
                        friction: 3,
                    }),
                ]),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setAnimatedGift(null);
                // setSuccessModalVisible(true); // 🚫 POP-UP DISABLED

                // 📢 SEND CHAT MESSAGE INSTEAD
                const msg = `sent ${gift.gift_name || gift.name || 'a Gift'} 🎁 to ${selectedUsers.length} users`;
                ZegoUIKit.sendInRoomMessage(msg);

                successScale.setValue(0);
                successOpacity.setValue(0);

                Animated.parallel([
                    Animated.spring(successScale, {
                        toValue: 1,
                        friction: 5,
                        useNativeDriver: true,
                    }),
                    Animated.timing(successOpacity, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
            });

            // Reset Selection
            setSelectedUsers([]);
            setSelectAll(false);
            setSelectedGift(null);
            // Close sheet?
            giftModalRef.current?.close();

        } else {
            Alert.alert('Error', 'Failed to send gifts.');
        }
    };





    const handleGiftSend = async gift => {
        if (!selectedGiftUser) {
            showGiftModal('Please select a user first.');
            return;
        }

        try {
            // 1. Get Token
            const data = await AsyncStorage.getItem('Login');
            if (!data) {
                Alert.alert('Error', 'User not logged in');
                return;
            }
            const tokens = JSON.parse(data);
            const token = tokens?.data?.access;

            // 2. Prepare Payload
            // Note: verify if `userID` is the current user's ID form props/state
            // stored in `userID` variable from route params or context
            const payload = {
                sender_id: userID,
                receiver_id: selectedGiftUser?.userID || selectedGiftUser?.id, // Handle different user object structures
                gift_id: gift.id,
            };

            console.log('🎁 Sending Gift Payload:', payload);

            // 3. API Call
            const response = await axios.post(
                'https://mufoapp.com/User/send-gift/',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            console.log('✅ Gift API Success:', response.data);



            if (response.status === 200) {
                const result = response.data;

                setSuccessData(result);

                // 🔥 COINS UPDATE LOGIC
                const giftPrice = gift.price;

                setUserCoins(prevCoins => {
                    const updatedCoins = prevCoins - giftPrice;

                    // AsyncStorage bhi update
                    updateCoinsAfterGift(updatedCoins);

                    return updatedCoins;
                });

                // 🔹 animation + success modal (tumhara existing code)
                setAnimatedGift(gift);
                animationValue.setValue(0);

                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(animationValue, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                            easing: Easing.out(Easing.quad),
                        }),
                        Animated.spring(scaleAnim, {
                            toValue: 1.5,
                            useNativeDriver: true,
                            friction: 3,
                        }),
                    ]),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    setAnimatedGift(null);
                    // setSuccessModalVisible(true); // 🚫 POP-UP DISABLED

                    // 📢 SEND CHAT MESSAGE INSTEAD
                    const msg = `sent ${gift.gift_name || gift.name || 'a Gift'} 🎁 to ${selectedGiftUser?.userName || 'User'}`;
                    ZegoUIKit.sendInRoomMessage(msg);

                    successScale.setValue(0);
                    successOpacity.setValue(0);

                    Animated.parallel([
                        Animated.spring(successScale, {
                            toValue: 1,
                            friction: 5,
                            useNativeDriver: true,
                        }),
                        Animated.timing(successOpacity, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]).start();
                });

                // showGiftModal(
                //     result.message ||
                //     `🎁 Gift sent to ${selectedGiftUser?.userName || 'User'} successfully!`,
                // );

                // Close the Profile Gift Modal if open
                RBSheetRef.current?.close();
            }
        } catch (error) {
            console.log('❌ Gift Send Error:', error.response?.data || error);
            Alert.alert(
                'Gift Failed',
                error.response?.data?.message ||
                'Could not send gift. Please try again.',
            );
        }
    };

    const StoreGrid = ({ data }) => (
        <FlatList
            data={data}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 5 }}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            renderItem={({ item }) => {
                const isSelected = selectedGift?.id === item.id;
                return (
                    <TouchableOpacity
                        onPress={() => setSelectedGift(item)}
                        activeOpacity={0.8}
                        style={{
                            width: width * 0.28,
                            height: 125, // Fixed height for uniformity
                            marginBottom: 12, // Reduced margin
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 14,
                            borderWidth: 1.5,
                            borderColor: isSelected ? '#FFD700' : 'rgba(255,255,255,0.1)',
                            backgroundColor: isSelected ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            padding: 6,
                            // Shadow for depth
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.5,
                            elevation: 6,
                        }}>

                        {/* Animated Icon Scale */}
                        <Animated.View style={[
                            isSelected ? { transform: [{ scale: pulseAnim }] } : {},
                            {
                                shadowColor: isSelected ? '#FFD700' : 'transparent',
                                shadowOpacity: 0.5,
                                shadowRadius: 10,
                            }
                        ]}>
                            <Image
                                source={{ uri: `https://mufoapp.com${item.gift_image}` }}
                                style={{ width: 60, height: 60, resizeMode: 'contain' }}
                            />
                        </Animated.View>

                        {/* Gift Name - Optional if needed */}
                        {/* <Text numberOfLines={1} style={{ fontSize: 10, color: '#ccc', marginTop: 8 }}>
              {item.gift_name || 'Gift'}
            </Text> */}

                        {/* Price Pill */}
                        <View style={{
                            marginTop: 10,
                            backgroundColor: isSelected ? '#FFD700' : 'rgba(0,0,0,0.4)',
                            borderRadius: 12,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderWidth: 1,
                            borderColor: isSelected ? '#FFD700' : 'rgba(255,255,255,0.2)'
                        }}>
                            <Text style={{
                                fontSize: 11,
                                fontWeight: 'bold',
                                color: isSelected ? '#000' : '#fff'
                            }}>
                                💰 {item.price}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );

    const rocketTranslateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.6],
    });
    const rocketOpacity = animationValue.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [1, 1, 0],
    });

    const avatarBuilder = React.useCallback(({ userInfo }) => {
        const path = `https://mymufo.s3.amazonaws.com/images/${userInfo.inRoomAttributes.avatar}`;
        return (
            <View style={styles.avatarBuilder}>
                <TouchableOpacity onPress={() => openGiftModal(userInfo)}>
                    {/* {console.log('userInfo👮🏼‍♂️👮🏼‍♂️👮🏼‍♀️👮🏼‍♀️🎅🏼🎅🏼', userInfo)} */}
                    {userInfo.inRoomAttributes && userInfo.inRoomAttributes.avatar ? (
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            source={{ uri: path }}
                        />
                    ) : null}

                    {/* EMOJI REACTION OVERLAY */}
                    {activeReactions[userInfo.userID] && (
                        <Animated.View style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            justifyContent: 'center', alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.4)', // Slightly darker background
                            borderRadius: 100, // Circular overlay
                            zIndex: 999
                        }}>
                            <ProfileShakingEmoji emoji={activeReactions[userInfo.userID].emoji} />
                        </Animated.View>
                    )}

                </TouchableOpacity>
            </View>
        );
    }, [activeReactions]);

    const sofaButton = useMemo(() => {
        return (
            <MyIconButton
                key="sofa"
                name="sofa"
                type="material"
                onPress={() => {
                    console.log('Sofa clicked, ref:', seatRequestedRef.current);

                    if (!seatRequestedRef.current) {
                        seatRequestedRef.current = true;
                        prebuiltRef.current?.applyToTakeSeat(-1);
                        console.log('Seat request sent');
                    } else {
                        setShowCancelModal(true);
                    }
                }}
            />
        );
    }, []);

    const foregroundBuilder = ({ userInfo }) => {
        const isHost = userInfo?.userID?.toString() === hostID?.toString();
        return (
            <View
                style={[
                    styles.builder,
                    isHost && {
                        backgroundColor: 'rgba(255, 215, 0, 0.15)',
                        paddingHorizontal: 5,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#FFD700',
                    },
                ]}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => openProfileSideModal(userInfo)}>
                    <MaskedView
                        maskElement={
                            <Text
                                style={[
                                    styles.userName,
                                    {
                                        backgroundColor: 'transparent',
                                        alignSelf: 'center',
                                        maxWidth: width * 0.3,
                                    },
                                ]}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {isHost ? '👑 Host' : userInfo.userName}
                            </Text>
                        }>
                        <LinearGradient
                            colors={
                                isHost
                                    ? ['#FFD700', '#FFA500', '#FF8C00']
                                    : ['#FFA700', '#FF8C00']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}>
                            <Text
                                style={[
                                    styles.userName,
                                    { opacity: 0 },
                                    isHost && { fontWeight: 'bold', fontSize: 15 },
                                ]}>
                                {isHost ? '👑 Host' : userInfo.userName}
                            </Text>
                        </LinearGradient>
                    </MaskedView>
                </TouchableOpacity>
            </View>
        );
    };

    const handleAssignRole = async role => {
        try {
            // 🔑 Get token from async storage (or where you store login data)
            const data = await AsyncStorage.getItem('Login');
            if (!data) {
                console.warn('⚠️ No login data found in AsyncStorage');
                return;
            }

            const tokens = JSON.parse(data);
            const accessToken = tokens?.data?.access;

            const response = await fetch(
                'https://mufoapp.com/chat/rooms/assign-role/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`, // ✅ include token
                    },
                    body: JSON.stringify({
                        room_code: roomID,
                        user_id: profileDetails?.userID,
                        role,
                    }),
                },
            );

            const result = await response.json();
            console.log('🎯 Role API response:', result);

            if (response.status === 403 || result.error) {
                Alert.alert(
                    'Error',
                    result.error || 'Only the room creator can assign roles.',
                );
            } else {
                setRoleModalVisible(false);
                Alert.alert('Success', `User set as ${role}`);
            }
        } catch (error) {
            console.error('❌ Error assigning role:', error);
            Alert.alert('Error', 'Something went wrong!');
        }
    };

    //  Kickout API call
    const handleKickOut = async duration => {
        try {
            const data = await AsyncStorage.getItem('Login');
            if (!data) {
                console.warn('⚠️ No login data found');
                return;
            }

            const tokens = JSON.parse(data);
            const token = tokens?.data?.access;

            const res = await fetch(
                `https://mufoapp.com/chat/room/kickout/${roomID}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        user_id: selectedGiftUser?.userID, // correct key
                        duration: duration,
                    }),
                },
            );

            const response = await res.json();
            console.log('KickOut API:', response);

            if (res.ok) {
                Alert.alert(
                    'User Kicked',
                    response.message || `User kicked for ${duration}`,
                );
            } else {
                Alert.alert('Error', response.message || 'Kick failed');
            }
        } catch (error) {
            console.log('KickOut error:', error);
            Alert.alert('Error', 'Something went wrong');
        }
    };
    //check kickout status
    const checkKickoutStatus = async () => {
        try {
            const res = await fetch(
                `https://mufoapp.com/chat/room/kickout/list/${roomID}`,
            );

            const data = await res.json();
            console.log('Kickout List:', data);

            const kicked = data?.kicked_users?.find(item => item.user_id == userID);

            if (kicked) {
                Alert.alert(
                    'You Are Kicked Out',
                    'You cannot enter this room right now.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ],
                );
            }
        } catch (error) {
            console.log('Kickout check error:', error);
        }
    };

    const muteUser = async (userId, mic) => {
        try {
            prebuiltRef.current.turnMicrophoneOn(userId, mic);
            console.log(`Microphone for ${userId}: ${mic ? 'ON' : 'OFF'}`);
            setRoleModalVisible(false);
        } catch (error) {
            console.log('muteUser error:', error);
        }
    };

    const muteUser1 = async (userId, mic) => {
        try {
            setMuteUsers(prev =>
                prev.includes(userId) ? [...prev] : [...prev, userId],
            );
            prebuiltRef.current.turnMicrophoneOn(userId, false);
            setRoleModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    const removeUserFromSeat = async userId => {
        try {
            prebuiltRef.current.removeSpeakerFromSeat(userId);
            setRoleModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    const applyToTakeSeat = async () => {
        console.log("applyToTakeSeat called");
        try {
            prebuiltRef.current.applyToTakeSeat(0);
            console.log('Request is send For Admin');
            setRoleModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    const inviteAudienceToTakeSeat = async userId => {
        try {
            prebuiltRef.current.inviteAudienceToTakeSeat(userId);
            setRoleModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    const acceptSeatTakingRequest = async userId => {
        try {
            prebuiltRef.current.acceptSeatTakingRequest(userId);

            // accepted user hata do
            setSeatRequests(prev => prev.filter(item => item.userID !== userId));
        } catch (error) {
            console.log(error);
        }
    };

    const cancelSeatTakingRequest = async userId => {
        try {
            prebuiltRef.current.cancelSeatTakingRequest(userId);

            // rejected user hata do
            setSeatRequests(prev => prev.filter(item => item.userID !== userId));
        } catch (error) {
            console.log(error);
        }
    };

    const toggleSeat = () => {
        try {
            if (allSeatsClosed) {
                // If seats are closed → OPEN THEM
                prebuiltRef.current.openSeats();
                console.log('Seats opened');
            } else {
                // If seats are open → CLOSE THEM
                prebuiltRef.current.closeSeats();
                console.log('Seats closed');
            }

            // Flip toggle state
            setAllSeatsClosed(!allSeatsClosed);

            setRoleModalVisible(false);
        } catch (error) {
            console.log('Seat toggle error:', error);
        }
    };

    // Gift categories & filtering
    const [giftCategories, setGiftCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Seat Settings State
    const [seatSettingsVisible, setSeatSettingsVisible] = useState(false);
    const [timerSettingsVisible, setTimerSettingsVisible] = useState(false);

    // Music Player State
    const [musicModalVisible, setMusicModalVisible] = useState(false);

    // Timer Modal State
    const [showWatchIcon, setShowWatchIcon] = useState(false); // Normal Mode Watch Icon
    const [timerEndTime, setTimerEndTime] = useState(null); // For Countdown
    const [remainingTime, setRemainingTime] = useState(null); // Display String
    const [showTimerControls, setShowTimerControls] = useState(false); // Toggle Stop/Close Menu
    const [seatCount, setSeatCount] = useState(9); // Default 1+4+4

    const rowConfigs = useMemo(() => {
        switch (seatCount) {
            case 10: // 1+8+1
                return [
                    { count: 1, alignment: ZegoLiveAudioRoomLayoutAlignment.center },
                    { count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                    { count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                    { count: 1, alignment: ZegoLiveAudioRoomLayoutAlignment.center },
                ];
            case 12: // 1+4+4+3
                return [
                    { count: 1, alignment: ZegoLiveAudioRoomLayoutAlignment.center },
                    { count: 5, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                    { count: 5, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                ];
            case 14:
                return [
                    { count: 1, alignment: ZegoLiveAudioRoomLayoutAlignment.center },
                    { count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                    { count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                    { count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                ];
            case 17:
                return [
                    { count: 2, alignment: ZegoLiveAudioRoomLayoutAlignment.center },
                    { count: 5, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                    { count: 5, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                    { count: 5, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                ];
            default: // 9 (1+4+4)
                return [
                    { count: 1, alignment: ZegoLiveAudioRoomLayoutAlignment.center },
                    { count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                    { count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround },
                ];
        }
    }, [seatCount]);

    useEffect(() => {
        // Listener for Room Property Updates (Sync Seat Layout)
        const callbackID = 'RoomPropertyUpdateCallback';
        ZegoUIKit.onRoomPropertyUpdated(callbackID, (key, oldValue, newValue) => {
            if (key === 'seat_count') {
                console.log(`🔄 Seat Layout Synced: ${newValue}`);
                setSeatCount(parseInt(newValue));
            }
            // Listen for Timer updates if supported by room properties later
        });

        // Fetch initial room properties ensures persistence
        const fetchInitialProps = async () => {
            try {
                // 1. Try fetching from AsyncStorage FIRST (User Request for "ascny")
                const localSeat = await AsyncStorage.getItem(`seat_layout_${roomID}`);
                if (localSeat) {
                    console.log("📥 Loaded Local Seat Count:", localSeat);
                    setSeatCount(parseInt(localSeat));
                    // Sync with Zego just in case
                    ZegoUIKit.updateRoomProperties({ seat_count: localSeat });
                } else {
                    // 2. Fallback to Zego Properties if no local data
                    const props = await ZegoUIKit.getRoomProperties();
                    if (props && props.seat_count) {
                        console.log("📥 Loaded Zego Seat Count:", props.seat_count);
                        setSeatCount(parseInt(props.seat_count));
                    }
                }
            } catch (error) {
                console.log("❌ Error loading room properties:", error);
            }
        };
        fetchInitialProps();

        return () => {
            ZegoUIKit.onRoomPropertyUpdated(callbackID); // Remove listener
        };
    }, []);

    // 🔹 TIMER API & LOGIC
    const handleStartTimer = async (durationMinutes) => {
        try {
            const dataStr = await AsyncStorage.getItem('Login');
            if (!dataStr) {
                console.warn('⚠️ No login data found for Timer API');
                return;
            }
            const tokens = JSON.parse(dataStr);
            const token = tokens?.data?.access;

            const response = await fetch(`https://mufoapp.com/chat/room/timer/${roomID}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ✅ Added Token
                },
                body: JSON.stringify({ duration: durationMinutes })
            });
            const data = await response.json();
            console.log("⏳ Timer API Response:", data);

            if (data.end_time) {
                setTimerEndTime(new Date(data.end_time).getTime());
                setShowWatchIcon(true); // Keeping true to represent "Active" widget state
            } else if (data.error) {
                Alert.alert("Error", data.error);
            }
        } catch (error) {
            console.log("❌ Timer API Error:", error);
            Alert.alert("Error", "Failed to set timer.");
        }
    };

    // 🔹 STOP TIMER API & LOGIC
    const handleStopTimer = async () => {
        try {
            // Optimistic update
            setTimerEndTime(null);
            setRemainingTime(null);
            setShowWatchIcon(false);
            setShowTimerControls(false);

            // Call API with 0 duration to stop (Assuming backend supports zero/negative to clear)
            // Since user didn't specify a stop endpoint, we reuse the start endpoint with 0 duration.
            const dataStr = await AsyncStorage.getItem('Login');
            if (dataStr) {
                const tokens = JSON.parse(dataStr);
                const token = tokens?.data?.access;
                await fetch(`https://mufoapp.com/chat/room/timer/${roomID}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ duration: 0 })
                });
            }
        } catch (error) {
            console.log("Stop Timer Error", error);
        }
    };

    // 🔹 COUNTDOWN EFFECT
    useEffect(() => {
        if (!timerEndTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = timerEndTime - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimerEndTime(null);
                setRemainingTime(null);
                Alert.alert("Time's Up!", "The room timer has ended.");
            } else {
                // Format time (HH:MM:SS or MM:SS)
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                const hours = Math.floor(diff / (1000 * 60 * 60));

                if (hours > 0) {
                    setRemainingTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                } else {
                    setRemainingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timerEndTime]);

    useEffect(() => {
        if (giftData && giftData.length) {
            const cats = Array.from(
                new Set(
                    giftData.map(
                        g => g.category || g.type || g.gift_category || 'Default',
                    ),
                ),
            );
            setGiftCategories(['All', ...cats]);
        }
    }, [giftData]);

    const filteredGifts = (giftData || []).filter(item =>
        selectedCategory === 'All'
            ? true
            : (item.category || item.type || item.gift_category || 'Default') ===
            selectedCategory,
    );

    return (
        <ImageBackground
            source={{
                uri:
                    bgImage ??
                    (updatedBackground
                        ? (updatedBackground.startsWith('http') || updatedBackground.startsWith('file') || updatedBackground.startsWith('content')
                            ? updatedBackground
                            : 'https://mufoapp.com' + updatedBackground)
                        : (room_background_Image?.startsWith('http') || room_background_Image?.startsWith('file')
                            ? room_background_Image
                            : 'https://mufoapp.com' + room_background_Image)),
            }}
            resizeMode="cover"
            style={styles.image}>
            <View style={styles.overlay}>
                {!isPipMode && (
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <View style={styles.backcontainer}>
                            <View style={styles.roomIdContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={
                                            badgeImage
                                                ? { uri: getImageUrl(badgeImage) }
                                                : require('../Images/badges.png')
                                        }
                                        style={{ width: 20, height: 20, marginRight: 5, resizeMode: 'contain' }}
                                    />
                                    <Text style={styles.roomIdText}>{room_name}</Text>
                                    {/* <Text style={styles.roomIdText}>{level}</Text> */}
                                </View>
                                {/* Creator Name with Flag */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.roomIdText, { fontSize: 10, color: '#ddd' }]}>Created by {creator_name}</Text>
                                    {countryFlag && (
                                        <Text style={{ marginLeft: 5, fontSize: 12, color: '#fff' }}>{countryFlag}</Text>
                                    )}
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.roomIdText}>ID: {room_id}</Text>
                                    <Icon2
                                        name="user-friends"
                                        size={13}
                                        color={'#060119ff'}
                                        style={{ start: 6, top: 3 }}
                                    />
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            bottom: 1,
                                            start: 8,
                                        }}>A
                                        {audienceList.length}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => setLeaveConfirmVisible(true)}>
                                <Entypo
                                    name="cross"
                                    size={30}
                                    color={'#faf9fcff'}
                                    style={{ opacity: 0.8 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}

                {/* 🔹 ENTRANCE ANIMATION BANNER */}
                {!isPipMode && currentEntrance && (
                    <Animated.View style={{
                        position: 'absolute',
                        top: 100,
                        left: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        zIndex: 9999,
                        transform: [{ translateX: entranceAnim }]
                    }}>
                        <Image
                            source={currentEntrance.avatar ? { uri: `https://mymufo.s3.amazonaws.com/images/${currentEntrance.avatar}` } : require('../Images/dp1.jpg')}
                            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10, borderWidth: 1, borderColor: '#FFD700' }}
                        />
                        <View>
                            <Text style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>
                                {currentEntrance.userName || 'User'}
                            </Text>
                            <Text style={{ color: '#fff', fontSize: 11 }}>
                                entered the room 🚀
                            </Text>
                        </View>
                    </Animated.View>
                )}

                <View style={styles.imagecontainer}>
                    {/* 🔹 TIMER & WATCH DISPLAY */}
                    {/* 🔹 WATCH ICON (Separate - Top Position) */}

                    {/* 🔹 WATCH ICON & CONTROLS CONTAINER */}
                    {(showWatchIcon || remainingTime) && (
                        <View style={{ position: 'absolute', top: 40, left: 20, zIndex: 51, alignItems: 'flex-start' }}>
                            {/* Watch Icon Button */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setShowTimerControls(prev => !prev)}
                                style={{ padding: 5 }}
                            >
                                <Image
                                    source={require('../Images/timer.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                            </TouchableOpacity>

                            {/* Controls (Stop / Close) - Positioned Below Watch Icon */}
                            {showTimerControls && (
                                <View style={{
                                    marginTop: 8, // Space below icon
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Premium looking background
                                    padding: 6,
                                    borderRadius: 16,
                                    elevation: 6,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 5,
                                    alignItems: 'center',
                                    minWidth: 80,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    {/* Stop Button */}
                                    <TouchableOpacity
                                        onPress={handleStopTimer}
                                        style={{
                                            backgroundColor: '#FF4D4D',
                                            paddingHorizontal: 16,
                                            paddingVertical: 4,
                                            borderRadius: 20,
                                            marginRight: 6, // Space between buttons
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Stop</Text>
                                    </TouchableOpacity>

                                    {/* Close Icon */}
                                    <TouchableOpacity onPress={() => setShowTimerControls(false)} style={{ padding: 2 }}>
                                        <MaterialCommunityIcons name="close-circle" size={24} color="#555" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {/* 🔹 TIMER DISPLAY (Separate - Bottom Position) */}
                    {remainingTime && (
                        <View style={{ position: 'absolute', top: 70, right: 20, zIndex: 50 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setShowTimerControls(prev => !prev)}
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.85)',
                                    paddingHorizontal: 15,
                                    paddingVertical: 6,
                                    borderColor: '#a1d3ffff',
                                    borderWidth: 1,
                                    shadowColor: '#deef89ff',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <MaterialCommunityIcons name="timer-sand" size={18} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' }}>
                                    {remainingTime}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!leftRoom && isRoleReady ? (
                        <>
                            <ZegoUIKitPrebuiltLiveAudioRoom
                                key={`room_layout_${seatCount}`} // Force re-render on layout change
                                ref={prebuiltRef}
                                appID={2143217565}
                                appSign="a44ce0fe80d8cdf6f8d44e5a9329c1f9f4f45d51cf580891485293328ee92402"
                                userID={userID.toString()}
                                userName={userName}
                                roomID={roomID}
                                config={{
                                    ...(myRole == 'creator'
                                        ? HOST_DEFAULT_CONFIG
                                        : AUDIENCE_DEFAULT_CONFIG),
                                    innerText: {
                                        memberListTitle: 'Members',
                                    },
                                    onSeatTakingRequested: audience => {
                                        console.log(
                                            '🔥👨🏽‍🦳👨🏽‍🦳👩🏽‍🦳👩🏽‍🦳👱🏽‍♂️👱🏽‍♂️👱🏽‍♀️👱🏽‍♀️ Seat Request Received:',
                                            audience,
                                        );
                                        // audience array nahi hota → single object hota hai
                                        setSeatRequests(prev => [...prev, audience]);
                                    },
                                    onSeatTakingRequestRejected: () => {
                                        console.log("❌ Seat Request Rejected by Host");
                                        setIsSeatRequested(false);
                                        Alert.alert("Request Rejected", "The host declined your seat request.");
                                    },

                                    seatConfig: { avatarBuilder, foregroundBuilder },
                                    layoutConfig: {
                                        rowConfigs: rowConfigs,
                                    },
                                    takeSeatIndexWhenJoining: 0,
                                    hostSeatIndexes: [0],
                                    bottomMenuBarConfig: {
                                        hostButtons: [],
                                        audienceButtons: [],
                                        hostExtendButtons: [],
                                        audienceExtendButtons: [],
                                        maxCount: 0,
                                        showInRoomMessageButton: false,
                                    },
                                    avatar: shortProfileFileName,
                                    userInRoomAttributes: {
                                        avatar: shortProfileFileName,
                                        followers: follower_count,
                                        role: myRole,
                                    },
                                    seatConfig: {
                                        avatarBuilder,
                                        foregroundBuilder,
                                        ...(myRole == 'creator'
                                            ? { takeSeatWhenJoining: true }
                                            : { takeSeatWhenJoining: false }),
                                    },
                                    inRoomMessageViewConfig: {
                                        itemBuilder: ({ message }) => {
                                            // HIDE EMOJI MESSAGES FROM CHAT
                                            if (message.message.startsWith('EMOJI_REACTION:::')) {
                                                return <View />;
                                            }

                                            // 🔹 CUSTOM WELCOME & ANNOUNCEMENT BUBBLE
                                            if (message.message.includes('✨WELCOME_MSG✨')) {
                                                return (
                                                    <View style={{ marginBottom: 15, paddingHorizontal: 15, width: '100%', alignItems: 'flex-start' }}>
                                                        {/* 1. Welcome Bubble - Only for Guests (Not Host) */}
                                                        {message.sender.userID !== hostID && (
                                                            <WelcomeBubble
                                                                avatar={
                                                                    creator_profile_picture
                                                                        ? (creator_profile_picture.startsWith('http') ? creator_profile_picture : `https://mufoapp.com${creator_profile_picture}`)
                                                                        : (room_Image
                                                                            ? `https://mufoapp.com${room_Image}`
                                                                            : (profileUrl?.startsWith('http') ? profileUrl : `https://mufoapp.com${profileUrl}`))
                                                                }
                                                                name={creator_name || 'Room Owner'}
                                                                badgeImage={badgeImage ? `https://mufoapp.com${badgeImage}` : null}
                                                                level={roomLevel}
                                                                guestName={message.sender.userName}
                                                                roomName={room_name}
                                                            />
                                                        )}

                                                        {/* 2. Announcement (Immediately Below) */}
                                                        {currentAnnouncement && (
                                                            <View style={{
                                                                marginTop: 8, // Spacing from welcome
                                                                maxWidth: '85%',
                                                                backgroundColor: 'rgba(248, 125, 187, 0.3)',
                                                                borderRadius: 20,
                                                                paddingVertical: 6,
                                                                paddingHorizontal: 12,
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                borderWidth: 1,
                                                                borderColor: 'rgba(255, 192, 203, 0.4)',
                                                            }}>
                                                                <View style={{
                                                                    width: 24, height: 24, borderRadius: 12,
                                                                    backgroundColor: 'rgba(202, 185, 185, 0.2)',
                                                                    justifyContent: 'center', alignItems: 'center',
                                                                    marginRight: 8
                                                                }}>
                                                                    <MaterialIcons name="campaign" size={16} color="#fff" />
                                                                </View>

                                                                <View style={{ flex: 1 }}>
                                                                    <Text style={{
                                                                        color: '#fff',
                                                                        fontSize: 13,
                                                                        fontWeight: '500',
                                                                        lineHeight: 18,
                                                                    }}>
                                                                        {currentAnnouncement}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        )}
                                                    </View>
                                                );
                                            }

                                            const isSelf = message.sender.userID == userID.toString();
                                            const isAdmin = myRole === 'creator';

                                            return (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start', // Always Left Aligned
                                                    marginBottom: 15, // Normal spacing
                                                    paddingHorizontal: 15,
                                                    width: '100%'
                                                }}>
                                                    {/* Message Bubble */}
                                                    <View style={{
                                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                                        borderRadius: 15,
                                                        paddingHorizontal: 15,
                                                        paddingVertical: 10,
                                                        maxWidth: '90%',
                                                        borderBottomLeftRadius: 2, // Notch on left for flow feel
                                                    }}>
                                                        {/* Sender Name */}
                                                        <Text style={{
                                                            color: '#5ab4d2ff',
                                                            fontSize: 12,
                                                            marginBottom: 4,
                                                            fontWeight: 'bold',
                                                            textAlign: 'left' // Always Left 
                                                        }}>
                                                            {message.sender.userName}
                                                        </Text>

                                                        {/* Message Text */}
                                                        <Text style={{ color: '#fff', fontSize: 15, lineHeight: 20 }}>
                                                            {message.message}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        },
                                    },
                                    onReady: () => {
                                        console.log('🚀 onReady Called — Updating Attributes...');

                                        ZegoUIKit.setUsersInRoomAttributes(userID.toString(), {
                                            avatar: String(shortProfileFileName),
                                            followers: String(follower_count ?? '0'),
                                            role: String(myRole ?? '0'),
                                        })
                                            .then(() => {
                                                console.log('✅ Attributes Updated Successfully!');
                                            })
                                            .catch(err => {
                                                console.log('❌ Error Updating Attributes:', err);
                                            });
                                    },

                                    onUserCountOrPropertyChanged: userList => {
                                        // console.log('🔥 USER LIST UPDATED:', userList);
                                        userList.forEach(user => {
                                            if (user.userID.toString() === userID.toString()) {
                                                setIsMicOn(user.isMicrophoneOn ?? true);
                                            }
                                        });

                                        // 🔹 DETECT NEW JOINERS
                                        const newIds = new Set(userList.map(u => u.userID));

                                        if (isFirstAudienceLoad.current) {
                                            isFirstAudienceLoad.current = false;
                                        } else {
                                            const joined = userList.filter(u => !audienceIdsRef.current.has(u.userID));
                                            if (joined.length > 0) {
                                                console.log('🎉 New Users Joined:', joined);
                                                setEntranceQueue(prev => [...prev, ...joined]);
                                            }
                                        }

                                        audienceIdsRef.current = newIds;
                                        setAudienceList(userList);
                                    },
                                }}
                            />

                            {/* 🔹 WELCOME BUBBLE (Local Overlay) */}


                            {/* 🔹 CUSTOM OVERLAY CONTROL BAR (Overlay fixed at bottom) */}
                            {!isPipMode && (
                                <View style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between', // Split Left and Right
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                    zIndex: 999
                                }}>
                                    {/* LEFT: Chat Button */}
                                    <MyIconButton
                                        name="chatbubble-ellipses-outline"
                                        onPress={() => setChatVisible(true)}
                                    />

                                    {/* RIGHT: Control Icons Group */}
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 5 // Spacing between right icons
                                    }}>
                                        {/* HOST CONTROLS */}
                                        {myRole === 'creator' && (
                                            <>
                                                <MyIconButton
                                                    name="grid-outline"
                                                    onPress={() => setQuickToolsVisible(true)}
                                                />
                                                <MyIconButton
                                                    name={isMicOn ? 'mic' : 'mic-off'}
                                                    color={isMicOn ? '#fff' : '#fff'}
                                                    style={{
                                                        width: 38, height: 38, borderRadius: 24, // Bigger for mic
                                                        borderColor: isMicOn ? 'rgba(100, 150, 255, 0.3)' : 'rgba(100, 150, 255, 0.3)',
                                                        backgroundColor: isMicOn ? 'rgba(100, 150, 255, 0.3)' : 'rgba(100, 150, 255, 0.3)',
                                                    }}
                                                    size={28}
                                                    onPress={toggleMic}
                                                />
                                                <MyIconButton
                                                    name="gift-outline"
                                                    onPress={() => {
                                                        setSelectedGiftUser(null);
                                                        setSelectedGift(null);
                                                        giftModalRef.current?.open();
                                                    }}
                                                />
                                                <MyIconButton
                                                    name="emoticon-outline"
                                                    type="material-community"
                                                    onPress={() => emojiSheetRef.current?.open()}
                                                />
                                            </>
                                        )}

                                        {/* AUDIENCE CONTROLS */}
                                        {myRole !== 'creator' && (
                                            <>
                                                <MyIconButton
                                                    key="sofa"
                                                    name={isSeatRequested ? "sofa" : "sofa-single-outline"}
                                                    type="material"
                                                    color={isSeatRequested ? '#fff' : '#fff'} // Orange if requested, White if idle
                                                    style={{
                                                        opacity: isSeatRequested ? 0.7 : 1,
                                                        backgroundColor: isSeatRequested ? 'rgba(100, 150, 255, 0.3)' : 'rgba(100, 150, 255, 0.3)',
                                                        width: 35, height: 35, borderRadius: 24, // Consistent size
                                                        borderColor: isSeatRequested ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.2)',
                                                        borderWidth: 1.5,
                                                        justifyContent: 'center', alignItems: 'center'
                                                    }}
                                                    onPress={() => {
                                                        if (!isSeatRequested) {
                                                            setIsSeatRequested(true);
                                                            seatRequestedRef.current = true; // Keep ref if needed for other logic
                                                            prebuiltRef.current?.applyToTakeSeat(-1);
                                                            Alert.alert('Seat Request Sent', 'Please wait for the host to accept.');
                                                        } else {
                                                            setShowCancelModal(true);
                                                        }
                                                    }}
                                                />
                                                <MyIconButton
                                                    name={isMicOn ? 'mic' : 'mic-off'}
                                                    color={isMicOn ? '#fff' : '#fff'}
                                                    style={{
                                                        width: 35, height: 35, borderRadius: 24,
                                                        borderColor: isMicOn ? 'rgba(100, 150, 255, 0.3)' : 'rgba(255,255,255,0.2)',
                                                        backgroundColor: isMicOn ? 'rgba(100, 150, 255, 0.3)' : 'rgba(100, 150, 255, 0.3)',
                                                    }}
                                                    size={28}
                                                    onPress={toggleMic}
                                                />
                                                <MyIconButton
                                                    name="gift-outline"
                                                    onPress={() => {
                                                        setSelectedGiftUser(null);
                                                        setSelectedGift(null);
                                                        giftModalRef.current?.open();
                                                    }}
                                                />
                                                <MyIconButton
                                                    name="emoticon-outline"
                                                    type="material-community"
                                                    onPress={() => emojiSheetRef.current?.open()}
                                                />
                                            </>
                                        )}
                                    </View>
                                </View>
                            )}
                        </>
                    ) : (
                        <ActivityIndicator size="large" color="#25D366" /> // loading spinner
                    )}



                    {/* CUSTOM CHAT INPUT MODAL */}
                    <Modal
                        visible={chatVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setChatVisible(false)}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                            <View style={{ backgroundColor: '#1E1E1E', padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={{ flex: 1, color: '#fff', backgroundColor: '#333', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 }}
                                    placeholder="Type a message..."
                                    placeholderTextColor="#aaa"
                                    value={messageText}
                                    onChangeText={setMessageText}
                                    autoFocus
                                />
                                <TouchableOpacity onPress={() => {
                                    if (messageText.trim().length > 0) {
                                        ZegoUIKit.sendInRoomMessage(messageText);
                                        setMessageText('');
                                        setChatVisible(false);
                                    }
                                }}>
                                    <Ionicons name="send" size={24} color="#007AFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* SUCCESS MODAL */}
                    <Modal
                        visible={successModalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setSuccessModalVisible(false)}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Animated.View
                                style={{
                                    width: width * 0.8,
                                    backgroundColor: '#1E1E1E',
                                    borderRadius: 20,
                                    padding: 20,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#FFD700',
                                    transform: [{ scale: successScale }],
                                    opacity: successOpacity,
                                }}>
                                {/* Header / Icon */}
                                <View
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                        backgroundColor: '#FFD700',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 15,
                                    }}>
                                    <MaterialCommunityIcons
                                        name="check-bold"
                                        size={35}
                                        color="#fff"
                                    />
                                </View>

                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        marginBottom: 10,
                                        textAlign: 'center',
                                    }}>
                                    Gift Sent Successfully!
                                </Text>

                                <Text
                                    style={{
                                        color: '#ccc',
                                        textAlign: 'center',
                                        marginBottom: 20,
                                    }}>
                                    {successData?.message || 'Your gift has been delivered.'}
                                </Text>

                                {/* details from response */}
                                {successData?.gift && (
                                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                        <Image
                                            source={{ uri: successData.gift.image_url }} // Ensure API returns full URL or handle partial
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 10,
                                                resizeMode: 'contain',
                                            }}
                                        />
                                        <Text
                                            style={{
                                                color: '#FFD700',
                                                marginTop: 5,
                                                fontWeight: 'bold',
                                            }}>
                                            Price: {successData.gift.price} Coins
                                        </Text>
                                    </View>
                                )}

                                <TouchableOpacity
                                    onPress={() => setSuccessModalVisible(false)}
                                    style={{
                                        backgroundColor: '#FFD700',
                                        paddingVertical: 10,
                                        paddingHorizontal: 30,
                                        borderRadius: 25,
                                    }}>
                                    <Text
                                        style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                                        OK
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </Modal>

                    {/* Gift Modal using RBSheet */}
                    <RBSheet
                        ref={giftModalRef}
                        height={height * 0.55}
                        openDuration={250}
                        customStyles={{
                            container: {
                                backgroundColor: '#121212', // Match first modal base
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                overflow: 'hidden',
                                paddingTop: 0,
                            },
                            wrapper: {
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }
                        }}
                        onClose={() => setSelectedGift(null)}
                    >
                        <LinearGradient
                            colors={['#1c1c1e', '#000000']}
                            style={{ flex: 1, padding: 12 }}
                        >
                            {/* Header Handle */}
                            <View style={{
                                alignSelf: 'center',
                                width: 40,
                                height: 4,
                                backgroundColor: '#333',
                                borderRadius: 2,
                                marginBottom: 8
                            }} />

                            {/* Title */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}>
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                                    Gift Store
                                </Text>
                            </View>

                            {/* User List Header with Select All */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, paddingHorizontal: 4 }}>
                                <Text
                                    style={{
                                        color: '#999',
                                        fontSize: 11,
                                        fontWeight: '600',
                                    }}>
                                    {selectedGiftUser
                                        ? `To: ${selectedGiftUser.userName}`
                                        : 'Select Recipients'}
                                </Text>

                                {/* SELECT ALL TOGGLE */}
                                <TouchableOpacity
                                    onPress={toggleSelectAll}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: selectAll ? '#FFD700' : 'rgba(255,255,255,0.08)',
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 10,
                                        borderWidth: 1,
                                        borderColor: selectAll ? '#FFD700' : 'rgba(255,255,255,0.1)'
                                    }}>
                                    <Text style={{
                                        color: selectAll ? '#000' : '#ddd',
                                        fontSize: 10,
                                        fontWeight: '700',
                                        marginRight: 4
                                    }}>
                                        ALL
                                    </Text>
                                    <MaterialCommunityIcons
                                        name={selectAll ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                                        size={14}
                                        color={selectAll ? '#000' : '#aaa'}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: 70, marginBottom: 8 }}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {audienceList?.map((user, idx) => {
                                        const isSelected = selectedUsers.some(
                                            u => u.userID === user.userID,
                                        );

                                        return (
                                            <TouchableOpacity
                                                key={user.userID || idx}
                                                onPress={() => toggleUserSelect(user)}
                                                style={{ alignItems: 'center', marginRight: 12 }}>
                                                <Image
                                                    source={
                                                        user.avatar
                                                            ? { uri: `https://mymufo.s3.amazonaws.com/images/${user.avatar}` }
                                                            : require('../Images/dp1.jpg')
                                                    }
                                                    style={{
                                                        width: 45,
                                                        height: 45,
                                                        borderRadius: 22.5,
                                                        borderWidth: isSelected ? 2 : 1,
                                                        borderColor: isSelected ? '#FFD700' : 'rgba(255,255,255,0.15)',
                                                    }}
                                                />
                                                {isSelected && (
                                                    <View style={{
                                                        position: 'absolute',
                                                        bottom: 14,
                                                        right: -2,
                                                        backgroundColor: '#FFD700',
                                                        borderRadius: 8,
                                                        width: 14, height: 14,
                                                        justifyContent: 'center', alignItems: 'center',
                                                        borderWidth: 1, borderColor: '#000'
                                                    }}>
                                                        <MaterialIcons name="check" size={10} color="#000" />
                                                    </View>
                                                )}
                                                <Text style={{ color: isSelected ? '#FFD700' : '#aaa', fontSize: 10, marginTop: 3, fontWeight: isSelected ? '700' : '400', maxWidth: 50 }} numberOfLines={1}>
                                                    {user.userName}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>

                            </View>

                            {/* Categories */}
                            <View style={{ marginBottom: 10, height: 30, width: '100%' }}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {(giftCategories || []).map(cat => (
                                        <TouchableOpacity
                                            key={cat}
                                            onPress={() => setSelectedCategory(cat)}
                                            style={{
                                                paddingVertical: 4,
                                                paddingHorizontal: 14,
                                                marginRight: 6,
                                                borderRadius: 15,
                                                backgroundColor:
                                                    selectedCategory === cat ? '#FFD700' : 'rgba(255, 255, 255, 0.05)',
                                                borderWidth: 1,
                                                borderColor: selectedCategory === cat ? '#FFD700' : 'rgba(255,255,255,0.1)',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                            <Text
                                                style={{
                                                    color: selectedCategory === cat ? '#000' : '#fff',
                                                    fontSize: 11,
                                                    fontWeight: '600',
                                                    textTransform: 'capitalize'
                                                }}>
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>


                            {/* Gift Grid - UPDATED FOR SELECTION */}
                            <ScrollView style={{ flex: 1 }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'flex-start', // Start alignment for smaller cards
                                        gap: 6, // Use gap if supported or handle via margin
                                        paddingHorizontal: 4,
                                    }}>
                                    {filteredGifts?.map((item, idx) => {
                                        const isSelected = selectedGift?.id === item.id;
                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                onPress={() => setSelectedGift(item)}
                                                activeOpacity={0.8}
                                                style={{
                                                    width: '23%', // 4 per row approximately
                                                    height: 100, // Reduced height
                                                    marginBottom: 8,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 4,
                                                    borderRadius: 14,
                                                    borderWidth: 1,
                                                    borderColor: isSelected ? '#FFD700' : 'rgba(255,255,255,0.08)',
                                                    backgroundColor: isSelected ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                                }}>
                                                <Animated.View style={isSelected ? { transform: [{ scale: pulseAnim }] } : {}}>
                                                    <Image
                                                        source={{ uri: `https://mufoapp.com${item.gift_image}` }}
                                                        style={{ width: 58, height: 58, resizeMode: 'contain', marginBottom: 0 }}
                                                    />
                                                </Animated.View>

                                                <View style={{
                                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                                    paddingHorizontal: 6,
                                                    paddingVertical: 2,
                                                    borderRadius: 8,
                                                    marginTop: 'auto'
                                                }}>
                                                    <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
                                                        💰 {item.price}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                {filteredGifts.length === 0 && (
                                    <Text
                                        style={{ color: '#666', textAlign: 'center', marginTop: 40, fontSize: 16 }}>
                                        No gifts found in this category
                                    </Text>
                                )}
                            </ScrollView>

                            {/* Footer */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingVertical: 12,
                                    borderTopWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    marginTop: 5
                                }}>

                                {/* Coins */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255, 215, 0, 0.3)'
                                }}>
                                    <Image
                                        source={require('../Images/coin.png')}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <Text style={{ color: '#FFD700', marginLeft: 8, fontWeight: 'bold', fontSize: 15 }}>
                                        {userCoins}
                                    </Text>
                                </View>

                                {/* Send Button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (selectedGift) {
                                            handleMultiGiftSend(selectedGift);
                                        } else {
                                            Alert.alert('Selection Required', 'Please select a gift to send.');
                                        }
                                    }}
                                    disabled={!selectedGift}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={selectedGift ? ['#FFD700', '#FFA500'] : ['#444', '#333']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{
                                            paddingHorizontal: 32,
                                            paddingVertical: 10,
                                            borderRadius: 25,
                                            shadowColor: selectedGift ? '#FFD700' : '#000',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: selectedGift ? 0.3 : 0.1,
                                            shadowRadius: 5,
                                            elevation: 5,
                                        }}
                                    >
                                        <Text style={{ color: selectedGift ? '#000' : '#888', fontWeight: 'bold', fontSize: 16 }}>
                                            SEND
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                        </LinearGradient>
                    </RBSheet>
                    {/* Gift User List Modal */}
                    <Modal
                        visible={giftUserListVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setGiftUserListVisible(false)}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => setGiftUserListVisible(false)}
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <TouchableWithoutFeedback>
                                <View
                                    style={{
                                        width: '80%',
                                        maxHeight: '60%',
                                        backgroundColor: '#222',
                                        borderRadius: 16,
                                        padding: 16,
                                    }}>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            marginBottom: 12,
                                            textAlign: 'center',
                                        }}>
                                        Select User to Gift
                                    </Text>
                                    <ScrollView style={{ maxHeight: 300 }}>
                                        {audienceList && audienceList.length > 0 ? (
                                            audienceList.map((user, idx) => (
                                                <TouchableOpacity
                                                    key={user.userID || idx}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        paddingVertical: 10,
                                                        borderBottomWidth: 0.5,
                                                        borderColor: '#444',
                                                    }}
                                                    onPress={() => handleOpenGiftModalWithUser(user)}>
                                                    <Image
                                                        source={
                                                            user.avatar
                                                                ? {
                                                                    uri: `https://mymufo.s3.amazonaws.com/images/${user.avatar}`,
                                                                }
                                                                : require('../Images/dp1.jpg')
                                                        }
                                                        style={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: 22,
                                                            borderWidth: 1,
                                                            borderColor: '#FFD700',
                                                            marginRight: 15,
                                                        }}
                                                    />
                                                    <View>
                                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                                            {user.userName}
                                                        </Text>
                                                        <Text style={{ color: '#888', fontSize: 12 }}>
                                                            ID: {user.userID || user.id}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))
                                        ) : (
                                            <Text
                                                style={{
                                                    color: '#fff',
                                                    textAlign: 'center',
                                                    marginTop: 20,
                                                }}>
                                                No users available
                                            </Text>
                                        )}
                                    </ScrollView>
                                    <TouchableOpacity
                                        onPress={() => setGiftUserListVisible(false)}
                                        style={{
                                            marginTop: 16,
                                            alignSelf: 'center',
                                            backgroundColor: '#444',
                                            paddingHorizontal: 24,
                                            paddingVertical: 8,
                                            borderRadius: 8,
                                        }}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>

                    {/* RBSheet for Gift Store - REDESIGNED */}
                    <RBSheet
                        ref={RBSheetRef}
                        height={height * 0.55} // Increased height slightly
                        openDuration={250}
                        customStyles={{
                            container: {
                                backgroundColor: '#121212', // Slightly deeper black
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                overflow: 'hidden',
                                // Add top visual indicator
                                paddingTop: 0,
                            },
                            wrapper: {
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }
                        }}
                        onClose={() => setSelectedGift(null)} // Reset selection on close
                    >
                        {/* GRADIENT HEADER BACKGROUND */}
                        <LinearGradient
                            colors={['#1c1c1e', '#000000']}
                            style={{ flex: 1 }}
                        >
                            <View style={[styles.tabContainer, { borderBottomWidth: 0, paddingBottom: 0, paddingTop: 15 }]}>
                                {/* Visual Handle */}
                                <View style={{
                                    position: 'absolute',
                                    top: 8,
                                    alignSelf: 'center',
                                    width: 40,
                                    height: 4,
                                    backgroundColor: '#333',
                                    borderRadius: 2
                                }} />

                                <TouchableOpacity style={styles.closeButton}>
                                    {/* Placeholder for spacing */}
                                </TouchableOpacity>

                                {/* USER PROFILE SELECTOR BUTTON */}
                                <TouchableOpacity
                                    onPress={() => openProfileSideModal(selectedGiftUser)}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#2A2A2A', '#1A1A1A']}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 16,
                                            paddingVertical: 6,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: '#333',
                                        }}>
                                        <Image
                                            source={selectedGiftUser?.avatar ? { uri: `https://mymufo.s3.amazonaws.com/images/${selectedGiftUser.avatar}` } : require('../Images/dp1.jpg')}
                                            style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: '#fff' }}
                                        />
                                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13, marginRight: 4 }}>
                                            Send to {selectedGiftUser?.userName || 'User'}
                                        </Text>
                                        <MaterialIcons name="keyboard-arrow-down" size={16} color="#888" />
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View style={{ width: 30 }} />
                            </View>

                            <TabView
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                onIndexChange={setIndex}
                                renderTabBar={props => (
                                    <TabBar
                                        {...props}
                                        scrollEnabled
                                        style={{
                                            backgroundColor: 'transparent',
                                            elevation: 0,
                                            shadowOpacity: 0,
                                            marginBottom: 10,
                                            marginTop: 5,
                                        }}
                                        indicatorStyle={{
                                            backgroundColor: '#FFD700',
                                            height: 3,
                                            borderRadius: 1.5,
                                            marginBottom: 5
                                        }}
                                        renderLabel={({ route, focused, color }) => (
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: focused ? '#FFD700' : '#888',
                                                    fontWeight: focused ? '700' : '500',
                                                    fontSize: 13,
                                                    textTransform: 'capitalize'
                                                }}>
                                                {route.title}
                                            </Text>
                                        )}
                                        tabStyle={{
                                            width: 'auto',
                                            paddingHorizontal: 12,
                                            minWidth: 90,
                                        }}
                                    />
                                )}
                            />

                            {/* SEND BUTTON FOOTER */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    borderTopWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.08)',
                                }}>

                                {/* Coins Display */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderRadius: 15,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 215, 0, 0.3)',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Image
                                            source={require('../Images/coin.png')}
                                            style={{ width: 18, height: 18 }}
                                        />
                                        <Text style={{ color: '#FFD700', marginLeft: 6, fontWeight: '700', fontSize: 16 }}>
                                            {userCoins}
                                        </Text>
                                    </View>
                                </View>

                                {/* Send Button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (selectedGift) {
                                            handleGiftSend(selectedGift);
                                        } else {
                                            Alert.alert('Selection Required', 'Please select a gift to send.');
                                        }
                                    }}
                                    disabled={!selectedGift}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={selectedGift ? ['#FFD700', '#FFA500'] : ['#444', '#333']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{
                                            paddingHorizontal: 32,
                                            paddingVertical: 10,
                                            borderRadius: 25,
                                            shadowColor: selectedGift ? '#FFD700' : '#000',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: selectedGift ? 0.3 : 0.1,
                                            shadowRadius: 5,
                                            elevation: 5,
                                        }}
                                    >
                                        <Text style={{ color: selectedGift ? '#000' : '#888', fontWeight: 'bold', fontSize: 16 }}>
                                            SEND
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </RBSheet>

                    {/* EMOJI PICKER SHEET - REDESIGNED */}
                    <RBSheet
                        ref={emojiSheetRef}
                        height={320} // Fixed height for consistency
                        openDuration={250}
                        dragFromTopOnly={true}
                        closeOnDragDown={true}
                        customStyles={{
                            container: {
                                backgroundColor: 'transparent',
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                overflow: 'hidden',
                            },
                            wrapper: {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                            },
                            draggableIcon: {
                                backgroundColor: "rgba(255,255,255,0.3)",
                                width: 40
                            }
                        }}
                    >
                        {/* GLASSMORPHISM BACKGROUND */}
                        <LinearGradient
                            colors={['#1c1c1e', '#000000']}
                            style={{ flex: 1, paddingTop: 10, paddingBottom: 20 }}
                        >
                            <Text style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: '600',
                                marginBottom: 10,
                                textAlign: 'center',
                                opacity: 0.8
                            }}>
                                React with Emoji
                            </Text>

                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={emojiPages}
                                    keyExtractor={(_, i) => i.toString()}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    onMomentumScrollEnd={(ev) => {
                                        const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
                                        setActiveEmojiPage(newIndex);
                                    }}
                                    renderItem={({ item: pageEmojis }) => (
                                        <View style={{ width: width, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'flex-start' }}>
                                            {pageEmojis.map((emoji, idx) => (
                                                <ShakingEmoji
                                                    key={idx}
                                                    emoji={emoji}
                                                    onPress={() => sendEmojiReaction(emoji)}
                                                />
                                            ))}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* Pagination Dots */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                                {emojiPages.map((_, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            width: i === activeEmojiPage ? 8 : 6,
                                            height: i === activeEmojiPage ? 8 : 6,
                                            borderRadius: 4,
                                            backgroundColor: i === activeEmojiPage ? '#FFD700' : 'rgba(255,255,255,0.2)',
                                            marginHorizontal: 4,
                                            alignSelf: 'center'
                                        }}
                                    />
                                ))}
                            </View>
                        </LinearGradient>
                    </RBSheet>

                    {/* Animated Gift */}
                    {animatedGift && (
                        <Animated.Image
                            source={{ uri: `https://mufoapp.com${animatedGift.gift_image}` }}
                            style={{
                                position: 'absolute',
                                bottom: height * 0.25,
                                left: width / 2 - 40,
                                width: 100,
                                height: 100,
                                transform: [{ translateY: rocketTranslateY }, { scale: scaleAnim }],
                                opacity: rocketOpacity,
                            }}
                        />
                    )}

                    {/* setting Model */}

                    <Modal
                        visible={quickToolsVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setQuickToolsVisible(false)}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => setQuickToolsVisible(false)}
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                justifyContent: 'flex-end',
                            }}>
                            <TouchableWithoutFeedback>
                                <View
                                    style={{
                                        width: '100%',
                                        height: '35%',
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        borderTopLeftRadius: 20,
                                        borderTopRightRadius: 20,
                                        paddingTop: 20,
                                        paddingHorizontal: 25,
                                    }}>
                                    {/* TITLE */}
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 16,
                                            fontWeight: '700',
                                            marginBottom: 25,
                                        }}>
                                        Quick Tools
                                    </Text>

                                    {/* GRID ICONS */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 20,
                                            alignContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => setSeatRequestModalVisible(true)}
                                            style={{ alignItems: 'center' }}>
                                            <Icon2
                                                name="user"
                                                size={25}
                                                color={'#3BBEF7'}
                                                style={{ width: 30, height: 30 }}
                                            />
                                            <Text
                                                style={{
                                                    color: '#fff',
                                                    marginTop: 5,
                                                    fontSize: 12,
                                                    fontWeight: 'bold',
                                                }}>
                                                Members
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => {
                                                navigation.navigate('RoomSettings', {
                                                    userID,
                                                    roomID,
                                                    seatRef: prebuiltRef.current,
                                                });
                                            }}
                                            style={{ alignItems: 'center' }}>
                                            <Icon2
                                                name="home"
                                                size={25}
                                                color={'#3BBEF7'}
                                                style={{ width: 30, height: 30 }}
                                            />
                                            <Text
                                                style={{
                                                    color: '#fff',
                                                    marginTop: 5,
                                                    fontSize: 12,
                                                    fontWeight: 'bold',
                                                }}>
                                                Room Settings
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ alignItems: 'center' }}
                                            onPress={() => {
                                                setQuickToolsVisible(false); // Close quick tools
                                                setTimeout(() => setSeatSettingsVisible(true), 300); // Open seat settings
                                            }}
                                        >
                                            <Icon
                                                name="sofa"
                                                size={25}
                                                color={'#3BBEF7'}
                                                style={{ width: 30, height: 30 }}
                                            />
                                            <Text
                                                style={{
                                                    color: '#fff',
                                                    marginTop: 5,
                                                    fontSize: 12,
                                                    fontWeight: 'bold',
                                                }}>
                                                Seat Settings
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setQuickToolsVisible(false); // Close quick tools
                                            }}
                                            style={{ alignItems: 'center', display: 'none' }}>
                                        </TouchableOpacity>
                                    </View>

                                    {/* OTHER TOOLS SECTION */}
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: 'white',
                                            marginBottom: 10,
                                        }}>
                                        Other Tools
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            marginBottom: 30,
                                            alignContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <TouchableOpacity style={{ alignItems: 'center', marginRight: 25 }}
                                            onPress={() => {
                                                setQuickToolsVisible(false);
                                                setTimeout(() => setTimerSettingsVisible(true), 300);
                                            }}
                                        >
                                            {/* Colorful Image for Calculator */}
                                            <View >
                                                <Image
                                                    source={require('../Images/icons.jpg')}
                                                    style={{ width: 35, height: 35, borderRadius: 12 }}
                                                />
                                            </View>
                                            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold', top: 10 }}>Start Calculator</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ alignItems: 'center', marginRight: 25 }}
                                            onPress={() => {
                                                setQuickToolsVisible(false);
                                                setTimeout(() => setMusicModalVisible(true), 300);
                                            }}
                                        >

                                            <View >
                                                <Image
                                                    source={require('../Images/Nic.jpg')}
                                                    style={{ width: 35, height: 35, borderRadius: 12 }}
                                                />
                                            </View>
                                            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold', top: 10 }}>Music</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>

                    {/* Gift confirmation modal */}
                    <Modal transparent visible={giftModalVisible} animationType="fade">
                        <View style={styles.modalContainer}>
                            <Animated.View
                                style={[
                                    styles.modalBox,
                                    { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                                ]}>
                                <Text style={styles.modalText}>{giftModalMessage}</Text>
                            </Animated.View>
                        </View>
                    </Modal>

                    {/* Normal Center Modal  */}
                    <Modal
                        transparent
                        visible={sideModalVisible}
                        animationType="fade"
                        onRequestClose={() => setSideModalVisible(false)}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => setSideModalVisible(false)}
                            style={styles.centerModalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.centerModalContainer}>
                                    {/* ⋮ More Button */}
                                    {myRole === 'creator' && (
                                        <TouchableOpacity
                                            onPress={() => setRoleModalVisible(true)}
                                            style={styles.centerModalClose}>
                                            <MaterialIcons name="more-vert" size={26} color="#000" />
                                        </TouchableOpacity>
                                    )}
                                    {profileLoading ? (
                                        <ActivityIndicator
                                            size="large"
                                            color="#6DD3FF"
                                            style={{ marginTop: 20 }}
                                        />
                                    ) : (
                                        <View style={{ alignItems: 'center', marginTop: 12 }}>
                                            <Image
                                                source={{ uri: profileDetails?.avatar }}
                                                style={styles.profileAvatar}
                                            />
                                            <Text style={styles.profileName}>
                                                {profileDetails?.name}
                                            </Text>
                                            <Text style={styles.profileId}>
                                                ID: {profileDetails?.ID}
                                            </Text>

                                            <View style={styles.hostBadge}>
                                                <Text style={styles.hostText}>
                                                    Lv{profileDetails?.level}
                                                </Text>
                                            </View>

                                            {/* Follower / Following Row */}
                                            <View
                                                style={{
                                                    marginTop: 16,
                                                    width: '80%',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}>
                                                <View style={styles.detailRow}>
                                                    <Text style={styles.detailValue}>
                                                        {profileDetails?.followers}
                                                    </Text>
                                                    <Text style={styles.detailTitle}>Followers</Text>
                                                </View>
                                                <View style={styles.detailRow}>
                                                    <Text style={styles.detailValue}>
                                                        {profileDetails?.following}
                                                    </Text>
                                                    <Text style={styles.detailTitle}>Following</Text>
                                                </View>
                                            </View>

                                            {/* Gift + Chat Icons Row */}
                                            <View style={styles.iconRow}>
                                                <TouchableOpacity
                                                    onPress={() => setSideModalVisible(false)}>
                                                    <Image
                                                        source={require('../Images/giftIcon.png')}
                                                        style={styles.iconButton}
                                                    />
                                                </TouchableOpacity>
                                                <Image
                                                    source={require('../Images/chatIcon.png')}
                                                    style={styles.iconButton}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>

                    {/* inSide Model  */}
                    <Modal
                        transparent
                        visible={roleModalVisible}
                        animationType="fade"
                        onRequestClose={() => setRoleModalVisible(false)}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => setRoleModalVisible(false)}
                            style={styles.centerModalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.roleMenuContainer]}>
                                    <TouchableOpacity
                                        style={styles.roleMenuItem}
                                        onPress={() => handleAssignRole('admin')}>
                                        <MaterialIcons name="security" size={20} color="#333" />
                                        <Text style={styles.roleMenuText}>Set as Admin</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.roleMenuItem}
                                        onPress={() => handleAssignRole('coadmin')}>
                                        <MaterialIcons
                                            name="supervisor-account"
                                            size={20}
                                            color="#333"
                                        />
                                        <Text style={styles.roleMenuText}>Set as Co-Admin</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.roleMenuItem}
                                        onPress={() => {
                                            if (muteUsers.includes(profileDetails?.userID)) {
                                                console.log('profile is already muted');
                                                muteUser1(profileDetails?.userID, false);
                                            } else {
                                                console.log('profile was not muted');
                                                muteUser1(profileDetails?.userID, true);
                                            }
                                        }}>
                                        <MaterialIcons name="mic-off" size={20} color="#333" />
                                        <Text style={styles.roleMenuText}> {'Mute mic'}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.roleMenuItem}
                                        onPress={() => removeUserFromSeat(profileDetails?.userID)}>
                                        <Icon name="sofa" size={20} color="#333" />
                                        <Icon2
                                            name="slash"
                                            size={15}
                                            color="#090909ff"
                                            style={{
                                                position: 'absolute',
                                                left: 16,
                                                top: 12,
                                            }}
                                        />
                                        <Text style={styles.roleMenuText}> Remove from seat</Text>
                                    </TouchableOpacity>

                                    <View style={{ position: 'relative' }}>
                                        <TouchableOpacity
                                            style={styles.roleMenuItem}
                                            onPress={() => setKickoutOptionsVisible(prev => !prev)}>
                                            <MaterialIcons
                                                name="exit-to-app"
                                                size={20}
                                                color="#333"
                                            />
                                            <Text style={[styles.roleMenuText, { color: '#333' }]}>
                                                Kick Out
                                            </Text>
                                        </TouchableOpacity>

                                        {kickoutOptionsVisible && (
                                            <View style={styles.dropdownContainer}>
                                                {[
                                                    { label: '15 Minutes', value: '15m' },
                                                    { label: '30 Minutes', value: '30m' },
                                                    { label: '1 Hour', value: '1h' },
                                                ].map(option => (
                                                    <TouchableOpacity
                                                        key={option.value}
                                                        style={styles.dropdownOption}
                                                        onPress={() => handleKickOut(option.value)}>
                                                        <Text style={styles.dropdownText}>
                                                            {option.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.roleMenuItem}
                                        onPress={() => {
                                            if (blockedUsers.includes(profileDetails?.userID)) {
                                                unblockUser(profileDetails?.userID);
                                            } else {
                                                blockUser(profileDetails?.userID);
                                            }
                                        }}>
                                        <Image
                                            style={{ height: 20, width: 20 }}
                                            source={require('../Images/blockUser.png')}
                                        />
                                        <Text style={[styles.roleMenuText, { color: '#333' }]}>
                                            {blockedUsers.includes(profileDetails?.userID)
                                                ? 'Unblock'
                                                : 'Blacklist'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.roleMenuItem}
                                        onPress={() => setKickoutOptionsVisible(prev => !prev)}>
                                        <MaterialIcons
                                            name="report-problem"
                                            size={20}
                                            color="#333"
                                        />
                                        <Text style={[styles.roleMenuText, { color: '#333' }]}>
                                            Report
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>

                    {/* leaveConfirmationModel */}
                    <Modal transparent visible={leaveConfirmVisible} animationType="fade">
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(46, 45, 45, 0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    width: '75%',
                                    backgroundColor: '#222224ff',
                                    borderRadius: 16,
                                    paddingVertical: 20,
                                    paddingHorizontal: 18,
                                    alignItems: 'center',
                                }}>
                                <Text style={{ fontSize: 32, marginBottom: 6 }}>👋</Text>

                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 16,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        marginBottom: 8,
                                    }}>
                                    Are you sure you want to leave the room?
                                </Text>
                                <Text
                                    style={{
                                        color: '#b3b3b3',
                                        fontSize: 12,
                                        textAlign: 'center',
                                        marginBottom: 18,
                                        lineHeight: 16,
                                    }}>
                                    You will be disconnected from the conversation.
                                </Text>

                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    {/* Cancel */}
                                    <TouchableOpacity
                                        onPress={handleMinimize}
                                        style={{
                                            paddingVertical: 8,
                                            paddingHorizontal: 16,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: '#666',
                                        }}>
                                        <Text
                                            style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                                            Minimize
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Leave */}
                                    <TouchableOpacity
                                        onPress={async () => {
                                            setLeaveConfirmVisible(false);
                                            try {
                                                if (prebuiltRef.current) {
                                                    await prebuiltRef.current.leave();
                                                }
                                            } catch (err) {
                                                console.log('Leave Room Error:', err);
                                            }

                                            if (onClose) {
                                                onClose();
                                            } else if (navigation.canGoBack()) {
                                                navigation.goBack();
                                            } else {
                                                navigation.navigate('Home');
                                            }
                                        }}
                                        style={{
                                            paddingVertical: 8,
                                            paddingHorizontal: 16,
                                            borderRadius: 10,
                                            backgroundColor: '#ff4d4d',
                                        }}>
                                        <Text
                                            style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                                            Leave
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>


                    {/* --- MUSIC PLAYER MODAL --- */}

                    <MusicPlayerModal
                        visible={musicModalVisible}
                        onClose={() => setMusicModalVisible(false)}
                    />

                    {/* BOTTOM SHEET MODAL */}
                    <Modal
                        visible={modalVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}>
                        {/* BACKDROP */}
                        <Pressable
                            style={styles.backdrop}
                            onPress={() => setModalVisible(false)}
                        />

                        <View style={styles.modalBox1}>
                            {/* TOP - ROOM DATA */}
                            <View style={styles.topBox}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            source={{
                                                uri:
                                                    room_Image ||
                                                    'https://cdn-icons-png.flaticon.com/512/2621/2621193.png',
                                            }}
                                            style={styles.roomImage}
                                        />

                                        <View style={{ start: 10 }}>
                                            <Text style={styles.modalRoomName}>{room_name}</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.modalRoomId}>Room ID: </Text>
                                                <Text style={{ color: '#2dbeeaff', fontSize: 12, top: 3 }}>
                                                    {room_id}
                                                </Text>
                                            </View>

                                            <View style={{ paddingTop: 6, alignItems: 'center' }}>
                                                {isHost ? (
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            navigation.navigate('RoomSettings', {
                                                                userID,
                                                                roomID,
                                                            })
                                                        }
                                                        style={{
                                                            backgroundColor: '#a865ff',
                                                            paddingVertical: 5,
                                                            paddingHorizontal: 15,
                                                            borderRadius: 10,
                                                        }}>
                                                        <Text
                                                            style={{
                                                                color: '#fff',
                                                                fontSize: 16,
                                                                fontWeight: 'bold',
                                                            }}>
                                                            Room Settings
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity
                                                        onPress={handleJoin}
                                                        style={{
                                                            backgroundColor: '#25D366',
                                                            paddingVertical: 5,
                                                            paddingHorizontal: 15,
                                                            borderRadius: 10,
                                                        }}>
                                                        <Text
                                                            style={{
                                                                color: '#fff',
                                                                fontSize: 16,
                                                                fontWeight: 'bold',
                                                            }}>
                                                            Join Room
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('roomLevel', { roomID: roomID, level })}
                                        style={{
                                            backgroundColor: '#1ecb8b',
                                            paddingHorizontal: 8,
                                            paddingVertical: 3,
                                            borderRadius: 6,
                                            marginRight: 8,
                                            left: 100,
                                            height: 30
                                        }}>
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                                            Lv {level || 0}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* TABS */}
                            <View style={styles.tabRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.tabBtn,
                                        selectedTab === 'online' && styles.activeTab,
                                    ]}
                                    onPress={() => setSelectedTab('online')}>
                                    <Text
                                        style={[
                                            styles.tabText,
                                            selectedTab === 'online' && styles.activeTabText,
                                        ]}>
                                        Online Users
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.tabBtn,
                                        selectedTab === 'members' && styles.activeTab,
                                    ]}
                                    onPress={() => setSelectedTab('members')}>
                                    <Text
                                        style={[
                                            styles.tabText,
                                            selectedTab === 'members' && styles.activeTabText,
                                        ]}>
                                        Members
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* TAB CONTENT */}
                            <ScrollView style={{ flex: 1 }}>
                                {selectedTab === 'online' ? (
                                    audienceList?.length > 0 ? (
                                        audienceList.map((item, index) => (
                                            <View key={index} style={styles.userRow}>
                                                <Image
                                                    source={
                                                        item.avatar
                                                            ? {
                                                                uri: `https://mymufo.s3.amazonaws.com/images/${item.avatar}`,
                                                            }
                                                            : require('../Images/dp1.jpg')
                                                    }
                                                    style={{
                                                        height: 50,
                                                        width: 50,
                                                        borderRadius: 20,
                                                        borderWidth: 0.9,
                                                        borderColor: '#e9cc3aff',
                                                    }}
                                                />

                                                <FontAwesome
                                                    name={
                                                        item.isMicrophoneOn
                                                            ? 'microphone'
                                                            : 'microphone-slash'
                                                    }
                                                    size={18}
                                                    color={item.isMicrophoneOn ? 'green' : 'red'}
                                                    style={{ bottom: 20, end: 17 }}
                                                />
                                                <View style={{ end: 20 }}>
                                                    <Text style={[styles.userName]}>{item.userName}</Text>
                                                </View>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.emptyTxt}>No online users</Text>
                                    )
                                ) : (
                                    <View style={{ paddingBottom: 0 }}>
                                        {isHost && joinRequests.length > 0 && (
                                            <>
                                                <Text
                                                    style={{
                                                        color: '#080808ff',
                                                        fontSize: 14,
                                                        marginLeft: 10,
                                                        marginBottom: 5,
                                                        fontWeight: 'bold',
                                                    }}>
                                                    Join Requests
                                                </Text>

                                                {joinRequests.map((item, index) => (
                                                    <View key={index} style={styles.userRow}>
                                                        <Image
                                                            source={
                                                                item.user_profile
                                                                    ? { uri: item.user_profile }
                                                                    : require('../Images/dp1.jpg')
                                                            }
                                                            style={{
                                                                height: 50,
                                                                width: 50,
                                                                borderRadius: 20,
                                                                borderWidth: 0.9,
                                                                borderColor: '#e9cc3aff',
                                                            }}
                                                        />

                                                        <View style={{ marginLeft: 10 }}>
                                                            <Text style={styles.userName}>
                                                                {item.user_name}
                                                            </Text>
                                                            <Text style={{ color: '#2dbeeaff' }}>
                                                                ID: {item.user_code}
                                                            </Text>
                                                            <Text style={{ color: 'orange' }}>
                                                                {item.status}
                                                            </Text>
                                                        </View>

                                                        <TouchableOpacity
                                                            onPress={() => handleAccept(item.id)}
                                                            style={{ marginLeft: 'auto', marginRight: 10 }}>
                                                            <FontAwesome
                                                                name="check"
                                                                size={25}
                                                                color="green"
                                                            />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            onPress={() => handleReject(item.id)}>
                                                            <FontAwesome name="close" size={25} color="red" />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </>
                                        )}

                                        <Text
                                            style={{
                                                color: '#0f0f0fff',
                                                fontSize: 13,
                                                marginLeft: 10,
                                                marginBottom: 5,
                                                fontWeight: 'bold',
                                            }}>
                                            Members
                                        </Text>

                                        {members.length > 0 ? (
                                            members.map((m, index) => (
                                                <View key={index} style={styles.userRow}>
                                                    <Image
                                                        source={
                                                            m.profile
                                                                ? { uri: m.profile }
                                                                : require('../Images/dp1.jpg')
                                                        }
                                                        style={{
                                                            height: 50,
                                                            width: 50,
                                                            borderRadius: 20,
                                                            borderWidth: 0.9,
                                                            borderColor: '#e9cc3aff',
                                                        }}
                                                    />

                                                    <View style={{ marginLeft: 10 }}>
                                                        <Text style={styles.userName}>{m.user_name}</Text>
                                                        <Text style={{ color: '#2dbeeaff' }}>
                                                            ID: {m.user_code}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={styles.emptyTxt}>No members available</Text>
                                        )}
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </Modal>

                    <SeatSettingsModal
                        visible={seatSettingsVisible}
                        onClose={() => setSeatSettingsVisible(false)}
                        currentCount={seatCount}
                        roomLevel={level || 0}
                        onSelectLayout={async (count) => {
                            ZegoUIKit.updateRoomProperties({ seat_count: String(count) });
                            setSeatCount(count);
                            await AsyncStorage.setItem(`seat_layout_${roomID}`, String(count));
                            console.log("✅ Seat layout saved locally:", count);
                        }}
                    />

                    <TimerSettingsModal
                        visible={timerSettingsVisible}
                        onClose={() => setTimerSettingsVisible(false)}
                        onSelectNormal={() => {
                            setShowWatchIcon(true);
                            setTimerEndTime(null);
                        }}
                        onSelectDuration={(duration) => {
                            handleStartTimer(duration);
                        }}
                    />
                </View>
            </View>

            <Modal transparent visible={passwordModalVisible} animationType="fade">
                <TouchableWithoutFeedback
                    onPress={() => {
                        setPasswordModalVisible(false);
                        navigation.goBack();
                    }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(177, 175, 175, 0.5)',
                        }}>
                        <TouchableWithoutFeedback>
                            <View
                                style={{
                                    width: '65%',
                                    padding: 20,
                                    backgroundColor: '#0f162b',
                                    borderRadius: 20,
                                }}>
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 20,
                                        textAlign: 'center',
                                        marginBottom: 20,
                                    }}>
                                    Enter Room Password
                                </Text>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 20,
                                    }}>
                                    {[0, 1, 2, 3].map(i => (
                                        <TextInput
                                            key={i}
                                            ref={pinRefs[i]}
                                            maxLength={1}
                                            keyboardType="numeric"
                                            value={userPin[i]}
                                            onChangeText={txt => handleUserPin(txt, i)}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                backgroundColor: '#444',
                                                borderRadius: 10,
                                                textAlign: 'center',
                                                fontSize: 18,
                                                color: '#fff',
                                            }}
                                        />
                                    ))}
                                </View>

                                <TouchableOpacity
                                    onPress={checkEnteredPin}
                                    style={{
                                        backgroundColor: '#f58e28ff',
                                        padding: 5,
                                        borderRadius: 10,
                                        width: '70%',
                                        alignSelf: 'center',
                                    }}>
                                    <Text
                                        style={{ color: '#000', textAlign: 'center', fontSize: 15 }}>
                                        Enter Room
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal visible={showCancelModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text>Cancel seat request?</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setShowCancelModal(false)}>
                                <Text style={styles.noBtn}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    prebuiltRef.current?.cancelSeatTakingRequest();
                                    seatRequestedRef.current = false;
                                    setShowCancelModal(false);
                                    console.log('Seat request cancelled');
                                }}>
                                <Text style={styles.yesBtn}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={seatRequestModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setSeatRequestModalVisible(false)}>
                <View style={styles.backdrop}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setSeatRequestModalVisible(false)}
                    />

                    <View
                        style={[
                            styles.modalBox1,
                            { height: '50%' },
                        ]}>
                        <Text style={styles.modalTitle}>Pending Seat Requests</Text>

                        {seatRequests.length === 0 ? (
                            <Text style={styles.emptyTxt}>No pending requests</Text>
                        ) : (
                            <FlatList
                                data={seatRequests}
                                keyExtractor={(item, index) =>
                                    item.userID?.toString() || index.toString()
                                }
                                renderItem={({ item }) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#eee',
                                        }}>
                                        <Image
                                            source={{
                                                uri: item.avatar || 'https://images.unsplash.com/photo-1766039132515-ea88dc3950bd?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                            }}
                                            style={{
                                                width: 45,
                                                height: 45,
                                                borderRadius: 22,
                                                marginRight: 10,
                                            }}
                                        />

                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    color: '#000',
                                                }}>
                                                {item.userName || 'User'}
                                            </Text>

                                            <Text
                                                style={{
                                                    fontSize: 11,
                                                    color: '#666',
                                                    marginTop: 2,
                                                }}>
                                                ID: {item.userID}
                                            </Text>

                                            <Text style={{ color: 'orange', fontSize: 10 }}>
                                                {item.requestedAt ? getTimeAgo(item.requestedAt) : 'Waiting...'}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#4CAF50',
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 6,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => acceptSeatTakingRequest(item.userID)}>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: '#fff',
                                                    fontWeight: '600',
                                                }}>
                                                Accept
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#ff4d4f',
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 6,
                                                marginLeft: 6,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => cancelSeatTakingRequest(item.userID)}>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: '#fff',
                                                    fontWeight: '600',
                                                }}>
                                                Reject
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </ImageBackground >
    );
};

export default Webrtccompo;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    imagecontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
        marginTop: 0,
    },
    back: { top: 0, tintColor: '#fff', height: 34, width: 34, left: -8 },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingVertical: 8,
        paddingHorizontal: 6,
    },
    closeButton: { paddingHorizontal: 12 },
    image: { flex: 1, justifyContent: 'center' },
    builder: { justifyContent: 'center', alignItems: 'center', top: 70 },
    backcontainer: {
        top: height * 0.02,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: '40%',
    },
    stickerContainer: {
        width: stickerSize,
        height: stickerSize,
        marginBottom: 10,
        padding: 10,
        overflow: 'hidden',
        borderRadius: 8,
    },
    sticker: { width: '100%', height: '100%', borderRadius: 6 },
    stickerPrice: {
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 12,
        color: '#fff',
    },
    giftButtonContainer: {
        position: 'absolute',
        zIndex: 10,
        bottom: 10,
    },
    giftButton: {
        height: 60,
        width: 60,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    avatarBuilder: { width: '100%', height: '100%' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalBox: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        maxWidth: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    modalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    hostBadge: {
        marginTop: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: '#FFD700',
        borderRadius: 12,
    },
    hostBadge1: {
        height: 20,
        width: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        borderWidth: 1,
        borderColor: '#5ad97cff',
        top: 5,
    },
    hostText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
    },
    titleGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginStart: 'auto',
    },
    titleGradientText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    sideModalOverlay: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sideOverlayTouchable: { flex: 1 },
    sideModalContainer: {
        width: Math.min(360, width * 0.86),
        backgroundColor: '#fff',
        shadowColor: '#000',
        elevation: 12,
        paddingBottom: 20,
    },
    sideHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sideHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
    profileAvatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 8,
        backgroundColor: '#ddd',
    },
    profileName: { fontSize: 18, fontWeight: '800', color: '#222' },
    profileId: { fontSize: 12, color: '#666', marginTop: 4 },
    detailRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        alignItems: 'center',
        bottom: 30,
    },
    detailTitle: { fontSize: 14, color: '#666' },
    detailValue: { fontSize: 14, fontWeight: '700', color: '#222' },
    centerModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    centerModalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        elevation: 10,
    },
    centerModalClose: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 4,
        zIndex: 1,
    },
    centerModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
    },
    iconButton: {
        height: 40,
        width: 40,
        borderRadius: 22.5,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    iconImage: {
        height: 35,
        width: 35,
        resizeMode: 'contain',
    },
    roleButton: {
        width: '100%',
        backgroundColor: '#6DD3FF',
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    roleText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 15,
    },
    roomIdContainer: {
        flexDirection: 'column',
        top: height * 0.01,
        left: height * 0.0,
        zIndex: 1,
        backgroundColor: 'rgba(245, 245, 228, 0.5)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    roomIdText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    roleMenuContainer: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 6,
        elevation: 10,
        alignSelf: 'flex-end',
        end: 10,
    },
    roleMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    roleMenuText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
        color: '#333',
    },
    kickoutModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 40,
    },
    kickoutTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },
    kickoutOption: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderColor: '#ccc',
    },
    kickoutText: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
        zIndex: 999,
    },
    dropdownOption: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
    },
    modalBox1: {
        position: 'absolute',
        bottom: 0,
        height: height * 0.7,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
    },
    topBox: {
        marginBottom: 10,
    },
    modalRoomName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalRoomId: {
        fontSize: 14,
        color: '#3d3c3cff',
    },
    hostText1: {
        fontSize: 14,
        color: '#101010ff',
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    tabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderColor: '#007bff',
    },
    tabText: {
        fontSize: 16,
        color: '#555',
    },
    activeTabText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    listItem: {
        fontSize: 16,
        marginVertical: 6,
    },
    emptyTxt: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
    roomImage: {
        height: 80,
        width: 80,
        borderRadius: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginVertical: 6,
        borderRadius: 12,
        borderWidth: 0.7,
        borderColor: '#ddd',
        gap: 10,
    },
    userAvatar: {
        height: 55,
        width: 55,
        borderRadius: 30,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    userId: {
        fontSize: 13,
        color: '#555',
        marginTop: 2,
    },
    userFollowers: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    noBtn: {
        marginRight: 15,
    },
    yesBtn: {
        backgroundColor: '#ff4d4f',
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 6,
    },
});
