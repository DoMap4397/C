import {withTranslation} from "react-i18next";
import {Row, Col} from "reactstrap";
import React from "react";
import CommonButton from "../../../../components/CommonButton";

const _ = require('lodash');

// const openDetailForm = (options) => {
//     showDialog(<DetailForm options={options}/>);
// };

const home = (props) => {
    const {t} = props;

    return(<Row xs={1} className="home-page">
            <Col xs={6}>
                <CommonButton>
                    {/* onClick={()} */}
                </CommonButton>
            </Col>

            <Col xs={6}>
                <CommonButton>

                </CommonButton>
            </Col>
    </Row>)
}

export default withTranslation(["Home", "common"])(home)