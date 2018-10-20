import React from 'react'
import jsSHA from 'jssha';
import Identicon from 'identicon.js';

const getSHA = (text) => {
    const result = new jsSHA('SHA-512', 'TEXT')
    result.update(text.replace('discoin.'))
    return result.getHash("HEX");
}

export const getBase64 = (text,size) => {
		let my_text = text.replace('discoin.');
    return 'data:image/png;base64,' + new Identicon(getSHA(my_text || ''), size || 430).toString()
}

const HashImg = ({size, text, style, alt}) => (
    <img src={getBase64(text,size)} style={style} alt={alt || ''}/>
)

export default HashImg
