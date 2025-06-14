// components/Dropdown.jsx
import React, { useRef, useEffect } from 'react';
import styles from '../styles/CreatePostPage.module.css'; // 또는 Dropdown.module.css를 새로 만드셔도 OK

const Dropdown = ({ trigger, menu, isOpen, setIsOpen }) => {
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className={styles.dropdownWrapper} ref={ref}>
            <div
                className={`${styles.dropdownInput} ${isOpen ? styles.dropdownInputOpen : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
            >
                {trigger}
                <span className={styles.dropdownIcon}>
                    <svg width="20" height="20" viewBox="-1 0 27 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.86035 7.24935C5.86035 7.61767 6.00667 7.97091 6.26711 8.23135C6.52755 8.49179 6.88079 8.6381 7.24911 8.6381C7.61743 8.6381 7.97066 8.49179 8.2311 8.23135C8.49155 7.97091 8.63786 7.61767 8.63786 7.24935C8.63786 6.88103 8.49155 6.52779 8.2311 6.26735C7.97066 6.00691 7.61743 5.8606 7.24911 5.8606C6.88079 5.8606 6.52755 6.00691 6.26711 6.26735C6.00667 6.52779 5.86035 6.88103 5.86035 7.24935Z" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 5.16626V12.3489C1.00016 13.0855 1.29289 13.7918 1.81381 14.3126L12.5211 25.0199C13.1488 25.6474 14 26 14.8875 26C15.7751 26 16.6263 25.6474 17.254 25.0199L25.0199 17.254C25.6474 16.6263 26 15.7751 26 14.8875C26 14 25.6474 13.1488 25.0199 12.5211L14.3126 1.81381C13.7918 1.29289 13.0855 1.00016 12.3489 1H5.16626C4.0613 1 3.0016 1.43894 2.22027 2.22027C1.43894 3.0016 1 4.0613 1 5.16626Z" stroke="#939393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
            {isOpen && <div className={styles.dropdownMenu}>{menu}</div>}
        </div>
    );
};

export default Dropdown;
