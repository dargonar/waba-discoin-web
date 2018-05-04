import React from 'react'
import jsSHA from 'jssha';
import Identicon from 'identicon.js';

const getSHA = (text) => {
    const result = new jsSHA('SHA-512', 'TEXT')
    result.update(text)
    return result.getHash("HEX");
}

const HashImg = ({size, text, style, alt}) => (
    <img src={'data:image/png;base64,' + new Identicon(getSHA(text || ''), size || 430).toString()} style={style} alt={alt || ''}/>
)

export default HashImg
