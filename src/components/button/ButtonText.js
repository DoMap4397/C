import React from 'react';
import { Button } from 'antd';

const ButtonText = (props) => {

    return (
        <Button className="button-style text" {...props}>
            {props.children}
        </Button>
    );
}

export default ButtonText;