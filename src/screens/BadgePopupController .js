// import React from 'react';
// import { useBadge } from '../context/BadgeContext';
// import BadgePopup from './BadgePopup'; // adjust path if needed

// const BadgePopupController = () => {
//   const { earnedBadges, setEarnedBadges } = useBadge();

//   if (!earnedBadges || earnedBadges.length === 0) return null;

//   const handleFinish = () => {
//     // Remove the first badge (or batch) from the queue once popup is done
//     setEarnedBadges((prev) => prev.slice(1));
//   };

//   // Show one badge at a time — pass just the first item as a single-element array
//   return (
//     <BadgePopup
//       badges={[earnedBadges[0]]}
//       onFinish={handleFinish}
//     />
//   );
// };

// export default BadgePopupController;


import React from 'react';
import { useBadge } from '../context/BadgeContext';
import BadgePopup from './BadgePopup';

const BadgePopupController = () => {
  const { earnedBadges, setEarnedBadges } = useBadge();

  if (!earnedBadges || earnedBadges.length === 0) return null;

  const handleFinish = () => {
    console.log('[BadgePopupController] Badge dismissed — shifting queue');
    setEarnedBadges((prev) => prev.slice(1));
  };

  return (
    <BadgePopup
      badges={[earnedBadges[0]]}
      onFinish={handleFinish}
    />
  );
};

export default BadgePopupController;