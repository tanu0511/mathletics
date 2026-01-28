# 🎮 PVP Game Socket Events - Frontend Developer Guide

## 📌 Quick Navigation

- [Setup & Connection](#setup--connection)
- [Player Registration](#player-registration)
- [Lobby & Matchmaking](#lobby--matchmaking)
- [Game State](#game-state)
- [Answers & Scoring](#answers--scoring)
- [Emojis & Reactions](#emojis--reactions)
- [Disconnection & Reconnection](#disconnection--reconnection)
- [Post-Game & Rematch](#post-game--rematch)
- [Challenges](#challenges)

---

## Setup & Connection

### Initial Socket Connection

```javascript
import io from "socket.io-client";

const socket = io("http://your-backend-url", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// Listen for connection events
socket.on("connect", () => {
  console.log("✅ Connected to server");
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("⚠️ Connection error:", error);
});
```

---

## Player Registration

### Register Player Event

**👤 Purpose:** Register player when app starts

**📤 Client sends:**

```javascript
socket.emit("register-player", {
  // MANDATORY
  name: "PlayerName", // String: Player's display name
  userId: "user123", // String: Unique user ID from auth

  // OPTIONAL
  profilePic: "https://...", // String: Player profile image URL
  level: 5, // Number: Player level
  rating: 1200, // Number: Player rating/ELO
});
```

**📥 Server responds:**

```javascript
socket.on("player-registered", (data) => {
  console.log("✅ Player registered:", data);
  // data = {
  //   playerId: "...",
  //   socketId: "socket_id",
  //   name: "PlayerName",
  //   status: "online"
  // }
});
```

**Error handling:**

```javascript
socket.on("error", (data) => {
  console.log("❌ Error:", data.message);
  // Possible errors: Invalid name, User already registered, etc.
});
```

---

## Lobby & Matchmaking

### Join Lobby (Matchmaking Queue)

**👥 Purpose:** Enter matchmaking queue to find opponent

**📤 Client sends:**

```javascript
socket.emit("join-lobby", {
  // MANDATORY
  difficulty: "easy", // String: "easy" | "medium" | "hard"

  // OPTIONAL
  preferredOpponentLevel: 5, // Number: Preferred player level (ignored if not available)
  maxWaitTime: 30000, // Number: Max milliseconds to wait (default: 30000)
});
```

**📥 Server responds - Step 1 (Joined):**

```javascript
socket.on("lobby-joined", (data) => {
  console.log("✅ Joined lobby, waiting for opponent...");
  // data = {
  //   roomId: "room_123",
  //   joinedAt: timestamp,
  //   difficulty: "easy",
  //   status: "waiting"
  // }
  // Show "Searching for opponent..." message
});
```

**📥 Server responds - Step 2 (Match Found):**

```javascript
socket.on("match-found", (data) => {
  console.log("✅ Match found!");
  // data = {
  //   roomId: "room_123",
  //   opponentId: "opponent_id",
  //   opponentName: "OpponentName",
  //   opponentProfilePic: "https://...",
  //   opponentRating: 1250,
  //   status: "match_found"
  // }
  // Show "Match found!" screen with opponent info
});
```

**📥 Server responds - Step 3 (Game Started):**

```javascript
socket.on("game-started", (data) => {
  console.log("✅ Game started!");
  // data = {
  //   roomId: "room_123",
  //   gameId: "game_id",
  //   player1: { id: "...", name: "...", score: 0 },
  //   player2: { id: "...", name: "...", score: 0 },
  //   firstQuestion: { question, options, id, type, difficulty },
  //   timer: 30,
  //   totalQuestions: 10
  // }
  // Navigate to game screen, show first question
});
```

**Error handling:**

```javascript
socket.on("error", (data) => {
  console.log("❌ Error:", data.message);
  // Possible errors: Invalid difficulty, Already in game, etc.
});
```

### Cancel Matchmaking

**👥 Purpose:** Leave queue before match is found

**📤 Client sends:**

```javascript
socket.emit("cancel_search");
// No parameters needed
```

**📥 Server responds:**

```javascript
socket.on("search-cancelled", (data) => {
  console.log("✅ Matchmaking cancelled");
  // data = {
  //   status: "cancelled",
  //   message: "Search cancelled successfully"
  // }
});
```

### Get Queue Status

**👥 Purpose:** Check current queue position and wait time

**📤 Client sends:**

```javascript
socket.emit("get-queue-status");
// No parameters needed
```

**📥 Server responds:**

```javascript
socket.on("queue-status", (data) => {
  console.log("📊 Queue status:", data);
  // data = {
  //   position: 5,                 // Your position in queue
  //   estimatedWaitTime: 15000,    // Estimated wait in ms
  //   totalInQueue: 24,            // Total players waiting
  //   status: "waiting"
  // }
});
```

---

## Game State

### Submit Answer

**❓ Purpose:** Submit answer to current question

**📤 Client sends:**

```javascript
socket.emit("submit-answer", {
  // MANDATORY
  answer: "4", // String: Selected option (usually index or value)
  timeSpent: 5000, // Number: Time spent on question in milliseconds
});
```

**📥 Server responds (no direct response, see next-question):**

```javascript
// Answer is processed, next question comes via next-question event
```

**Opponent gets score update:**

```javascript
socket.on("opponent-score-update", (data) => {
  console.log("📊 Opponent answered");
  // data = {
  //   opponentId: "opponent_id",
  //   score: 20,                       // Updated opponent score
  //   correctAnswers: 2,               // Total correct answers
  //   streak: 2                        // Correct answer streak (optional)
  // }
  // Update opponent's score on screen
});
```

### Next Question Event

**❓ Purpose:** Receive next question from server

**📥 Server sends automatically after answer:**

```javascript
socket.on("next-question", (data) => {
  console.log("❓ Next question:", data);
  // data = {
  //   questionId: "q_123",
  //   question: "What is 2+2?",
  //   options: ["1", "2", "3", "4"],
  //   type: "mcq",                      // Question type
  //   difficulty: "easy",
  //   timer: 30,                        // Time limit in seconds
  //   questionNumber: 1,                // Current question number
  //   totalQuestions: 10
  // }
  // Display new question on screen
});
```

### Get Game State

**🎮 Purpose:** Get current game status (use when reconnecting)

**📤 Client sends:**

```javascript
socket.emit("get-game-state");
// No parameters needed
```

**📥 Server responds:**

```javascript
socket.on("game-state-update", (data) => {
  console.log("🎮 Current game state:", data);
  // data = {
  //   roomId: "room_123",
  //   player1: { id: "...", name: "...", score: 20, correctAnswers: 2 },
  //   player2: { id: "...", name: "...", score: 15, correctAnswers: 1 },
  //   currentQuestion: { question, options, id },
  //   timer: 25,                       // Remaining seconds
  //   questionNumber: 3,
  //   totalQuestions: 10,
  //   gameStatus: "active"
  // }
});
```

---

## Emojis & Reactions

### Send Emoji

**😊 Purpose:** Send reaction emoji during active game

**📤 Client sends:**

```javascript
socket.emit("send-emoji", {
  // MANDATORY
  emoji: "🔥", // String: One emoji from allowed list
});
// Allowed: 😄 🔥 🎯 😅 👏 💪 ⚡ 🚀
```

**📥 Server validates and sends to opponent:**

```javascript
socket.on("opponent-emoji-received", (data) => {
  console.log("😊 Opponent sent emoji:", data);
  // data = {
  //   emoji: "🔥",
  //   fromPlayer: "OpponentName",
  //   timestamp: "2024-01-21T10:30:45Z"
  // }
  // Show emoji floating on screen with player name
});
```

**Error: Invalid Emoji**

```javascript
socket.on("emoji-invalid", (data) => {
  console.log("⚠️ Invalid emoji:", data);
  // data = {
  //   message: "Invalid emoji. Use one of: 😄 🔥 🎯 😅 👏 💪 ⚡ 🚀",
  //   emoji: "❌"  // What was sent
  // }
  // Show error toast
});
```

**Error: Rate Limited**

```javascript
socket.on("emoji-rate-limited", (data) => {
  console.log("⏳ Too many emojis:", data);
  // data = {
  //   message: "Too many emojis. Wait 2s before sending another."
  // }
  // Show warning, disable emoji button for 2 seconds
});
```

**🎯 Implementation Tips:**

- Allowed emojis: `['😄', '🔥', '🎯', '😅', '👏', '💪', '⚡', '🚀']`
- Rate limit: Maximum 1 emoji every 2 seconds per player
- Disable emoji button for 2 seconds after sending
- Show animation/float emoji on screen
- Display opponent name with emoji

---

## Disconnection & Reconnection

### Handle Disconnection

**🔌 Purpose:** Handle player going offline

```javascript
socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
  if (reason === "io server disconnect") {
    // Server closed connection
    showAlert("Connection closed by server. Attempting to reconnect...");
  } else if (reason === "io client disconnect") {
    // Client closed connection
    showAlert("You closed the connection.");
  } else {
    // Network issue
    showAlert("Connection lost. Attempting to reconnect...");
  }
});
```

### Grace Period - Disconnection Notification

**⏳ Purpose:** Opponent notified when you disconnect (during active game)

**📥 Server sends to opponent:**

```javascript
socket.on("game-in-grace-period", (data) => {
  console.log("⏳ Opponent disconnected (15 second grace period):", data);
  // data = {
  //   disconnectedPlayerId: "player_id",
  //   disconnectedPlayerName: "PlayerName",
  //   graceCountdown: 15,              // Seconds remaining
  //   message: "Opponent disconnected. Waiting for reconnection..."
  // }
  // Show countdown timer on opponent's slot
  // Display message: "Waiting for opponent to reconnect..."
});
```

### Reconnect to Active Game

**🔌 Purpose:** Reconnect during grace period (15 seconds)

**📤 Client sends:**

```javascript
socket.emit("reconnect-to-game", {
  // MANDATORY
  roomId: "room_123", // String: Game room ID
  gameId: "game_id", // String: Game ID
});
```

**📥 Server responds - Success:**

```javascript
socket.on("game-reconnected", (data) => {
  console.log("✅ Reconnected to game!");
  // data = {
  //   roomId: "room_123",
  //   gameId: "game_id",
  //   currentQuestion: { question, options, id },
  //   player1: { score: 20, correctAnswers: 2 },
  //   player2: { score: 15, correctAnswers: 1 },
  //   timer: 20,
  //   questionNumber: 3,
  //   status: "game_resumed"
  // }
  // Resume game with current state
});
```

**📥 Server responds - Failure (grace period expired):**

```javascript
socket.on("reconnect-failed", (data) => {
  console.log("❌ Reconnection failed:", data);
  // data = {
  //   reason: "grace_period_expired",
  //   message: "Grace period has expired. Game ended.",
  //   winnerName: "OpponentName",
  //   status: "game_ended"
  // }
  // Show "Game ended" screen with reason
});
```

**📥 Opponent notified of your reconnection:**

```javascript
socket.on("opponent-reconnected", (data) => {
  console.log("✅ Opponent reconnected!");
  // data = {
  //   opponentId: "player_id",
  //   opponentName: "PlayerName",
  //   message: "Opponent has reconnected"
  // }
  // Remove countdown timer, show normal opponent interface
});
```

**📥 Game end notification (if grace period expires):**

```javascript
socket.on("grace-period-expired", (data) => {
  console.log("⏳ Grace period expired - you lost!");
  // data = {
  //   reason: "opponent_disconnected",
  //   winnerName: "YourName",
  //   message: "Opponent did not reconnect in time",
  //   winningScore: 25
  // }
  // Show game over screen
});
```

---

## Post-Game & Rematch

### Game Ended Event

**🏁 Purpose:** Notify when game finishes (15 questions answered or time up)

**📤 Client sends:**

```javascript
socket.emit("game-ended");
// No parameters needed (client-side trigger)
```

**📥 Server sends to both players:**

```javascript
socket.on("post-game-started", (data) => {
  console.log("🏁 Game ended, entering post-game lobby:", data);
  // data = {
  //   roomId: "room_123",
  //   gameId: "game_id",
  //   player1: {
  //     id: "...",
  //     name: "Player1",
  //     score: 50,
  //     correctAnswers: 8,
  //     ratingChange: +25
  //   },
  //   player2: {
  //     id: "...",
  //     name: "Player2",
  //     score: 45,
  //     correctAnswers: 7,
  //     ratingChange: -15
  //   },
  //   winner: "Player1",
  //   gameStats: {
  //     duration: 300,               // Seconds
  //     totalQuestions: 15,
  //     difficulty: "medium",
  //     endReason: "all_questions_answered"
  //   },
  //   timestamp: "2024-01-21T10:45:00Z"
  // }
  // Navigate to post-game screen
  // Show winner, scores, rating changes
});
```

### Request Rematch

**🎮 Purpose:** Ask opponent to play again

**📤 Client sends:**

```javascript
socket.emit("request-rematch");
// No parameters needed
```

**📥 Opponent gets notification:**

```javascript
socket.on("rematch-requested", (data) => {
  console.log("🎮 Rematch requested by opponent:", data);
  // data = {
  //   requesterName: "OpponentName",
  //   message: "Player wants to play again!",
  //   expiresIn: 60                  // Seconds before request expires
  // }
  // Show "Accept/Decline Rematch" buttons
});
```

### Get Rematch Status

**🎮 Purpose:** Check if both players accepted rematch

**📤 Client sends:**

```javascript
socket.emit("get-rematch-status");
// No parameters needed
```

**📥 Server responds:**

```javascript
socket.on("rematch-status-update", (data) => {
  console.log("🎮 Rematch status:", data);
  // data = {
  //   player1Accepted: true,           // Boolean
  //   player2Accepted: false,          // Boolean
  //   bothAccepted: false,             // Boolean
  //   currentPlayerId: "player_id",
  //   message: "Waiting for opponent..."
  // }
});
```

### Accept Rematch

**🎮 Purpose:** Accept opponent's rematch request

**📤 Client sends:**

```javascript
socket.emit("accept-rematch");
// No parameters needed
```

**📥 Both players get notification:**

```javascript
socket.on("rematch-accepted", (data) => {
  console.log("✅ Rematch accepted! Starting new game...", data);
  // data = {
  //   status: "rematch_starting",
  //   message: "Both players accepted! Game starting in 3 seconds...",
  //   countdownSeconds: 3,
  //   newRoomId: "room_456"           // New room for rematch
  // }
  // Show countdown "3...2...1... Game Starting!"
  // After countdown, receive new game-started event
});
```

### Decline Rematch

**🎮 Purpose:** Reject opponent's rematch request

**📤 Client sends:**

```javascript
socket.emit("decline-rematch");
// No parameters needed
```

**📥 Opponent gets notification:**

```javascript
socket.on("rematch-declined", (data) => {
  console.log("❌ Rematch declined by opponent:", data);
  // data = {
  //   status: "rematch_declined",
  //   message: "Opponent declined rematch",
  //   declinedByName: "PlayerName"
  // }
  // Show message, show "Exit" button only
});
```

### Exit Post-Game Lobby

**🏁 Purpose:** Leave post-game lobby without rematch

**📤 Client sends:**

```javascript
socket.emit("exit-post-game");
// No parameters needed
```

**📥 Server responds:**

```javascript
socket.on("exited-post-game", (data) => {
  console.log("✅ Exited post-game lobby:", data);
  // data = {
  //   status: "exited",
  //   message: "You have left the post-game lobby"
  // }
  // Navigate back to main menu/lobby
});
```

**📥 Opponent gets notification:**

```javascript
socket.on("opponent-left-lobby", (data) => {
  console.log("❌ Opponent left lobby:", data);
  // data = {
  //   opponentName: "PlayerName",
  //   message: "Opponent has left the lobby"
  // }
  // Show message, allow player to exit
});
```

---

## Challenges (Friend/Specific Opponent)

### Send Challenge

**👤 Purpose:** Send challenge to specific friend/player

**📤 Client sends:**

```javascript
socket.emit("send-challenge", {
  // MANDATORY
  recipientId: "friend_user_id", // String: User ID of friend

  // OPTIONAL
  difficulty: "easy", // String: Challenge difficulty (default: medium)
  expiresInHours: 24, // Number: Challenge expiry (default: 24)
  message: "Can you beat me?", // String: Custom message
});
```

**📥 Server responds (sender):**

```javascript
socket.on("challenge-sent-success", (data) => {
  console.log("✅ Challenge sent:", data);
  // data = {
  //   challengeId: "challenge_123",
  //   recipientName: "FriendName",
  //   sentAt: timestamp,
  //   expiresAt: timestamp,
  //   status: "pending"
  // }
});
```

**📥 Recipient gets notification (if online):**

```javascript
socket.on("challenge-received", (data) => {
  console.log("📨 Challenge received:", data);
  // data = {
  //   challengeId: "challenge_123",
  //   senderName: "PlayerName",
  //   senderProfilePic: "https://...",
  //   difficulty: "easy",
  //   message: "Can you beat me?",
  //   expiresInMinutes: 1440
  // }
  // Show challenge notification
});
```

**Error handling:**

```javascript
socket.on("challenge-error", (data) => {
  console.log("❌ Error:", data.message);
  // Possible errors: Player not found, Already in game, etc.
});
```

### Accept Challenge

**👤 Purpose:** Accept sent challenge

**📤 Client sends:**

```javascript
socket.emit("accept-challenge", {
  // MANDATORY
  challengeId: "challenge_123", // String: Challenge ID
});
```

**📥 Server responds - Success:**

```javascript
socket.on("challenge-accepted-success", (data) => {
  console.log("✅ Challenge accepted, starting game:", data);
  // data = {
  //   challengeId: "challenge_123",
  //   roomId: "room_789",
  //   opponent: {
  //     id: "...",
  //     name: "PlayerName",
  //     rating: 1200
  //   },
  //   firstQuestion: { question, options, id },
  //   timer: 30
  // }
  // Start game immediately with opponent
});
```

### Decline Challenge

**👤 Purpose:** Reject sent challenge

**📤 Client sends:**

```javascript
socket.emit("decline-challenge", {
  // MANDATORY
  challengeId: "challenge_123", // String: Challenge ID
});
```

**📥 Server responds:**

```javascript
socket.on("challenge-declined-success", (data) => {
  console.log("✅ Challenge declined:", data);
  // data = {
  //   challengeId: "challenge_123",
  //   status: "declined"
  // }
});
```

**Sender gets notification:**

```javascript
socket.on("challenge-declined", (data) => {
  console.log("❌ Challenge declined:", data);
  // data = {
  //   challengeId: "challenge_123",
  //   declinedByName: "PlayerName",
  //   message: "Player declined your challenge"
  // }
});
```

### Cancel Challenge

**👤 Purpose:** Cancel challenge you sent (if not accepted yet)

**📤 Client sends:**

```javascript
socket.emit("cancel-challenge", {
  // MANDATORY
  challengeId: "challenge_123", // String: Challenge ID
});
```

**📥 Server responds:**

```javascript
socket.on("challenge-cancelled-success", (data) => {
  console.log("✅ Challenge cancelled:", data);
  // data = {
  //   challengeId: "challenge_123",
  //   status: "cancelled"
  // }
});
```

### Get My Challenges

**📋 Purpose:** Get all challenges sent to you (pending/active)

**📤 Client sends:**

```javascript
socket.emit("get-my-challenges");
// No parameters needed
```

**📥 Server responds:**

```javascript
socket.on("my-challenges", (data) => {
  console.log("📋 Your challenges:", data);
  // data = {
  //   challenges: [
  //     {
  //       id: "challenge_1",
  //       from: "PlayerName",
  //       difficulty: "easy",
  //       expiresIn: 3600,             // Seconds
  //       status: "pending"
  //     },
  //     // ... more challenges
  //   ],
  //   totalCount: 3
  // }
  // Show list of challenges to accept/decline
});
```

### Get Challenge Stats

**📊 Purpose:** Get statistics about challenges (accepted/declined/etc)

**📤 Client sends:**

```javascript
socket.emit("get-challenge-stats");
// No parameters needed
```

**📥 Server responds:**

```javascript
socket.on("challenge-stats", (data) => {
  console.log("📊 Challenge statistics:", data);
  // data = {
  //   sent: 5,
  //   accepted: 3,
  //   declined: 1,
  //   pending: 1,
  //   won: 2,
  //   lost: 1
  // }
  // Show stats on profile/dashboard
});
```

---

## 📋 Common Implementation Patterns

### Complete Game Flow (Matchmaking)

```javascript
// Step 1: Register player on app start
socket.emit("register-player", {
  name: "MyName",
  userId: "user_id",
});

socket.on("player-registered", () => {
  // Step 2: Join lobby to find opponent
  socket.emit("join-lobby", { difficulty: "easy" });
});

socket.on("lobby-joined", () => {
  // Show "Searching..." screen
});

socket.on("match-found", (data) => {
  // Show opponent info
});

socket.on("game-started", (data) => {
  // Navigate to game screen, show first question
});

// During game
socket.on("next-question", (data) => {
  // Display question
});

// When player answers
socket.emit("submit-answer", {
  answer: "4",
  timeSpent: 5000,
});

// When opponent answers
socket.on("opponent-score-update", (data) => {
  // Update opponent's score
});

// When game ends
socket.on("post-game-started", (data) => {
  // Show results, ask for rematch
});

// Request rematch
socket.emit("request-rematch");

socket.on("rematch-accepted", () => {
  // New game-started event will follow
});
```

### Handling Disconnection with Reconnection

```javascript
let currentGameData = null;

socket.on("game-started", (data) => {
  currentGameData = data;
  // Start game
});

socket.on("disconnect", (reason) => {
  if (currentGameData) {
    // Player was in active game - show reconnect screen
    showReconnectPrompt();
  }
});

function handleReconnect() {
  socket.emit("reconnect-to-game", {
    roomId: currentGameData.roomId,
    gameId: currentGameData.gameId,
  });
}

socket.on("game-reconnected", (data) => {
  // Resume with new game state
  currentGameData = data;
  resumeGame(data);
});

socket.on("reconnect-failed", (data) => {
  // Show game ended screen
  showGameEndedScreen(data);
});
```

### Emoji System Integration

```javascript
const ALLOWED_EMOJIS = ["😄", "🔥", "🎯", "😅", "👏", "💪", "⚡", "🚀"];
let emojiCooldown = 0;

function sendEmoji(emoji) {
  if (!ALLOWED_EMOJIS.includes(emoji)) {
    showError("Invalid emoji");
    return;
  }

  if (Date.now() - emojiCooldown < 2000) {
    showError("Wait before sending another emoji");
    return;
  }

  socket.emit("send-emoji", { emoji });
  emojiCooldown = Date.now();
  disableEmojiButton(2000); // Disable for 2 seconds
}

socket.on("opponent-emoji-received", (data) => {
  showEmojiAnimation(data.emoji, data.fromPlayer);
});

socket.on("emoji-invalid", (data) => {
  showError(data.message);
});

socket.on("emoji-rate-limited", (data) => {
  showWarning(data.message);
});
```

---

## ⚠️ Error Handling

### Generic Error Handler

```javascript
socket.on("error", (data) => {
  console.error("Socket error:", data.message);

  // Handle specific error types
  if (data.message.includes("already registered")) {
    showAlert("You're already registered. Please refresh.");
  } else if (data.message.includes("Invalid difficulty")) {
    showAlert("Invalid game difficulty selected.");
  } else if (data.message.includes("already in game")) {
    showAlert("You're already in a game. Please finish or disconnect.");
  } else {
    showAlert("An error occurred: " + data.message);
  }
});
```

---

## 📊 Field Reference

### Mandatory vs Optional Fields

| Event             | Field       | Type   | Mandatory | Purpose              |
| ----------------- | ----------- | ------ | --------- | -------------------- |
| register-player   | name        | String | ✅        | Display name         |
| register-player   | userId      | String | ✅        | Unique user ID       |
| register-player   | profilePic  | String | ❌        | Profile image URL    |
| join-lobby        | difficulty  | String | ✅        | Game difficulty      |
| join-lobby        | maxWaitTime | Number | ❌        | Max wait in ms       |
| submit-answer     | answer      | String | ✅        | Selected answer      |
| submit-answer     | timeSpent   | Number | ✅        | Time in ms           |
| send-emoji        | emoji       | String | ✅        | Emoji character      |
| reconnect-to-game | roomId      | String | ✅        | Game room ID         |
| reconnect-to-game | gameId      | String | ✅        | Game ID              |
| send-challenge    | recipientId | String | ✅        | Friend user ID       |
| send-challenge    | difficulty  | String | ❌        | Challenge difficulty |
| accept-challenge  | challengeId | String | ✅        | Challenge ID         |
| decline-challenge | challengeId | String | ✅        | Challenge ID         |
| cancel-challenge  | challengeId | String | ✅        | Challenge ID         |

---

## 🔧 Debugging Tips

### Monitor All Socket Events

```javascript
// Log all incoming events
const originalOn = socket.on;
socket.on = function (event, ...args) {
  if (!event.includes("connect")) {
    console.log("📥 Received:", event, args[0]);
  }
  return originalOn.apply(this, [event, ...args]);
};

// Log all outgoing events
const originalEmit = socket.emit;
socket.emit = function (event, ...args) {
  console.log("📤 Sending:", event, args[0]);
  return originalEmit.apply(this, [event, ...args]);
};
```

### Test Grace Period

```javascript
// Simulate disconnection
function testGracePeriod() {
  socket.disconnect();
  // After 15 seconds, try to reconnect
  setTimeout(() => {
    socket.connect();
    socket.emit("reconnect-to-game", {...});
  }, 8000); // Reconnect after 8 seconds (within grace period)
}
```

### Monitor WebSocket Connection

```javascript
socket.on("connect", () => console.log("✅ Connected"));
socket.on("disconnect", (reason) => console.log("❌ Disconnected:", reason));
socket.on("connect_error", (err) => console.log("❌ Error:", err));
socket.on("reconnect_attempt", () => console.log("🔄 Reconnecting..."));
socket.on("reconnect", () => console.log("✅ Reconnected"));
```

---

## 💡 Best Practices

✅ **DO:**

- Always include mandatory fields in events
- Validate emoji against whitelist on client before sending
- Handle all possible error responses
- Store game state locally for reconnection
- Implement exponential backoff for reconnection
- Show user-friendly error messages
- Throttle emoji sending on client-side
- Clean up event listeners on component unmount

❌ **DON'T:**

- Skip error handling
- Send random data as emoji
- Spam socket events
- Assume server response format
- Hardcode delays/timeouts
- Log sensitive user data
- Forget to disconnect socket on app close
- Ignore connection errors

---

## 📞 Quick Reference

**Development URL:** `http://localhost:3000` (change based on your backend)

**Socket Connection Options:**

```javascript
const socket = io(URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
});
```

**Allowed Emojis:** 😄 🔥 🎯 😅 👏 💪 ⚡ 🚀

**Difficulties:** easy | medium | hard

**Grace Period:** 15 seconds

**Emoji Rate Limit:** 2 seconds

**Challenge Expiry:** 24 hours (customizable)

---

**Last Updated:** January 21, 2026  
**Version:** 1.0 - Complete  
**Status:** Production Ready ✅
