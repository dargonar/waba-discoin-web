import React from 'react';
import Card from '../../../../components/uielements/card';
import HashImage from '../../../../components/hashImage';
import { Icon, Tooltip } from 'antd'

const style={
    box: {
        borderRadius: '7px',
        overflow: 'hidden',
        margin: '10px',
    },
    button: {

    }
}

const BtnInfo = ({ text, icon, action }) => (
    <Tooltip title={text}>
        <Icon type={icon} onClick={action} />
    </Tooltip>
)

const AccountBox = ({name, type, dailyPermission, changeAmount, changePassword}) => (
    <Card 
        style={style.box}
        actions={[
            (<BtnInfo text='Change amount' icon='edit' action={changeAmount} />)
        ]}>
        <Card.Meta
        avatar={<HashImage text={name} size={50} />}
        title={name}
        description={(<p>
            <b>Type:</b> {type}<br/>
            <b>Daily Permission:</b> DSC {Number(dailyPermission).toLocaleString()}</p>)} />
    </Card> 
)


export default AccountBox;
