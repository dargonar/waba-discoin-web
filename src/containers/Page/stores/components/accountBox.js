import React from 'react';
import Button from '../../../../components/uielements/button';
import Card from '../../../../components/uielements/card';
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

const AccountBox = ({name, type, dailyPermission, changeAmmount, changePassword}) => (
    <Card 
        style={style.box}
        title={'Account: '+ name}
        actions={[
            (<BtnInfo text='Change ammount' icon='edit' action={changeAmmount} />),
            (<BtnInfo text='Change password' icon='unlock' action={changePassword} />)
        ]}>
        <p><b>Type:</b> {type}</p>
        <p><b>Daily Permission:</b> {dailyPermission}</p>
    </Card> 
)


export default AccountBox;
