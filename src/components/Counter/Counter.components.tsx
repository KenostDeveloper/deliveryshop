import React from 'react';
import styles from './Counter.module.css'


const Counter = ({count, setCount}: any) => {

    return (
        <div className={styles.Counter}>
            <div className={styles.click} onClick={() => count > 0 ? setCount(count - 1) : ""}>
                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L11 1" stroke={count > 0 ? '#02121C' : '#7F7F7F'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <p className={styles.count}>{count}</p>
            <div className={styles.click} onClick={() => setCount(count + 1)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11M1 6H11" stroke="#02121C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    );
};

export default Counter;