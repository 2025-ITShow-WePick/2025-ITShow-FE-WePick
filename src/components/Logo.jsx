import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Logo.module.css";

import wepickLogo from "../assets/images/wepick_logo.png";

// export default function Logo() {


//   return (
//     <img
//       src={wepickLogo}
//       className={styles.wepickLogo}
//       alt="logo"
//       onClick={handleClick}
//     />
//   );
// }

export default function Logo({ size = 'default' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Logo clicked");
    navigate("/");
  };
  const sizeStyle = {
    default: { width: '84px', height: '91px' },
    // large: { width: '150px', height: 'auto' },
    small: { width: '57px', height: 'auto', margin: '0' }
  }[size];

  return <img src={wepickLogo}
    className={styles.wepickLogo}
    alt="logo"
    onClick={handleClick} style={sizeStyle} />;
};
