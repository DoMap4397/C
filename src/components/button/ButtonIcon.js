import React from 'react';
import { Button } from 'antd';

const ButtonIcon = (props) => {

    return (
        <Button className="button-style icon" {...props}>
            {props.children}
        </Button>
    );
}

export default ButtonIcon;