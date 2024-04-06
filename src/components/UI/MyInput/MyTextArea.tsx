import React from 'react';
import style from './MyInput.module.scss'

const MyTextArea = ({...props}) => {
    return (
        <div>
            <textarea className={`${style.MyTextArea}`} {...props}/>
            <p className={style.MyInputError}>{props?.errorText}</p>
        </div>
    );
};

export default MyTextArea;