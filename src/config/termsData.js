// Each section has: { number, title, content[] }
// content items can be:
//   { type: 'para', text }
//   { type: 'bullet', text, bold? }        — bold is the prefix label
//   { type: 'subsection', number, title, content[] }
//   { type: 'nested', content[] }          — indented bullet group

const termsData = [
  {
    number: '1',
    title: 'Introduction',
    content: [
      { type: 'para', text: 'Welcome to mATHLETICS ("the App", "we", "us", or "our"). mATHLETICS is a competitive math gaming platform that transforms elementary math practice into a fun, engaging, and competitive experience. The App is operated by Pratikshit Gupta (operating as mATHLETICS), with registered address at 1702, Cielo A, Lodha Splendora, Bhayanderpada, GB Road, Thane – 400615, India.' },
      { type: 'para', text: 'These Terms and Conditions ("Terms") govern your access to and use of the mATHLETICS mobile application, website, and all related services (collectively, the "Service"). By downloading, installing, registering for, or using the App, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.' },
      { type: 'para', text: 'If you do not agree to these Terms, you must not access or use the Service.' },
      { type: 'para', text: 'The App is currently in Beta and certain features may be added, modified, or removed without prior notice. We appreciate your patience and Feedback as we continue to improve the platform.' },
    ],
  },
  {
    number: '2',
    title: 'Definitions',
    content: [
      { type: 'para', text: 'In these Terms, unless the context otherwise requires:' },
      { type: 'bullet', bold: '"User" or "You"', text: 'means any individual who accesses, downloads, installs, or uses the App, including both registered and unregistered Users.' },
      { type: 'bullet', bold: '"Account"', text: 'means the personal User Account created upon registration with the App.' },
      { type: 'bullet', bold: '"Game Session"', text: 'means a single instance of gameplay, whether in Practice Mode, Play Mode, or any other game mode offered by the App.' },
      { type: 'bullet', bold: '"Rating"', text: 'means the numerical score assigned to a User, starting at a base of 1000, which changes based on outcomes in rated Player vs Player (PvP) matches.' },
      { type: 'bullet', bold: '"Virtual Currency"', text: 'means Coins, Gems, or any other in-app digital currency used within the App.' },
      { type: 'bullet', bold: '"Content"', text: 'means all text, graphics, images, audio, software, and other materials available through the Service.' },
      { type: 'bullet', bold: '"Child"', text: 'means an individual who has not completed eighteen (18) years of age, as defined under the Digital Personal Data Protection Act, 2023 ("DPDPA").' },
      { type: 'bullet', bold: '"Parent"', text: 'includes the biological parent, adoptive parent, step-parent, or lawful guardian of a Child.' },
    ],
  },
  {
    number: '3',
    title: 'Eligibility and Account Registration',
    content: [
      {
        type: 'subsection', number: '3.1', title: 'Age Requirements',
        content: [
          { type: 'para', text: 'The App is designed as an educational math gaming platform suitable for Users of all ages. However, in compliance with the Digital Personal Data Protection Act, 2023 (DPDPA) and applicable Indian law:' },
          { type: 'bullet', text: 'Users aged 18 years and above may register and use the App independently.' },
          { type: 'bullet', text: 'Users below 18 years of age ("Child Users") may use the App only with the verifiable consent of their Parent or lawful guardian. By providing consent, the Parent acknowledges and agrees to these Terms on behalf of the Child.' },
          { type: 'bullet', text: 'We may require verification of the identity and age of the User and, where applicable, verification of the Parent\'s identity and consent, before permitting access to the App.' },
        ],
      },
      {
        type: 'subsection', number: '3.2', title: 'Account Creation',
        content: [
          { type: 'para', text: 'To access certain features of the App, you must create an Account. You may register using:' },
          { type: 'bullet', text: 'Social login (Google, Apple, or Facebook authentication)' },
          { type: 'bullet', text: 'Email-based registration' },
          { type: 'para', text: 'During registration, you will be required to provide certain information, including your name, gender, age, and location. You represent and warrant that all information provided during registration is accurate, current, and complete, and you agree to update such information to maintain its accuracy.' },
        ],
      },
      {
        type: 'subsection', number: '3.3', title: 'Account Security',
        content: [
          { type: 'para', text: 'You are solely responsible for maintaining the confidentiality of your Account credentials and for all activities that occur under your Account. You agree to immediately notify us of any unauthorised access to or use of your Account. We shall not be liable for any loss or damage arising from your failure to protect your Account credentials.' },
        ],
      },
      {
        type: 'subsection', number: '3.4', title: 'One Account Per User',
        content: [
          { type: 'para', text: 'Each User is permitted to maintain only one Account. Creating multiple Accounts to manipulate Ratings, Leaderboards, or game outcomes is strictly prohibited and may result in permanent suspension of all associated Accounts.' },
        ],
      },
    ],
  },
  {
    number: '4',
    title: 'Description of the Service',
    content: [
      {
        type: 'subsection', number: '4.1', title: 'Game Overview',
        content: [
          { type: 'para', text: 'mATHLETICS is a timer-based competitive math game where players solve arithmetic problems within fixed time limits. The game is available in three time durations: 1 Minute, 2 Minutes, and 3 Minutes.' },
        ],
      },
      {
        type: 'subsection', number: '4.2', title: 'Difficulty Levels and Variants',
        content: [
          { type: 'para', text: 'Players choose from three difficulty levels (Easy, Medium, and Hard) and two symbol sets:' },
          { type: 'bullet', bold: '2-Symbol:', text: 'Addition (+) and Subtraction (−)' },
          { type: 'bullet', bold: '4-Symbol:', text: 'Addition (+), Subtraction (−), Multiplication (×), and Division (÷)' },
          { type: 'para', text: 'This creates six game variants: E2 (Easy, 2-Symbol), E4 (Easy, 4-Symbol), M2 (Medium, 2-Symbol), M4 (Medium, 4-Symbol), H2 (Hard, 2-Symbol), and H4 (Hard, 4-Symbol).' },
        ],
      },
      {
        type: 'subsection', number: '4.3', title: 'Game Modes',
        content: [
          { type: 'para', text: 'The App offers the following game modes:' },
          { type: 'bullet', bold: 'Practice Mode:', text: 'An unrated, non-competitive mode where Users solve problems to build skills and earn points without affecting their Rating.' },
          { type: 'bullet', bold: 'Play Mode', text: ', comprising three sub-modes:' },
          {
            type: 'nested',
            content: [
              { type: 'bullet', bold: 'Random Player (Rated):', text: 'The App automatically matches you with another player within approximately ±100 of your current Rating. Results affect your Rating.' },
              { type: 'bullet', bold: 'Friends (Non-Rated):', text: 'Play a friendly match against Users in your Friends list. These matches do not affect your Rating.' },
            ],
          },
        ],
      },
      {
        type: 'subsection', number: '4.4', title: 'Rating System',
        content: [
          { type: 'para', text: 'Each User starts with a base Rating of 1000. Your Rating changes based on the outcome of rated Player vs Player (PvP) matches in Random Player mode. The Rating system is designed to match you with players of comparable skill level. Manipulation of the Rating system through deliberate losing, use of multiple Accounts, or collusion is strictly prohibited.' },
        ],
      },
      {
        type: 'subsection', number: '4.5', title: 'Additional Features',
        content: [
          { type: 'para', text: 'The App includes the following features, which may be updated or expanded from time to time:' },
          { type: 'bullet', bold: 'Leaderboards:', text: 'Global, country-wise, and friends-based rankings.' },
          { type: 'bullet', bold: 'Achievements:', text: 'Badges awarded for completing specific milestones and tasks.' },
          { type: 'bullet', bold: 'Friends System:', text: 'Add other Users as Friends to challenge them to friendly matches.' },
          { type: 'bullet', bold: 'In-Game Reactions:', text: 'Share reactions with opponents during multiplayer matches.' },
          { type: 'bullet', bold: 'Themes:', text: 'Customisable visual themes for the game interface.' },
          { type: 'bullet', bold: 'History and Statistics:', text: 'View your game history, performance statistics, and key metrics.' },
          { type: 'bullet', bold: 'Sound Settings:', text: 'Toggle game sounds and music.' },
          { type: 'bullet', bold: 'Language Support:', text: 'The App may support languages other than English.' },
          { type: 'bullet', bold: 'Notifications:', text: 'In-app and push notifications regarding game updates, friend requests, and match invitations.' },
        ],
      },
    ],
  },
  {
    number: '5',
    title: 'User Conduct and Acceptable Use',
    content: [
      {
        type: 'subsection', number: '5.1', title: 'General Conduct',
        content: [
          { type: 'para', text: 'You agree to use the App in a manner consistent with all applicable laws and regulations and in accordance with these Terms. You shall not:' },
          { type: 'bullet', text: 'Use the App for any unlawful, fraudulent, or malicious purpose.' },
          { type: 'bullet', text: 'Attempt to gain unauthorised access to the App, its servers, or any related systems or networks.' },
          { type: 'bullet', text: 'Use any automated means, bots, scripts, or cheating tools to interact with the App or gain an unfair advantage.' },
          { type: 'bullet', text: 'Interfere with or disrupt the integrity, performance, or security of the App.' },
          { type: 'bullet', text: 'Exploit bugs, glitches, or vulnerabilities in the App. You agree to report any such issues to us promptly.' },
          { type: 'bullet', text: 'Impersonate any person or entity, or falsely state or misrepresent your identity or affiliation.' },
        ],
      },
      {
        type: 'subsection', number: '5.2', title: 'Fair Play Policy',
        content: [
          { type: 'para', text: 'mATHLETICS is committed to a fair and enjoyable gaming environment. The following are strictly prohibited:' },
          { type: 'bullet', bold: 'Rating Manipulation:', text: 'Deliberately losing matches, using secondary Accounts to inflate or deflate Ratings, or colluding with other Users to manipulate match outcomes.' },
          { type: 'bullet', bold: 'Match Fixing:', text: 'Any arrangement between players to predetermine the outcome of a match.' },
          { type: 'bullet', bold: 'Cheating:', text: 'Use of external tools, screen-sharing during matches, or any other method that provides an unfair advantage.' },
          { type: 'bullet', bold: 'Exploiting Matchmaking:', text: 'Deliberately disconnecting during matches to avoid losses or manipulate the matchmaking system.' },
          { type: 'para', text: 'Violations of the Fair Play Policy may result in warnings, temporary suspension, Rating penalties, or permanent Account termination at our sole discretion.' },
        ],
      },
      {
        type: 'subsection', number: '5.3', title: 'Communication and Social Features',
        content: [
          { type: 'para', text: 'When using in-game reactions, friend features, or any other communication tools, you agree not to:' },
          { type: 'bullet', text: 'Send or display Content that is offensive, abusive, obscene, threatening, defamatory, or otherwise objectionable.' },
          { type: 'bullet', text: 'Harass, bully, intimidate, or stalk other Users.' },
          { type: 'bullet', text: 'Send unsolicited or spam communications.' },
          { type: 'bullet', text: 'Share Content that promotes violence, discrimination, or illegal activities.' },
          { type: 'para', text: 'We reserve the right to monitor communications for compliance and to remove any Content that violates these Terms.' },
        ],
      },
    ],
  },
  {
    number: '6',
    title: 'Virtual Currency and In-App Purchases',
    content: [
      {
        type: 'subsection', number: '6.1', title: 'Virtual Currency',
        content: [
          { type: 'para', text: 'The App may award Virtual Currency (such as Coins and Gems) through gameplay, Achievements, daily logins, or other activities. Virtual Currency is a limited, non-transferable, non-exchangeable, revocable licence to use a digital feature within the App. Virtual Currency:' },
          { type: 'bullet', text: 'Has no real-world monetary value and cannot be exchanged for cash, real currency, or any item of monetary value.' },
          { type: 'bullet', text: 'Cannot be transferred, sold, traded, or gifted to other Users.' },
          { type: 'bullet', text: 'May be modified, limited, or removed by us at any time.' },
          { type: 'bullet', text: 'Will be forfeited upon termination or deletion of your Account.' },
        ],
      },
      {
        type: 'subsection', number: '6.2', title: 'Future In-App Purchases',
        content: [
          { type: 'para', text: 'We may, in future versions of the App, introduce the ability to purchase Virtual Currency or in-app items using real money ("In-App Purchases"). When such features are introduced, separate terms governing In-App Purchases will be communicated, and these Terms will be updated accordingly. All In-App Purchases will be subject to the refund and cancellation policies of the respective app store (Google Play Store or Apple App Store).' },
        ],
      },
    ],
  },
  {
    number: '7',
    title: 'Intellectual Property Rights',
    content: [
      {
        type: 'subsection', number: '7.1', title: 'Ownership',
        content: [
          { type: 'para', text: 'All rights, title, and interest in and to the App, including but not limited to its design, layout, graphics, icons, images, audio, text, software, source code, algorithms, game mechanics, Rating system, question engine, and all other Content, are and shall remain the exclusive property of Pratikshit Gupta (operating as mATHLETICS) or its licensors. The App is protected under applicable copyright, trademark, and intellectual property laws of India and international treaties.' },
        ],
      },
      {
        type: 'subsection', number: '7.2', title: 'Limited Licence',
        content: [
          { type: 'para', text: 'Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable licence to download, install, and use the App on a compatible mobile device solely for your personal, non-commercial use.' },
        ],
      },
      {
        type: 'subsection', number: '7.3', title: 'Restrictions',
        content: [
          { type: 'para', text: 'You shall not:' },
          { type: 'bullet', text: 'Copy, modify, adapt, translate, reverse engineer, decompile, or disassemble any part of the App.' },
          { type: 'bullet', text: 'Create derivative works based on the App or any of its Content.' },
          { type: 'bullet', text: 'Remove, alter, or obscure any copyright, trademark, or proprietary notices.' },
          { type: 'bullet', text: 'Use the App for any commercial purpose without prior written consent.' },
          { type: 'bullet', text: 'Distribute, sublicence, lease, rent, or lend the App to any third party.' },
        ],
      },
      {
        type: 'subsection', number: '7.4', title: 'User Feedback',
        content: [
          { type: 'para', text: 'Any Feedback, suggestions, ideas, or recommendations you provide regarding the App ("Feedback") shall be deemed non-confidential and non-proprietary. We shall have the unrestricted right to use, reproduce, modify, and distribute such Feedback without obligation or compensation to you.' },
        ],
      },
    ],
  },
  {
    number: '8',
    title: 'Privacy and Data Protection',
    content: [
      {
        type: 'subsection', number: '8.1', title: 'Personal Data Collection',
        content: [
          { type: 'para', text: 'We collect and process certain personal data to provide and improve the Service. The categories of personal data collected include:' },
          { type: 'bullet', bold: 'Registration Data:', text: 'Name, email address, gender, age, and location.' },
          { type: 'bullet', bold: 'Social Login Data:', text: 'Information received from Google, Apple, or Facebook when you authenticate via social login, including your name, email address, and profile picture.' },
          { type: 'bullet', bold: 'Gameplay Data:', text: 'Game session details, scores, Ratings, Achievements, question responses, and time taken.' },
          { type: 'bullet', bold: 'Device Data:', text: 'Device type, operating system, app version, unique device identifiers, and crash reports.' },
          { type: 'bullet', bold: 'Analytics Data:', text: 'App usage patterns, feature interaction data, session duration, and in-app events collected through Firebase Analytics.' },
          { type: 'bullet', bold: 'Notification Data:', text: 'Push notification tokens managed through Firebase Cloud Messaging (FCM).' },
        ],
      },
      {
        type: 'subsection', number: '8.2', title: 'Purpose of Data Processing',
        content: [
          { type: 'para', text: 'Your personal data is processed for the following purposes:' },
          { type: 'bullet', text: 'To create and manage your Account and User Profile.' },
          { type: 'bullet', text: 'To provide gameplay functionality, matchmaking, and Rating calculations.' },
          { type: 'bullet', text: 'To maintain Leaderboards, Achievements, and game history.' },
          { type: 'bullet', text: 'To send in-app and push notifications relevant to your game activity.' },
          { type: 'bullet', text: 'To analyse app usage, diagnose technical issues, and improve the Service.' },
          { type: 'bullet', text: 'To ensure fair play and detect violations of these Terms.' },
          { type: 'bullet', text: 'To comply with applicable legal obligations.' },
        ],
      },
      {
        type: 'subsection', number: '8.3', title: "Children's Data Protection",
        content: [
          { type: 'para', text: 'We are committed to protecting the personal data of Children in compliance with Section 9 of the Digital Personal Data Protection Act, 2023 (DPDPA). The following safeguards apply:' },
          { type: 'bullet', bold: 'Verifiable Parental Consent:', text: 'We shall obtain verifiable consent from the Parent or lawful guardian of a Child before processing any personal data of such Child.' },
          { type: 'bullet', bold: 'No Tracking or Behavioural Monitoring of Children:', text: 'We shall not undertake tracking or behavioural monitoring of Child Users, nor shall we engage in targeted advertising directed at Children, as prohibited under the DPDPA.' },
          { type: 'bullet', bold: 'No Detrimental Processing:', text: 'We shall not process the personal data of a Child in any manner that is likely to cause any detrimental effect on the well-being of such Child.' },
          { type: 'bullet', bold: 'Data Minimisation:', text: 'We collect only the minimum personal data necessary to provide the Service to Child Users.' },
          { type: 'bullet', bold: "Parent's Rights:", text: "Parents may review, modify, or request deletion of their Child's personal data at any time by contacting us at the details provided in Section 16." },
        ],
      },
      {
        type: 'subsection', number: '8.4', title: 'Data Storage and Security',
        content: [
          { type: 'para', text: 'Your personal data is stored on secure servers hosted on Amazon Web Services (AWS) infrastructure located in India. We implement industry-standard technical and organisational measures to protect your data against unauthorised access, alteration, disclosure, or destruction, including encryption, access controls, and regular security audits.' },
        ],
      },
      {
        type: 'subsection', number: '8.5', title: 'Third-Party Services',
        content: [
          { type: 'para', text: 'The App uses the following third-party services that may collect and process data in accordance with their own privacy policies:' },
          { type: 'bullet', bold: 'Firebase (Google LLC):', text: 'For push notifications (Firebase Cloud Messaging) and app analytics (Firebase Analytics).' },
          { type: 'bullet', bold: 'OAuth Providers (Google, Apple, Facebook):', text: 'For social login authentication.' },
          { type: 'para', text: 'We recommend that you review the privacy policies of these third-party services. We are not responsible for the data practices of third-party providers.' },
        ],
      },
      {
        type: 'subsection', number: '8.6', title: 'Data Retention',
        content: [
          { type: 'para', text: "We retain your personal data for as long as your Account is active or as needed to provide the Service. Upon Account deletion, your personal data will be deleted or anonymised within a reasonable period, except where retention is required by law or for legitimate business purposes such as fraud prevention or dispute resolution." },
        ],
      },
      {
        type: 'subsection', number: '8.7', title: 'Your Data Rights',
        content: [
          { type: 'para', text: 'Under the DPDPA and applicable law, you have the following rights:' },
          { type: 'bullet', bold: 'Right to Access:', text: 'You may request information about the personal data we hold about you.' },
          { type: 'bullet', bold: 'Right to Correction:', text: 'You may request correction of inaccurate or incomplete personal data.' },
          { type: 'bullet', bold: 'Right to Erasure:', text: 'You may request deletion of your personal data, subject to legal and contractual obligations.' },
          { type: 'bullet', bold: 'Right to Grievance Redressal:', text: 'You may raise concerns regarding data processing by contacting our Grievance Officer (see Section 16).' },
          { type: 'para', text: 'To exercise any of these rights, please contact us using the details in Section 16.' },
        ],
      },
    ],
  },
  {
    number: '9',
    title: 'Disclaimers',
    content: [
      {
        type: 'subsection', number: '9.1', title: 'Beta Disclaimer',
        content: [
          { type: 'para', text: 'The App is currently provided as a Beta version. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, regarding the reliability, accuracy, availability, or completeness of the App or its Content. Features may be added, modified, or removed during the Beta period without prior notice.' },
        ],
      },
      {
        type: 'subsection', number: '9.2', title: 'No Warranty',
        content: [
          { type: 'para', text: 'To the maximum extent permitted by applicable law, we expressly disclaim all warranties, whether express, implied, statutory, or otherwise, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation.' },
        ],
      },
      {
        type: 'subsection', number: '9.3', title: 'Service Availability',
        content: [
          { type: 'para', text: 'We do not guarantee that the App will be available at all times or that it will be free from interruptions, delays, errors, or defects. We reserve the right to suspend, modify, or discontinue the Service (or any part thereof) at any time, with or without notice, and without liability to you.' },
        ],
      },
    ],
  },
  {
    number: '10',
    title: 'Limitation of Liability',
    content: [
      { type: 'para', text: 'To the fullest extent permitted by applicable Indian law:' },
      { type: 'bullet', text: 'In no event shall Pratikshit Gupta (operating as mATHLETICS), its affiliates, officers, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses.' },
      { type: 'bullet', text: 'We shall not be liable for any loss or damage resulting from reliance on information provided through the App, actions of other Users, or unauthorised access to your Account.' },
      { type: 'para', text: 'Nothing in these Terms shall exclude or limit liability that cannot be excluded or limited under applicable law.' },
    ],
  },
  {
    number: '11',
    title: 'Indemnification',
    content: [
      { type: 'para', text: 'You agree to indemnify, defend, and hold harmless Pratikshit Gupta (operating as mATHLETICS) and its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorney\'s fees) arising from:' },
      { type: 'bullet', text: 'Your use of the App or the Service.' },
      { type: 'bullet', text: 'Your violation of these Terms.' },
      { type: 'bullet', text: 'Your violation of any applicable law or the rights of any third party.' },
      { type: 'bullet', text: 'Any Content you submit, post, or transmit through the App.' },
    ],
  },
  {
    number: '12',
    title: 'Termination',
    content: [
      {
        type: 'subsection', number: '12.1', title: 'Termination by You',
        content: [
          { type: 'para', text: 'You may terminate your Account at any time by contacting us at the email address provided in Section 16 or through the Account settings within the App. Upon termination, your right to use the Service will immediately cease.' },
        ],
      },
      {
        type: 'subsection', number: '12.2', title: 'Termination by Us',
        content: [
          { type: 'para', text: 'We reserve the right to suspend or terminate your Account and access to the Service, in whole or in part, at any time and for any reason, including but not limited to:' },
          { type: 'bullet', text: 'Violation of these Terms, including the Fair Play Policy.' },
          { type: 'bullet', text: 'Engaging in fraudulent, abusive, or illegal activity.' },
          { type: 'bullet', text: 'Prolonged inactivity of your Account.' },
          { type: 'bullet', text: 'Technical or security reasons.' },
          { type: 'bullet', text: 'Discontinuation of the Service.' },
        ],
      },
      {
        type: 'subsection', number: '12.3', title: 'Effect of Termination',
        content: [
          { type: 'para', text: 'Upon termination of your Account, whether by you or by us:' },
          { type: 'bullet', text: 'All licences granted to you under these Terms shall immediately terminate.' },
          { type: 'bullet', text: 'All Virtual Currency, Achievements, and game progress associated with your Account will be permanently forfeited.' },
          { type: 'bullet', text: 'We may retain certain data as required by law or for legitimate business purposes.' },
          { type: 'bullet', text: 'Sections that by their nature should survive termination shall continue to apply, including Sections 7 (Intellectual Property), 8 (Privacy), 10 (Limitation of Liability), 11 (Indemnification), and 14 (Governing Law).' },
        ],
      },
    ],
  },
  {
    number: '13',
    title: 'Modifications to the Terms',
    content: [
      { type: 'para', text: 'We reserve the right to modify these Terms at any time. If we make material changes, we will notify you through the App (via in-app notification or pop-up) or via email to the address associated with your Account, at least fifteen (15) days before the changes take effect.' },
      { type: 'para', text: 'Your continued use of the App after the effective date of the revised Terms constitutes your acceptance of the changes. If you do not agree with the revised Terms, you must discontinue use of the App and delete your Account.' },
    ],
  },
  {
    number: '14',
    title: 'Governing Law and Dispute Resolution',
    content: [
      {
        type: 'subsection', number: '14.1', title: 'Governing Law',
        content: [
          { type: 'para', text: 'These Terms shall be governed by and construed in accordance with the laws of India, including the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023, and the Consumer Protection Act, 2019, as applicable.' },
        ],
      },
      {
        type: 'subsection', number: '14.2', title: 'Dispute Resolution',
        content: [
          { type: 'para', text: 'In the event of any dispute, controversy, or claim arising out of or relating to these Terms or the Service, the parties shall first attempt to resolve the matter amicably through good-faith negotiation for a period of thirty (30) days from the date of written notice of the dispute.' },
          { type: 'para', text: 'If the dispute is not resolved through negotiation, it shall be referred to and finally resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996 (as amended). The arbitration shall be conducted by a sole arbitrator, the seat of arbitration shall be Mumbai, India, and the language of arbitration shall be English.' },
        ],
      },
      {
        type: 'subsection', number: '14.3', title: 'Jurisdiction',
        content: [
          { type: 'para', text: 'Subject to the arbitration clause above, the courts of Mumbai, Maharashtra, India shall have exclusive jurisdiction over any proceedings relating to these Terms.' },
        ],
      },
    ],
  },
  {
    number: '15',
    title: 'General Provisions',
    content: [
      {
        type: 'subsection', number: '15.1', title: 'Entire Agreement',
        content: [
          { type: 'para', text: 'These Terms, together with the Privacy Policy and any other legal notices published by us on the App, constitute the entire agreement between you and us regarding the use of the Service and supersede all prior agreements, understandings, and arrangements.' },
        ],
      },
      {
        type: 'subsection', number: '15.2', title: 'Severability',
        content: [
          { type: 'para', text: 'If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions shall continue in full force and effect.' },
        ],
      },
      {
        type: 'subsection', number: '15.3', title: 'Waiver',
        content: [
          { type: 'para', text: 'No failure or delay by us in exercising any right or remedy under these Terms shall operate as a waiver thereof, nor shall any single or partial exercise of any right or remedy preclude any further exercise of that or any other right or remedy.' },
        ],
      },
      {
        type: 'subsection', number: '15.4', title: 'Assignment',
        content: [
          { type: 'para', text: 'You may not assign or transfer these Terms or any rights granted hereunder without our prior written consent. We may assign these Terms freely, including in connection with a merger, acquisition, sale of assets, or by operation of law.' },
        ],
      },
      {
        type: 'subsection', number: '15.5', title: 'Force Majeure',
        content: [
          { type: 'para', text: 'We shall not be liable for any failure or delay in performing our obligations under these Terms due to events beyond our reasonable control, including but not limited to natural disasters, acts of government, war, terrorism, pandemic, epidemic, power failures, internet disruptions, or any other force majeure event.' },
        ],
      },
      {
        type: 'subsection', number: '15.6', title: 'Notices',
        content: [
          { type: 'para', text: 'All notices from us to you may be delivered via email, in-app notification, or by posting on the App. Notices from you to us must be sent to the contact details provided in Section 16.' },
        ],
      },
      {
        type: 'subsection', number: '15.7', title: 'No Third-Party Beneficiaries',
        content: [
          { type: 'para', text: 'These Terms do not create any rights for any third party, except as expressly provided herein.' },
        ],
      },
    ],
  },
  {
    number: '16',
    title: 'Contact Information and Grievance Officer',
    content: [
      { type: 'para', text: 'If you have any questions, concerns, or complaints about these Terms or the App, please contact us at:' },
      { type: 'bullet', bold: 'Name:', text: 'Pratikshit Gupta (operating as mATHLETICS)' },
      { type: 'bullet', bold: 'Address:', text: '1702, Cielo A, Lodha Splendora, Bhayanderpada, GB Road, Thane – 400615, India' },
      { type: 'bullet', bold: 'Email:', text: 'pratikshit2109@gmail.com' },
      {
        type: 'subsection', number: '', title: 'Grievance Officer',
        content: [
          { type: 'para', text: 'In accordance with the Information Technology Act, 2000 and the rules made thereunder, and the Digital Personal Data Protection Act, 2023, the name and contact details of the Grievance Officer are:' },
          { type: 'bullet', bold: 'Name:', text: 'Pratikshit Gupta' },
          { type: 'bullet', bold: 'Email:', text: 'mathletics.feedback@gmail.com' },
          { type: 'para', text: 'Any grievance or complaint shall be addressed within thirty (30) days of receipt.' },
        ],
      },
    ],
  },
];

export default termsData;