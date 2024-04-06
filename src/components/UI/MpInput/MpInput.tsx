import React from 'react';
import style from './MpInput.module.css'

const MpInput = ({...props}) => {
    return (
        <div>
            <input className={style.MpInput} {...props}/>
            <p className={style.MpInputError}>{props?.errorText}</p>
        </div>
    );
};

export default MpInput;