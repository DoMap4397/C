import React from 'react';
import { Button } from 'antd';

const ActionTable = (props) => {

    return (
        <Button className="action-table-style" {...props}>
            {props.children}
        </Button>
    );
}

export default ActionTable;