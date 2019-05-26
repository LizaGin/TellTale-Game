import React from 'react';

export default function Warning({text}: any) {
    return (
        <div className='warning-wrapper'>
            <div className='warning-sign'>🚫</div>
            <div className='warning-text'>{text}</div>
        </div>
    );
}
