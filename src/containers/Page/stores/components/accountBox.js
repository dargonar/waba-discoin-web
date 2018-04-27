import React from 'react';
import Button from '../../../../components/uielements/button';
import Card from '../../../../components/uielements/card';

const style={
    box: {
        borderRadius: '7px',
        overflow: 'hidden',
        margin: '10px',
    },
    button: {

    }
}

const AccountBox = ({name, type, dailyPermission, changeAmmount, changePassword}) => (
    <Card 
        style={style.box}
        title={'Account: '+ name}
        actions={[
            (<Button onClick={changeAmmount}>Change Ammount</Button>),
            (<Button onClick={changePassword}>Change Password</Button>)
        ]}>
        <p><b>Type:</b> {type}</p>
        <p><b>Daily Permission:</b> {dailyPermission}</p>
    </Card> 
)


export default AccountBox;
