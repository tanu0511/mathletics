// // // config/appStrings.js
// // // ✅ SINGLE SOURCE OF TRUTH for all translatable strings in the app.
// // // RULES:
// // //   - Every string must appear EXACTLY ONCE across the entire file.
// // //   - Top-level keys (title, Home, Play, etc.) are for short nav/header labels.
// // //   - buttons[]   → interactive action elements
// // //   - paragraphs[] → body text, messages, descriptions
// // //   - labels[]    → form fields, section titles, tags, static UI labels
// // //   - DO NOT duplicate a string between top-level keys and any array, or between arrays.

// // export const APP_STRINGS = {
// //   // ─── Top-level strings ──────────────────────────────────────────────────────
// //   // These are accessed directly via t('Home') etc.
// //   // ⚠️ Do NOT repeat these inside labels[], buttons[], or paragraphs[].
// //   title: 'Welcome',
// //   footer: 'All rights reserved.',
// //   sentance: 'Have you read all the terms?',
// //   Home: 'Home',
// //   Play: 'Play',
// //   Practise: 'Practise',
// //   More: 'More',

// //   // ─── Buttons ────────────────────────────────────────────────────────────────
// //   // Interactive elements the user taps / presses.
// //   // ⚠️ No duplicates with top-level keys or labels[].
// //   buttons: [
// //     'Submit',             // 0
// //     'Cancel',             // 1
// //     'Continue',           // 2
// //     'Go Back',            // 3
// //     'Okay',               // 4
// //     'Get Started',        // 5
// //     'Sign In',            // 6
// //     'Sign Up',            // 7
// //     'Save',               // 8
// //     'Delete',             // 9
// //     'Confirm',            // 10
// //     'Next',               // 11
// //     'Skip',               // 12
// //     'Sign - In',          // 13
// //     'Forgot Password',    // 14
// //     'Register now',       // 15
// //     'Not a member?',      // 16
// //     'Done',               // 17
// //     "Let's Play",         // 18
// //     'Sign - Up',          // 19
// //     'Continue as Guest',  // 20
// //     'Decline',            // 21
// //     'Accept',             // 22
// //     'PRACTICE',           // 23
// //     'PLAY',               // 24
// //     'Start Practice',     // 25
// //     'Start Game',         // 26
// //     'Logout',             // 27
// //     'Discard',            // 28
// //     'Close',              // 29
// //     'Leave',              // 30  ✅ NEW — MultiPlayerGame: leave game confirm button
// //     'Rematch',            // 31  ✅ NEW — MultiPlayerGame: result modal rematch button
// //     'Resend',          // ✅ ADD
// // 'Reset Password',  // optional
// //   ],

// //   // ─── Paragraphs / Body text ──────────────────────────────────────────────────
// //   // Messages, descriptions, prompts shown as body copy.
// //   // ⚠️ No duplicates with top-level keys, buttons[], or labels[].
// //   paragraphs: [
// //     'Select your preferred language',          // 0z
// //     'You have Selected:',                      // 1
// //     'Click the button.',                       // 2
// //     'Please wait while we load your content.', // 3
// //     'Something went wrong. Please try again.', // 4
// //     'No internet connection. Please check your network.', // 5
// //     'Your changes have been saved successfully.', // 6
// //     'Are you sure you want to continue?',      // 7
// //     'Enter your details below.',               // 8
// //     'Welcome back!',                           // 9
// //     'Create your account',                     // 10
// //     'Forgot your password?',                   // 11
// //     "Don't have an account?",                  // 12
// //     'Already have an account?',                // 13
// //     'Enter your Email',                        // 14
// //     'Enter your Password',                     // 15
// //     'or continue with',                        // 16
// //     'Your email is wrong',                     // 17
// //     'Your password is wrong',                  // 18
// //     'ID / Password is Incorrect',              // 19
// //     'This field is required',                  // 20
// //     'Please enter a valid email',              // 21
// //     'OTP Sent',                                // 22
// //     'Failed',                                  // 23
// //     'Network Error',                           // 24
// //     'Please try again later.',                 // 25
// //     'Google login coming soon',                // 26
// //     'Twitter login coming soon',               // 27
// //     'Facebook login coming soon',              // 28
// //     'Token or user data not received',         // 29
// //     'By continuing, you agree to our Terms of Service.', // 30
// //     'Boost your mental math and reflexes.',    // 31
// //     "Put on your gym shoes and let's get working.", // 32
// //     'And Remember - Every Second Counts.',     // 33
// //     'Challenge Received!',                     // 34
// //     'wants to challenge you to a match!',      // 35
// //     'Starting Game...',                        // 36
// //     'Preparing your match',                    // 37
// //     'Challenge expires in 60 seconds',         // 38
// //     'Connection Error',                        // 39
// //     'Please check your connection',            // 40
// //     'Challenge Accepted!',                     // 41
// //     'Starting game...',                        // 42
// //     'Challenge Declined',                      // 43
// //     'Challenge has been declined',             // 44
// //     'Are you sure you want to logout?',        // 45
// //     'Match with any available player',         // 46
// //     'Play against AI',                         // 47
// //     'Search and challenge friends',            // 48
// //     'Random Opponent',                         // 49
// //     'Computer Opponent',                       // 50
// //     'Friends Opponent',                        // 51
// //     // ── SignUp screen ────────────────────────────────────────────────────────
// //     'Please Read T&C',                         // 52
// //     'Already a member?',                       // 53
// //     'Location Error',                          // 54
// //     'Unable to fetch your location automatically', // 55
// //     'Permission Denied',                       // 56
// //     'Please enable location access in settings', // 57
// //     'OTP Already Sent',                        // 58
// //     'Redirecting to verification screen...',   // 59
// //     'Sign Up Failed',                          // 60
// //     'Username is required',                    // 61
// //     'Email is required',                       // 62
// //     'Invalid email format',                    // 63
// //     'Password is required',                    // 64
// //     // ── MathInputScreen ─────────────────────────────────────────────────────
// //     'Authorization token missing',             // 65
// //     'Failed to load question.',                // 66
// //     // ── WellDoneScreen ──────────────────────────────────────────────────────
// //     'Well Done',                               // 67
// //     // ── UpdateProfile ────────────────────────────────────────────────────────
// //     'Profile updated successfully',            // 68
// //     'Invalid response from server.',           // 69
// //     'Something went wrong. Please check your connection.', // 70
// //     'Update Failed',                           // 71
// //     'Server Error',                            // 72
// //     // ── MultiPlayerGame ──────────────────────────────────────────────────────
// //     'Leave Game?',                             // 73
// //     'Are you sure you want to leave? You will lose the match.', // 74
// //     'Connection Lost',                         // 75
// //     'You have been disconnected from the server.', // 76
// //     'Opponent Disconnected',                   // 77
// //     'Your opponent has left the game. You win!', // 78
// //     'Reconnected',                             // 79
// //     'Opponent has reconnected!',               // 80
// //     'You Won!',                                // 81
// //     'You Lost!',                               // 82
// //     'Draw!',                                   // 83
// //     "You'll be matched with players of similar rating", // 84
// //     'User ID not found. Please login again.',  // 85
// //     'Please login first',                      // 86
// //     'Failed to load user data',                // 87
// //     'Connection lost. Please try again.',      // 88
// //     'Invalid match data received',             // 89
// //     'Invalid game data received',              // 90
// //     'Player ID is missing',                    // 91
// //     'Opponent data is missing',                // 92
// //     'Please enter complete OTP',
// // 'Invalid OTP',
// // 'Password must be at least 6 characters long',
// // 'Unable to resend OTP',
// // 'OTP sent again',
// //   ],

// //   // ─── Labels ──────────────────────────────────────────────────────────────────
// //   // Form field names, section titles, static UI tags.
// //   // ⚠️ No duplicates with top-level keys (Home/Play/Practise/More/Logout/Cancel already defined above).
// //   labels: [
// //     'Email',                      // 0
// //     'Password',                   // 1
// //     'Full Name',                  // 2
// //     'Phone Number',               // 3
// //     'Date of Birth',              // 4
// //     'Gender',                     // 5
// //     'Address',                    // 6
// //     'City',                       // 7
// //     'Country',                    // 8   ✅ also used as leaderboard filter key
// //     'Loading...',                 // 9
// //     'Error',                      // 10
// //     'Success',                    // 11
// //     'Warning',                    // 12
// //     'Info',                       // 13
// //     'Notifications',              // 14
// //     'Settings',                   // 15
// //     'Profile',                    // 16
// //     'Search',                     // 17
// //     'Select Difficulty',          // 18
// //     'Timer',                      // 19
// //     'Symbol',                     // 20
// //     'VS',                         // 21
// //     'Easy',                       // 22
// //     'Medium',                     // 23
// //     'Hard',                       // 24
// //     '1 Minute',                   // 25
// //     '2 Minute',                   // 26
// //     '3 Minute',                   // 27
// //     '(+) and (-)',                // 28
// //     '(+), (-), (x) and (/)',      // 29
// //     'Practice Game',              // 30
// //     'Play Game',                  // 31
// //     'Random',                     // 32
// //     'Computer',                   // 33
// //     'Friends',                    // 34   ✅ also used as leaderboard filter key
// //     'MORE',                       // 35
// //     'NOTIFICATION',               // 36
// //     'PROFILE',                    // 37
// //     'FRIENDS',                    // 38
// //     'HISTORY',                    // 39
// //     'STATS',                      // 40
// //     'ACHIEVEMENTS',               // 41
// //     'LEADERBOARD',                // 42
// //     'SETTINGS',                   // 43
// //     'THEME',                      // 44
// //     'SOUND',                      // 45
// //     'LANGUAGE',                   // 46
// //     'SUPPORT',                    // 47
// //     'Select Opponent',            // 48
// //     'Choose Level',               // 49
// //     // ── SignUp screen ────────────────────────────────────────────────────────
// //     'Username *',                 // 50
// //     'Email *',                    // 51
// //     'Enter your Password *',      // 52
// //     'Select Gender',              // 53
// //     'Male',                       // 54
// //     'Female',                     // 55
// //     'Others',                     // 56
// //     'Year of Birth',              // 57
// //     'Select Year',                // 58
// //     // ── MathInputScreen ─────────────────────────────────────────────────────
// //     'Correct',                    // 59
// //     'Incorrect',                  // 60
// //     'Skipped',                    // 61
// //     'Clear',                      // 62
// //     'Skip',                       // 63
// //     'REV',                        // 64
// //     // ── WellDoneScreen ──────────────────────────────────────────────────────
// //     'Total Score',                // 65
// //     'Correct Count',              // 66
// //     'Incorrect Count',            // 67
// //     'Skipped Questions',          // 68
// //     'Correct Percentage',         // 69
// //     'New Game',                   // 70
// //     // ── ProfileScreen ────────────────────────────────────────────────────────
// //     'Joined:',                    // 71
// //     'Email:',                     // 72
// //     'First Name:',                // 73
// //     'Last Name:',                 // 74
// //     'Year of Birth:',             // 75
// //     'Gender:',                    // 76
// //     'Country:',                   // 77
// //     'Unknown',                    // 78
// //     'N/A',                        // 79
// //     'Not Set',                    // 80
// //     'Current Rank:',              // 81
// //     'Achievements',               // 82
// //     // ── UpdateProfile ────────────────────────────────────────────────────────
// //     'Upload / Camera / Icons',    // 83
// //     'YYYY',                       // 84
// //     'Select Country',             // 85
// //     'Discard',                    // 86
// //     'Close',                      // 87
// //     'OK',                         // 88
// //     // ── ThemeSelectorScreen ──────────────────────────────────────────────────
// //     'Colors',                     // 89
// //     'Numpad',                     // 90
// //     'Option 1',                   // 91
// //     'Option 2',                   // 92
// //     // ── NotificationScreen / SoundScreen ─────────────────────────────────────
// //     'Allow Notification',         // 93
// //     'Sound',                      // 94
// //     // ── MultiPlayerGame ──────────────────────────────────────────────────────
// //     'Pts',                        // 95
// //     'YOU',                        // 96
// //     'You',                        // 97
// //     'Opponent',                   // 98
// //     'Reconnecting...',            // 99
// //     'VICTORY',                    // 100
// //     'DEFEAT',                     // 101
// //     'DRAW',                       // 102
// //     'Game Lobby',                 // 103
// //     'Rating',                     // 104
// //     'Player',                     // 105
// //     'Ready to Find Match',        // 106
// //     'Find Match',                 // 107
// //     'Finding opponent...',        // 108
// //     'Opponent Found!',            // 109
// //     'Looking for players with rating', // 110
// //     'Playing against',            // 111
// //     'Ready to Battle...',         // 112
// //     'Cancel Search',              // 113
// //     'Socket not connected',       // 114
// //     'Global',                     // 115  ✅ leaderboard filter key
// //     'Rank',                       // 116  ✅ leaderboard header
// //     'User Name',                  // 117  ✅ leaderboard header
// //     'No data found',              // 118  ✅ leaderboard empty state
// //     // ── Leaderboard tabs ─────────────────────────────────────────────────────
// //     // ✅ NEW: Tab labels registered so t() can translate them.
// //     // State always stores the English key; only display text is translated.
// //     'E2',                         // 119  Easy Practice
// //     'E4',                         // 120  Easy PvP
// //     'M2',                         // 121  Medium Practice
// //     'M4',                         // 122  Medium PvP
// //     'H2',                         // 123  Hard Practice
// //     'H4',                         // 124  Hard PvP

// //     // ── Theme names ──────────────────────────────────────────────────────────
// //     // Keys must match the `name` field in ThemeContext.js exactly.
// //     // t(themeItem.name) will resolve these at runtime.
// //     'Dark',                       // 125
// //     'Royal Champ',                // 126
// //     'Teal Fusion',                // 127
// //     'Forest Quest',               // 128
// //     'Desert Logic',               // 129
// //     'Blossom Dream',              // 130
// //     'Lava Blaze',                 // 131
// //   ],
// // };

// // config/appStrings.js
// // ✅ SINGLE SOURCE OF TRUTH for all translatable strings in the app.
// // RULES:
// //   - Every string must appear EXACTLY ONCE across the entire file.
// //   - Top-level keys (title, Home, Play, etc.) are for short nav/header labels.
// //   - buttons[]   → interactive action elements
// //   - paragraphs[] → body text, messages, descriptions
// //   - labels[]    → form fields, section titles, tags, static UI labels
// //   - DO NOT duplicate a string between top-level keys and any array, or between arrays.

// export const APP_STRINGS = {
//   // ─── Top-level strings ──────────────────────────────────────────────────────
//   title: 'Welcome',
//   footer: 'All rights reserved.',
//   sentance: 'Have you read all the terms?',
//   Home: 'Home',
//   Play: 'Play',
//   Practise: 'Practise',
//   More: 'More',

//   // ─── Buttons ────────────────────────────────────────────────────────────────
//   buttons: [
//     'Submit',             // 0
//     'Cancel',             // 1
//     'Continue',           // 2
//     'Go Back',            // 3
//     'Okay',               // 4
//     'Get Started',        // 5
//     'Sign In',            // 6
//     'Sign Up',            // 7
//     'Save',               // 8
//     'Delete',             // 9
//     'Confirm',            // 10
//     'Next',               // 11
//     'Skip',               // 12
//     'Sign - In',          // 13
//     'Forgot Password',    // 14
//     'Register now',       // 15
//     'Not a member?',      // 16
//     'Done',               // 17
//     "Let's Play",         // 18
//     'Sign - Up',          // 19
//     'Continue as Guest',  // 20
//     'Decline',            // 21
//     'Accept',             // 22
//     'PRACTICE',           // 23
//     'PLAY',               // 24
//     'Start Practice',     // 25
//     'Start Game',         // 26
//     'Logout',             // 27
//     'Discard',            // 28
//     'Close',              // 29
//     'Leave',              // 30
//     'Rematch',            // 31
//     'Resend',             // 32
//     'Reset Password',     // 33
//     'Pending',            // 34  ✅ AddUserScreen: pending friend request button
//   ],

//   // ─── Paragraphs / Body text ──────────────────────────────────────────────────
//   paragraphs: [
//     'Select your preferred language',          // 0
//     'You have Selected:',                      // 1
//     'Click the button.',                       // 2
//     'Please wait while we load your content.', // 3
//     'Something went wrong. Please try again.', // 4
//     'No internet connection. Please check your network.', // 5
//     'Your changes have been saved successfully.', // 6
//     'Are you sure you want to continue?',      // 7
//     'Enter your details below.',               // 8
//     'Welcome back!',                           // 9
//     'Create your account',                     // 10
//     'Forgot your password?',                   // 11
//     "Don't have an account?",                  // 12
//     'Already have an account?',                // 13
//     'Enter your Email',                        // 14
//     'Enter your Password',                     // 15
//     'or continue with',                        // 16
//     'Your email is wrong',                     // 17
//     'Your password is wrong',                  // 18
//     'ID / Password is Incorrect',              // 19
//     'This field is required',                  // 20
//     'Please enter a valid email',              // 21
//     'OTP Sent',                                // 22
//     'Failed',                                  // 23
//     'Network Error',                           // 24
//     'Please try again later.',                 // 25
//     'Google login coming soon',                // 26
//     'Twitter login coming soon',               // 27
//     'Facebook login coming soon',              // 28
//     'Token or user data not received',         // 29
//     'By continuing, you agree to our Terms of Service.', // 30
//     'Boost your mental math and reflexes.',    // 31
//     "Put on your gym shoes and let's get working.", // 32
//     'And Remember - Every Second Counts.',     // 33
//     'Challenge Received!',                     // 34
//     'wants to challenge you to a match!',      // 35
//     'Starting Game...',                        // 36
//     'Preparing your match',                    // 37
//     'Challenge expires in 60 seconds',         // 38
//     'Connection Error',                        // 39
//     'Please check your connection',            // 40
//     'Challenge Accepted!',                     // 41
//     'Starting game...',                        // 42
//     'Challenge Declined',                      // 43
//     'Challenge has been declined',             // 44
//     'Are you sure you want to logout?',        // 45
//     'Match with any available player',         // 46
//     'Play against AI',                         // 47
//     'Search and challenge friends',            // 48
//     'Random Opponent',                         // 49
//     'Computer Opponent',                       // 50
//     'Friends Opponent',                        // 51
//     'Please Read T&C',                         // 52
//     'Already a member?',                       // 53
//     'Location Error',                          // 54
//     'Unable to fetch your location automatically', // 55
//     'Permission Denied',                       // 56
//     'Please enable location access in settings', // 57
//     'OTP Already Sent',                        // 58
//     'Redirecting to verification screen...',   // 59
//     'Sign Up Failed',                          // 60
//     'Username is required',                    // 61
//     'Email is required',                       // 62
//     'Invalid email format',                    // 63
//     'Password is required',                    // 64
//     'Authorization token missing',             // 65
//     'Failed to load question.',                // 66
//     'Well Done',                               // 67
//     'Profile updated successfully',            // 68
//     'Invalid response from server.',           // 69
//     'Something went wrong. Please check your connection.', // 70
//     'Update Failed',                           // 71
//     'Server Error',                            // 72
//     'Leave Game?',                             // 73
//     'Are you sure you want to leave? You will lose the match.', // 74
//     'Connection Lost',                         // 75
//     'You have been disconnected from the server.', // 76
//     'Opponent Disconnected',                   // 77
//     'Your opponent has left the game. You win!', // 78
//     'Reconnected',                             // 79
//     'Opponent has reconnected!',               // 80
//     'You Won!',                                // 81
//     'You Lost!',                               // 82
//     'Draw!',                                   // 83
//     "You'll be matched with players of similar rating", // 84
//     'User ID not found. Please login again.',  // 85
//     'Please login first',                      // 86
//     'Failed to load user data',                // 87
//     'Connection lost. Please try again.',      // 88
//     'Invalid match data received',             // 89
//     'Invalid game data received',              // 90
//     'Player ID is missing',                    // 91
//     'Opponent data is missing',                // 92
//     'Please enter complete OTP',               // 93
//     'Invalid OTP',                             // 94
//     'Password must be at least 6 characters long', // 95
//     'Unable to resend OTP',                    // 96
//     'OTP sent again',                          // 97
//     // ── AddUserScreen ────────────────────────────────────────────────────────
//     'Friend Request Sent',                     // 98
//     'Request Failed',                          // 99
//     'Request Cancelled',                       // 100
//     'Failed to cancel',                        // 101
//     'Error cancelling request',                // 102
//     'No users found.',                         // 103
//     // In appStrings.js — add to paragraphs[]
// 'Everyone starts somewhere',          // 104
// 'Rising through the tanks',    // 105
// 'Bring your A-game',         // 106
// 'Think fast. Very fast',              // 107
// 'Beat me if you can',                     // 108
//   ],

//   // ─── Labels ──────────────────────────────────────────────────────────────────
//   labels: [
//     'Email',                      // 0
//     'Password',                   // 1
//     'Full Name',                  // 2
//     'Phone Number',               // 3
//     'Date of Birth',              // 4
//     'Gender',                     // 5
//     'Address',                    // 6
//     'City',                       // 7
//     'Country',                    // 8
//     'Loading...',                 // 9
//     'Error',                      // 10
//     'Success',                    // 11
//     'Warning',                    // 12
//     'Info',                       // 13
//     'Notifications',              // 14
//     'Settings',                   // 15
//     'Profile',                    // 16
//     'Search',                     // 17
//     'Select Difficulty',          // 18
//     'Timer',                      // 19
//     'Symbol',                     // 20
//     'VS',                         // 21
//     'Easy',                       // 22
//     'Medium',                     // 23
//     'Hard',                       // 24
//     '1 Minute',                   // 25
//     '2 Minute',                   // 26
//     '3 Minute',                   // 27
//     '(+) and (-)',                // 28
//     '(+), (-), (x) and (/)',      // 29
//     'Practice Game',              // 30
//     'Play Game',                  // 31
//     'Random',                     // 32
//     'Computer',                   // 33
//     'Friends',                    // 34
//     'MORE',                       // 35
//     'NOTIFICATION',               // 36
//     'PROFILE',                    // 37
//     'FRIENDS',                    // 38
//     'HISTORY',                    // 39
//     'STATS',                      // 40
//     'ACHIEVEMENTS',               // 41
//     'LEADERBOARD',                // 42
//     'SETTINGS',                   // 43
//     'THEME',                      // 44
//     'SOUND',                      // 45
//     'LANGUAGE',                   // 46
//     'SUPPORT',                    // 47
//     'Select Opponent',            // 48
//     'Choose Level',               // 49
//     'Username *',                 // 50
//     'Email *',                    // 51
//     'Enter your Password *',      // 52
//     'Select Gender',              // 53
//     'Male',                       // 54
//     'Female',                     // 55
//     'Others',                     // 56
//     'Year of Birth',              // 57
//     'Select Year',                // 58
//     'Correct',                    // 59
//     'Incorrect',                  // 60
//     'Skipped',                    // 61
//     'Clear',                      // 62
//     'Skip',                       // 63
//     'REV',                        // 64
//     'Total Score',                // 65
//     'Correct Count',              // 66
//     'Incorrect Count',            // 67
//     'Skipped Questions',          // 68
//     'Correct Percentage',         // 69
//     'New Game',                   // 70
//     'Joined:',                    // 71
//     'Email:',                     // 72
//     'First Name:',                // 73
//     'Last Name:',                 // 74
//     'Year of Birth:',             // 75
//     'Gender:',                    // 76
//     'Country:',                   // 77
//     'Unknown',                    // 78
//     'N/A',                        // 79
//     'Not Set',                    // 80
//     'Current Rank:',              // 81
//     'Achievements',               // 82
//     'Upload / Camera / Icons',    // 83
//     'YYYY',                       // 84
//     'Select Country',             // 85
//     'Discard',                    // 86
//     'Close',                      // 87
//     'OK',                         // 88
//     'Colors',                     // 89
//     'Numpad',                     // 90
//     'Option 1',                   // 91
//     'Option 2',                   // 92
//     'Allow Notification',         // 93
//     'Sound',                      // 94
//     'Pts',                        // 95
//     'YOU',                        // 96
//     'You',                        // 97
//     'Opponent',                   // 98
//     'Reconnecting...',            // 99
//     'VICTORY',                    // 100
//     'DEFEAT',                     // 101
//     'DRAW',                       // 102
//     'Game Lobby',                 // 103
//     'Rating',                     // 104
//     'Player',                     // 105
//     'Ready to Find Match',        // 106
//     'Find Match',                 // 107
//     'Finding opponent...',        // 108
//     'Opponent Found!',            // 109
//     'Looking for players with rating', // 110
//     'Playing against',            // 111
//     'Ready to Battle...',         // 112
//     'Cancel Search',              // 113
//     'Socket not connected',       // 114
//     'Global',                     // 115
//     'Rank',                       // 116
//     'User Name',                  // 117
//     'No data found',              // 118
//     'E2',                         // 119
//     'E4',                         // 120
//     'M2',                         // 121
//     'M4',                         // 122
//     'H2',                         // 123
//     'H4',                         // 124
//     // ── Theme names ──────────────────────────────────────────────────────────
//     'Dark',                       // 125
//     'Royal Champ',                // 126
//     'Teal Fusion',                // 127
//     'Forest Quest',               // 128
//     'Desert Logic',               // 129
//     'Blossom Dream',              // 130
//     'Lava Blaze',                 // 131
//     // ── AddUserScreen ────────────────────────────────────────────────────────
//     'Search Contacts',            // 132
//     'Invite & Connect',           // 133
//     'Invite Friends via WhatsApp or SMS', // 134
//     'Facebook Friends',           // 135
//     'Search Results',             // 136
//     'My Friends',                 // 137
//     'Username:',                  // 138
//     'Name:',                      // 139
//     'PvP Rating:',                // 140
//     'Friend',                     // 141
//     'Beginner',   // 142
// 'Amateur',    // 143
// 'Skilled',    // 144
// 'Expert',     // 145
// 'Pro',        // 146
// 'Level',      // 147
// 'W',          // 148  (win-rate suffix)
// 'Select Level', // 149
// 'Choose your level', // 150
// 'Select a difficulty to play against the AI', // 151
// 'Game History',    // 152
// 'Win',             // 153
// 'Loss',            // 154
// 'No games found',  // 155
// 'Practice',        // 156
// 'CPU',             // 157
// 'Unknown',         // already at 78 ✅ — no duplicate needed
//   ],
// };









// config/appStrings.js
// ✅ SINGLE SOURCE OF TRUTH for all translatable strings in the app.
// RULES:
//   - Every string must appear EXACTLY ONCE across the entire file.
//   - Top-level keys (title, Home, Play, etc.) are for short nav/header labels.
//   - buttons[]   → interactive action elements
//   - paragraphs[] → body text, messages, descriptions
//   - labels[]    → form fields, section titles, tags, static UI labels
//   - DO NOT duplicate a string between top-level keys and any array, or between arrays.

export const APP_STRINGS = {
  // ─── Top-level strings ──────────────────────────────────────────────────────
  title: 'Welcome',
  footer: 'All rights reserved.',
  sentance: 'Have you read all the terms?',
  Home: 'Home',
  Play: 'Play',
  Practise: 'Practise',
  More: 'More',

  // ─── Buttons ────────────────────────────────────────────────────────────────
  buttons: [
    'Submit',             // 0
    'Cancel',             // 1
    'Continue',           // 2
    'Go Back',            // 3
    'Okay',               // 4
    'Get Started',        // 5
    'Sign In',            // 6
    'Sign Up',            // 7
    'Save',               // 8
    'Delete',             // 9
    'Confirm',            // 10
    'Next',               // 11
    'Skip',               // 12
    'Sign - In',          // 13
    'Forgot Password',    // 14
    'Register now',       // 15
    'Not a member?',      // 16
    'Done',               // 17
    "Let's Play",         // 18
    'Sign - Up',          // 19
    'Continue as Guest',  // 20
    'Decline',            // 21
    'Accept',             // 22
    'PRACTICE',           // 23
    'PLAY',               // 24
    'Start Practice',     // 25
    'Start Game',         // 26
    'Logout',             // 27
    'Discard',            // 28
    'Close',              // 29
    'Leave',              // 30
    'Rematch',            // 31
    'Resend',             // 32
    'Reset Password',     // 33
    'Pending',            // 34
  ],

  // ─── Paragraphs / Body text ──────────────────────────────────────────────────
  paragraphs: [
    'Select your preferred language',          // 0
    'You have Selected:',                      // 1
    'Click the button.',                       // 2
    'Please wait while we load your content.', // 3
    'Something went wrong. Please try again.', // 4
    'No internet connection. Please check your network.', // 5
    'Your changes have been saved successfully.', // 6
    'Are you sure you want to continue?',      // 7
    'Enter your details below.',               // 8
    'Welcome back!',                           // 9
    'Create your account',                     // 10
    'Forgot your password?',                   // 11
    "Don't have an account?",                  // 12
    'Already have an account?',                // 13
    'Enter your Email',                        // 14
    'Enter your Password',                     // 15
    'or continue with',                        // 16
    'Your email is wrong',                     // 17
    'Your password is wrong',                  // 18
    'ID / Password is Incorrect',              // 19
    'This field is required',                  // 20
    'Please enter a valid email',              // 21
    'OTP Sent',                                // 22
    'Failed',                                  // 23
    'Network Error',                           // 24
    'Please try again later.',                 // 25
    'Google login coming soon',                // 26
    'Twitter login coming soon',               // 27
    'Facebook login coming soon',              // 28
    'Token or user data not received',         // 29
    'By continuing, you agree to our Terms of Service.', // 30
    'Boost your mental math and reflexes.',    // 31
    "Put on your gym shoes and let's get working.", // 32
    'And Remember - Every Second Counts.',     // 33
    'Challenge Received!',                     // 34
    'wants to challenge you to a match!',      // 35
    'Starting Game...',                        // 36
    'Preparing your match',                    // 37
    'Challenge expires in 60 seconds',         // 38
    'Connection Error',                        // 39
    'Please check your connection',            // 40
    'Challenge Accepted!',                     // 41
    'Starting game...',                        // 42
    'Challenge Declined',                      // 43
    'Challenge has been declined',             // 44
    'Are you sure you want to logout?',        // 45
    'Match with any available player',         // 46
    'Play against AI',                         // 47
    'Search and challenge friends',            // 48
    'Random Opponent',                         // 49
    'Computer Opponent',                       // 50
    'Friends Opponent',                        // 51
    'Please Read T&C',                         // 52
    'Already a member?',                       // 53
    'Location Error',                          // 54
    'Unable to fetch your location automatically', // 55
    'Permission Denied',                       // 56
    'Please enable location access in settings', // 57
    'OTP Already Sent',                        // 58
    'Redirecting to verification screen...',   // 59
    'Sign Up Failed',                          // 60
    'Username is required',                    // 61
    'Email is required',                       // 62
    'Invalid email format',                    // 63
    'Password is required',                    // 64
    'Authorization token missing',             // 65
    'Failed to load question.',                // 66
    'Well Done',                               // 67
    'Profile updated successfully',            // 68
    'Invalid response from server.',           // 69
    'Something went wrong. Please check your connection.', // 70
    'Update Failed',                           // 71
    'Server Error',                            // 72
    'Leave Game?',                             // 73
    'Are you sure you want to leave? You will lose the match.', // 74
    'Connection Lost',                         // 75
    'You have been disconnected from the server.', // 76
    'Opponent Disconnected',                   // 77
    'Your opponent has left the game. You win!', // 78
    'Reconnected',                             // 79
    'Opponent has reconnected!',               // 80
    'You Won!',                                // 81
    'You Lost!',                               // 82
    'Draw!',                                   // 83
    "You'll be matched with players of similar rating", // 84
    'User ID not found. Please login again.',  // 85
    'Please login first',                      // 86
    'Failed to load user data',                // 87
    'Connection lost. Please try again.',      // 88
    'Invalid match data received',             // 89
    'Invalid game data received',              // 90
    'Player ID is missing',                    // 91
    'Opponent data is missing',                // 92
    'Please enter complete OTP',               // 93
    'Invalid OTP',                             // 94
    'Password must be at least 6 characters long', // 95
    'Unable to resend OTP',                    // 96
    'OTP sent again',                          // 97
    'Friend Request Sent',                     // 98
    'Request Failed',                          // 99
    'Request Cancelled',                       // 100
    'Failed to cancel',                        // 101
    'Error cancelling request',                // 102
    'No users found.',                         // 103
    'Everyone starts somewhere',               // 104
    'Rising through the tanks',                // 105
    'Bring your A-game',                       // 106
    'Think fast. Very fast',                   // 107
    'Beat me if you can',                      // 108
    // ── StatsScreen ──────────────────────────────────────────────────────────
    'No rating history available',             // 109  ✅ NEW
    'Authentication token missing. Please log in again.',      // 110  ✅ NEW
    'Player ID not found. Please log out and log in again.',   // 111  ✅ NEW
    'Server returned an unexpected response. Please try again.', // 112 ✅ NEW
    // ── LanguageSelectionScreen ───────────────────────────────────────────────
    'Select Language',                         // 113  ✅ NEW
  ],

  // ─── Labels ──────────────────────────────────────────────────────────────────
  labels: [
    'Email',                      // 0
    'Password',                   // 1
    'Full Name',                  // 2
    'Phone Number',               // 3
    'Date of Birth',              // 4
    'Gender',                     // 5
    'Address',                    // 6
    'City',                       // 7
    'Country',                    // 8
    'Loading...',                 // 9
    'Error',                      // 10
    'Success',                    // 11
    'Warning',                    // 12
    'Info',                       // 13
    'Notifications',              // 14
    'Settings',                   // 15
    'Profile',                    // 16
    'Search',                     // 17
    'Select Difficulty',          // 18
    'Timer',                      // 19
    'Symbol',                     // 20
    'VS',                         // 21
    'Easy',                       // 22
    'Medium',                     // 23
    'Hard',                       // 24
    '1 Minute',                   // 25
    '2 Minute',                   // 26
    '3 Minute',                   // 27
    '(+) and (-)',                // 28
    '(+), (-), (x) and (/)',      // 29
    'Practice Game',              // 30
    'Play Game',                  // 31
    'Random',                     // 32
    'Computer',                   // 33
    'Friends',                    // 34
    'MORE',                       // 35
    'NOTIFICATION',               // 36
    'PROFILE',                    // 37
    'FRIENDS',                    // 38
    'HISTORY',                    // 39
    'STATS',                      // 40
    'ACHIEVEMENTS',               // 41
    'LEADERBOARD',                // 42
    'SETTINGS',                   // 43
    'THEME',                      // 44
    'SOUND',                      // 45
    'LANGUAGE',                   // 46
    'SUPPORT',                    // 47
    'Select Opponent',            // 48
    'Choose Level',               // 49
    'Username *',                 // 50
    'Email *',                    // 51
    'Enter your Password *',      // 52
    'Select Gender',              // 53
    'Male',                       // 54
    'Female',                     // 55
    'Others',                     // 56
    'Year of Birth',              // 57
    'Select Year',                // 58
    'Correct',                    // 59
    'Incorrect',                  // 60
    'Skipped',                    // 61
    'Clear',                      // 62
    'Skip',                       // 63
    'REV',                        // 64
    'Total Score',                // 65
    'Correct Count',              // 66
    'Incorrect Count',            // 67
    'Skipped Questions',          // 68
    'Correct Percentage',         // 69
    'New Game',                   // 70
    'Joined:',                    // 71
    'Email:',                     // 72
    'First Name:',                // 73
    'Last Name:',                 // 74
    'Year of Birth:',             // 75
    'Gender:',                    // 76
    'Country:',                   // 77
    'Unknown',                    // 78
    'N/A',                        // 79
    'Not Set',                    // 80
    'Current Rank:',              // 81
    'Achievements',               // 82
    'Upload / Camera / Icons',    // 83
    'YYYY',                       // 84
    'Select Country',             // 85
    'Discard',                    // 86
    'Close',                      // 87
    'OK',                         // 88
    'Colors',                     // 89
    'Numpad',                     // 90
    'Option 1',                   // 91
    'Option 2',                   // 92
    'Allow Notification',         // 93
    'Sound',                      // 94
    'Pts',                        // 95
    'YOU',                        // 96
    'You',                        // 97
    'Opponent',                   // 98
    'Reconnecting...',            // 99
    'VICTORY',                    // 100
    'DEFEAT',                     // 101
    'DRAW',                       // 102
    'Game Lobby',                 // 103
    'Rating',                     // 104
    'Player',                     // 105
    'Ready to Find Match',        // 106
    'Find Match',                 // 107
    'Finding opponent...',        // 108
    'Opponent Found!',            // 109
    'Looking for players with rating', // 110
    'Playing against',            // 111
    'Ready to Battle...',         // 112
    'Cancel Search',              // 113
    'Socket not connected',       // 114
    'Global',                     // 115
    'Rank',                       // 116
    'User Name',                  // 117
    'No data found',              // 118
    'E2',                         // 119
    'E4',                         // 120
    'M2',                         // 121
    'M4',                         // 122
    'H2',                         // 123
    'H4',                         // 124
    'Dark',                       // 125
    'Royal Champ',                // 126
    'Teal Fusion',                // 127
    'Forest Quest',               // 128
    'Desert Logic',               // 129
    'Blossom Dream',              // 130
    'Lava Blaze',                 // 131
    'Search Contacts',            // 132
    'Invite & Connect',           // 133
    'Invite Friends via WhatsApp or SMS', // 134
    'Facebook Friends',           // 135
    'Search Results',             // 136
    'My Friends',                 // 137
    'Username:',                  // 138
    'Name:',                      // 139
    'PvP Rating:',                // 140
    'Friend',                     // 141
    'Beginner',                   // 142
    'Amateur',                    // 143
    'Skilled',                    // 144
    'Expert',                     // 145
    'Pro',                        // 146
    'Level',                      // 147
    'W',                          // 148
    'Select Level',               // 149
    'Choose your level',          // 150
    'Select a difficulty to play against the AI', // 151
    'Game History',               // 152
    'Win',                        // 153
    'Loss',                       // 154
    'No games found',             // 155
    'Practice',                   // 156
    'CPU',                        // 157
    // ── StatsScreen ──────────────────────────────────────────────────────────
    'Highest Rating',             // 158  ✅ NEW
    'Longest Win Streak',         // 159  ✅ NEW
    'Best Win (Opponent)',         // 160  ✅ NEW
    'Ques/Sec',                   // 161  ✅ NEW
    'No. of Games Played',        // 162  ✅ NEW
    'Best Streak',                // 163  ✅ NEW
    'Best Accuracy',              // 164  ✅ NEW
    'Best Q/s',                   // 165  ✅ NEW
    'Top Score',                  // 166  ✅ NEW
    'Accuracy %',                 // 167  ✅ NEW
    'PVP Stats',                  // 168  ✅ NEW
    'Practice Stats',             // 169  ✅ NEW
    'Draw',                       // 170  ✅ NEW (different from 'Draw!' in paragraphs)
    '1 Week',    // 171
'1 Month',   // 172
'3 Months',  // 173
'1 Year',    // 174
'All Time',  // 175
  ],
};