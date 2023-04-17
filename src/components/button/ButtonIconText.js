import React from 'react';
import { Button } from 'antd';

const ButtonIconText = (props) => {

    return (
        <Button className="button-style icon-text" {...props}>
            {props.children}
        </Button>
    );
}

export default ButtonIconText;