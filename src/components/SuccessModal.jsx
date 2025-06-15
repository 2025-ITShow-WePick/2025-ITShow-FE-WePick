import React from 'react';
import Logo from './Logo';
import styles from './SuccessModal.module.css';

const SuccessModal = ({
    isVisible,
    type, // 'upload' | 'camera'
    onClose
}) => {
    if (!isVisible) return null;

    const getModalContent = () => {
        switch (type) {
            case 'upload':
                return {
                    title: '위픽 업로드 성공!',
                    subtitle: '올려주셔서 업로드를 성공적으로 완료했습니다.'
                };
            case 'camera':
                return {
                    title: '곧 촬영을 시작합니다',
                    subtitle: '준비해주세요'
                };
            default:
                return {
                    title: '',
                    subtitle: ''
                };
        }
    };

    const { title, subtitle } = getModalContent();

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <Logo size="small" className={styles.successLogo} />
                <h2 className={styles.modalTitle}>
                    {title}
                </h2>
                <p className={type === 'camera' ? styles.cameraSubTitle : styles.modalSubtitle}>
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

export default SuccessModal;