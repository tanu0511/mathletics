// BadgeSocketService.js
// 🏅 Manages the dedicated badge socket — separate from PVP socket
// Purpose: Handle real-time and offline badge delivery per the FRONTEND_BADGE_SOCKET_GUIDE
//
// Usage:
//   import { initBadgeSocket, getBadgeSocket, destroyBadgeSocket } from './BadgeSocketService';
//   initBadgeSocket(userId, callbacks);

import io from 'socket.io-client';

const BADGE_SERVER_URL = 'http://13.203.232.239:3000'; // ✅ Same server, separate socket for badges only

let badgeSocket = null;
let isRegistered = false;

/**
 * Initialize and connect the badge socket for a given user.
 * Per guide: Call this after user is authenticated (e.g., after login).
 *
 * ✅ Step 1: Initialize socket.io-client connection
 * ✅ Step 2: Handle connection/disconnection lifecycle
 * ✅ Step 3: Auto-reconnect with exponential backoff (5 retries, 1-5s delay)
 * ✅ Step 4: Re-register on reconnect
 *
 * @param {string} userId - The user's MongoDB ID
 * @param {object} [callbacks] - Optional event handlers
 * @param {function} callbacks.onBadgeEarned - Called with badge(s) when earned (user online)
 * @param {function} callbacks.onOfflineBadges - Called with array of offline badges on reconnect
 * @param {function} callbacks.onError - Called with error message on error
 * @returns {object} socket instance
 */
export function initBadgeSocket(userId, callbacks = {}) {
  if (!userId) {
    console.error('[🏅 BadgeSocket] ❌ Missing userId — cannot initialize badge socket');
    return null;
  }

  if (badgeSocket?.connected && isRegistered) {
    // Already connected and registered — just ensure active
    console.log('[🏅 BadgeSocket] ✅ Already connected & registered. Skipping re-init.');
    return badgeSocket;
  }

  console.log('[🏅 BadgeSocket] 🔌 Initializing socket for userId:', userId);

  // ── INITIALIZATION: Create socket with auto-reconnect ──────────────────
  badgeSocket = io(BADGE_SERVER_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,           // ✅ Guide requirement: 5 retries
    reconnectionDelay: 1000,           // ✅ Guide requirement: 1-5s delay (exponential)
    reconnectionDelayMax: 5000,
    query: { userId },                 // Pass userId in connection query
  });

  // 🔍 DEBUG: Log ALL events received on badge socket
  badgeSocket.onAny((eventName, ...args) => {
    console.log('[🔌 BadgeSocket RAW EVENT]', eventName, JSON.stringify(args).substring(0, 200));
  });

  // ── CONNECTION: Listen for successful connection ──────────────────────
  badgeSocket.on('connect', () => {
    console.log('[🏅 BadgeSocket] ✅ Socket CONNECTED. ID:', badgeSocket.id);
    console.log('[🏅 BadgeSocket] 📤 NOW emitting register-badge-socket...');
    // Emit registration immediately
    emitRegisterBadgeSocket(userId);
  });

  // ── REGISTRATION: Confirms badge socket is registered ─────────────────
  badgeSocket.on('badge-socket-registered', (data) => {
    isRegistered = true;
    console.log('[🏅 BadgeSocket] ✅ REGISTERED! Success:', data?.success);
    console.log('[🏅 BadgeSocket] 📋 Registration data:', JSON.stringify(data));
    if (data?.offlineBadgesCount > 0) {
      console.log(`[🏅 BadgeSocket] 📦 Expecting ${data.offlineBadgesCount} offline badge(s)...`);
    }
  });

  // ── REAL-TIME: Badge earned while user online ────────────────────────
  badgeSocket.on('badge:earned', (data) => {
    console.log('[🏅 BadgeSocket] 🎉🎉🎉 badge:earned EVENT RECEIVED!');
    console.log('[🏅 BadgeSocket] 📊 Raw data:', JSON.stringify(data));
    
    try {
      // Handle both single badge and array formats
      const badges = Array.isArray(data) ? data : data?.badges ? data.badges : [data];
      
      console.log('[🏅 BadgeSocket] 📊 Parsed to', badges.length, 'badge(s)');
      
      if (!Array.isArray(badges) || badges.length === 0) {
        console.warn('[🏅 BadgeSocket] ⚠️ Invalid badge data format:', data);
        return;
      }

      // Call callback for each badge or as array
      if (callbacks?.onBadgeEarned) {
        console.log('[🏅 BadgeSocket] ✅ Callback onBadgeEarned exists - delivering badges');
        badges.forEach(badge => {
          console.log(`[🏅 BadgeSocket] 🎯 Delivering:`, badge?.title || badge?.badgeId);
          callbacks.onBadgeEarned(badge);
        });
        
        // ✅ NEW: Emit badges:seen after showing the badge
        const badgeIds = badges.map(b => b.badgeId).filter(Boolean);
        if (badgeIds.length > 0) {
          console.log('[🏅 BadgeSocket] 📤 Emitting badges:seen for:', badgeIds);
          badgeSocket.emit('badges:seen', { badgeIds });
        }
      } else {
        console.warn('[🏅 BadgeSocket] ⚠️ No onBadgeEarned callback!');
      }
    } catch (error) {
      console.error('[🏅 BadgeSocket] ❌ Error:', error);
      if (callbacks?.onError) callbacks.onError(`Failed to process badge: ${error.message}`);
    }
  });

  // ── OFFLINE: Badges earned while user was disconnected ────────────────
  badgeSocket.on('badges:offline', (data) => {
    console.log('[🏅 BadgeSocket] 📭 badges:offline event received:', data);
    
    try {
      const badges = data?.badges || [];
      
      if (!Array.isArray(badges)) {
        console.warn('[🏅 BadgeSocket] ⚠️ Invalid offline badges format:', data);
        return;
      }

      if (badges.length > 0) {
        console.log(`[🏅 BadgeSocket] 📬 ${badges.length} offline badge(s) to display`);
        if (callbacks?.onOfflineBadges) {
          callbacks.onOfflineBadges(badges);
          
          // ✅ NEW: Emit badges:seen after showing offline badges
          const badgeIds = badges.map(b => b.badgeId).filter(Boolean);
          if (badgeIds.length > 0) {
            console.log('[🏅 BadgeSocket] 📤 Emitting badges:seen for offline badges:', badgeIds);
            badgeSocket.emit('badges:seen', { badgeIds });
          }
        }
      }
    } catch (error) {
      console.error('[🏅 BadgeSocket] ❌ Error processing badges:offline:', error);
      if (callbacks?.onError) callbacks.onError(`Failed to process offline badges: ${error.message}`);
    }
  });

  // ── ERROR: Handle socket errors ───────────────────────────────────────
  badgeSocket.on('badge-socket-error', (data) => {
    const message = data?.message || 'Unknown badge socket error';
    console.error('[🏅 BadgeSocket] ❌ Error:', message);
    if (callbacks?.onError) callbacks.onError(message);
  });

  // ── DISCONNECT: Handle disconnection ──────────────────────────────────
  badgeSocket.on('disconnect', (reason) => {
    isRegistered = false;
    console.log('[🏅 BadgeSocket] 🔌 Disconnected. Reason:', reason);
    // Will auto-reconnect if reconnectionAttempts not exceeded
  });

  // ── CONNECTION ERROR: Handle connection failures ──────────────────────
  badgeSocket.on('connect_error', (err) => {
    console.error('[🏅 BadgeSocket] ❌ Connection error:', err?.message);
    if (callbacks?.onError) callbacks.onError(`Connection failed: ${err?.message}`);
  });

  // ── RECONNECT: Auto re-register after reconnection ────────────────────
  badgeSocket.on('reconnect', () => {
    console.log('[🏅 BadgeSocket] 🔄 Reconnected! Re-registering...');
    isRegistered = false; // Reset flag
    emitRegisterBadgeSocket(userId);
  });

  return badgeSocket;
}

/**
 * Emit the registration event to backend.
 * Per guide: Must emit 'register-badge-socket' with userId after connection.
 */
function emitRegisterBadgeSocket(userId) {
  if (!badgeSocket?.connected) {
    console.warn('[🏅 BadgeSocket] ⚠️ Socket not connected, cannot register');
    return;
  }
  console.log('[🏅 BadgeSocket] 📤📤📤 EMITTING register-badge-socket with userId:', userId);
  badgeSocket.emit('register-badge-socket', { userId });
  console.log('[🏅 BadgeSocket] ✅ Emit call completed');
}

/**
 * Get the active badge socket instance.
 * Returns null if not initialized or disconnected.
 */
export function getBadgeSocket() {
  return badgeSocket?.connected ? badgeSocket : null;
}

/**
 * Check if badge socket is connected and registered.
 */
export function isBadgeSocketReady() {
  return badgeSocket?.connected && isRegistered;
}

/**
 * Disconnect and clean up badge socket.
 * Per guide: Call on logout or when leaving the app.
 */
export function destroyBadgeSocket() {
  if (badgeSocket) {
    console.log('[🏅 BadgeSocket] 🧹 Cleaning up badge socket...');
    badgeSocket.removeAllListeners();
    badgeSocket.disconnect();
    badgeSocket = null;
    isRegistered = false;
    console.log('[🏅 BadgeSocket] ✅ Badge socket destroyed.');
  }
}