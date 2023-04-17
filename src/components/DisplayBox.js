import React, { useState, useEffect } from "react";
import { Card, CardHeader, Button, Collapse } from "reactstrap";

import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

const DisplayBox = (props) => {
  const [s_isOpen, s_setIsOpen] = useState(props.isOpen);

  useEffect(() => {
    s_setIsOpen(props.isOpen);
  }, [props.isOpen]);

  const onToggle = () => {
  
    if(props.onToggle) {
      props.onToggle(!s_isOpen);
    }

    s_setIsOpen(!s_isOpen);
  };

  return (
    <Card className="display-box-sytyle" style={props.style}>
      <CardHeader className="header-display-box"  hidden={!props.title}>
        <Button onClick={onToggle}>
          <span>{props.title}</span>
          <i className={s_isOpen ? "fa fa-caret-down" : "fa fa-caret-right"} />
        </Button>
      </CardHeader>
      <Collapse isOpen={s_isOpen}>
        <div className="body-display-box">{props.children}</div>
      </Collapse>
    </Card>
  );
};

DisplayBox.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
};

DisplayBox.defaultProps = {
  isOpen: true,
  title: "",
};

export default DisplayBox;
