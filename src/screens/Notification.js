import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { navigate } from '../navigation/navigationRef';
import notifee, { AndroidImportance } from '@notifee/react-native';
import InAppBanner from './InAppBanner';

const Notification = () => {
  const [inAppData, setInAppData] = useState(null);

  const requestUserPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) getFcmToken();
        } else getFcmToken();
      } else {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) getFcmToken();
      }
    } catch (e) {
      console.log('Permission error:', e);
    }
  };

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('🔥 Generated FCM Token:', token);
        await AsyncStorage.setItem('fcmToken', token);
        sendTokenToServer(token);
      }
    } catch (e) {
      console.log('❌ FCM token error:', e);
    }
  };

  const { token } = React.useContext(
    require('../context/AuthProvider').AuthContext
  );

  useEffect(() => {
    if (token) {
      getFcmToken();
    }
  }, [token]);

  const sendTokenToServer = async fcmToken => {
    try {
      const accessToken = token || await AsyncStorage.getItem('accessToken');
      if (!accessToken) return;

      await axios.patch(
        'http://13.203.232.239:3000/api/auth/save-fcmToken',
        { fcmToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      console.log('Send token error:', e);
    }
  };

  // 🔔 FOREGROUND NOTIFICATION
  const showBanner = async remoteMessage => {
    const { notification, data } = remoteMessage;
    if (!notification) return;

    // ✅ IN-APP notification (ALL types)
    setInAppData({
      title: notification.title || 'Notification',
      body: notification.body || '',
      type: data?.type,
      data,
    });

    // ✅ EXISTING native notification (same as before)
    if (Platform.OS === 'android') {
      try {
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
          title: notification.title,
          body: notification.body,
          android: {
            channelId,
            largeIcon: 'ic_largeicon',
            smallIcon: 'ic_notification',
            color: '#f094fb',
          },
        });
      } catch (err) {
        console.log('Notifee error:', err);
      }
    }
  };

  const handleNavigation = remoteMessage => {
    const type = remoteMessage?.data?.type;

    if (type === 'FRIEND_REQUEST' || type === 'ADD_FRIEND') {
      navigate('GameNotifications');
    } else {
      // ✅ Fallback for Admin / Other Notifications
      navigate('GameNotifications');
    }
  };

  useEffect(() => {
    requestUserPermission();

    const unsubscribeForeground = messaging().onMessage(showBanner);
    const unsubscribeBackground =
      messaging().onNotificationOpenedApp(handleNavigation);

    const unsubscribeToken = messaging().onTokenRefresh(token =>
      sendTokenToServer(token),
    );

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeToken();
    };
  }, []);

  return (
    <>
      {inAppData && (
        <InAppBanner
          title={inAppData.title}
          body={inAppData.body}
          onHide={() => setInAppData(null)}
        />
      )}
    </>
  );
};

export default Notification;
