// Navbar.js
import { useState } from "react";
import { signOut } from "next-auth/react";
import styles from "./assets/navbar.module.css";
import Image from "next/image";

export default function Navbar({ userName, userImage }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navProfile}>
        <div className={styles.logo}>Lyink</div>
        <div className={styles.userInfo}>
          <span>{userName}</span>
          <div className={styles.profilePicture} onClick={toggleDropdown}>
            <img src={userImage} alt="Profile picture" width={40} height={40} />
            {dropdownVisible && (
              <div className={styles.dropdown}>
                <button onClick={handleSignOut}>Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
