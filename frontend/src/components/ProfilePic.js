// ProfilePic.js
import React, { useState } from 'react';
import Profile from './Profile';
import TopBar from './Topbar';

export default function ProfilePic() {
  const [avatarSrc, setAvatarSrc] = useState(require('../img/logo.png'));

  const handleAvatarChange = (newAvatarSrc) => {
    setAvatarSrc(newAvatarSrc);
  };

  return (
    <>
      <TopBar avatarSrc={avatarSrc} />
      <Profile avatarSrc={avatarSrc} onAvatarChange={handleAvatarChange} />
    </>
  );
}
