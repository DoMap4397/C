import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from 'antd';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    ListGroup,
    ListGroupItem
} from 'reactstrap';

const SelectColumnsTable = (props) => {

    const genContnet = () => {

        let items = props.columns.map((col) => {
            return <ListGroupItem
                key={uuidv4()}
                tag="div">
                <Checkbox
                    checked={col.visible}
                    onChange={(e) => props.onChange(col.dataField, e.target.checked)}>
                    {col.text}
                </Checkbox>
            </ListGroupItem>
        });

        return <ListGroup key={uuidv4()} flush>
            {items}
        </ListGroup>
    };

    return (
        <div className="select-columns-table">
            <UncontrolledDropdown direction="up">
                <DropdownToggle tag="button" title={props.title}>
                    <i className="fa-solid fa-list" />
                </DropdownToggle>
                <DropdownMenu container="body" className="select-columns-content" >
                    {genContnet()}
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    );
}

export default SelectColumnsTable;
