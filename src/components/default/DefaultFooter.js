import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Language } from "translation/language";
import { Menu, Dropdown } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const _ = require('lodash');

const DefaultFooter = (props) => {

    const { t, i18n } = props;
    const langItems = Language.lang;

    const [s_langItem, s_setLangItem] = useState(Language.defaultLang);

    //#region Event
    const onChangeLang = ({ key }) => {
        const langItem = _.find(langItems, { ns: key });

        i18n.changeLanguage(key);
        s_setLangItem(langItem);
    };
    //#endregion

    //#region Method
    const genLangItem = () => {
        let content = langItems.map((item) => {
            return (
                <Menu.Item key={item.ns}>
                    {item.name}
                </Menu.Item>
            );
        });

        return <Menu
            key={uuidv4()}
            onClick={onChangeLang}
        >
            {content}
        </Menu>;
    };
    //#endregion

    return (
        <>
            <div className="footer-style">
                <div className="info-field">
                    <span>{t("common:app.footerTitle")}</span>
                </div>
                <div className="lang-field">
                    <Dropdown
                        overlay={genLangItem()}
                        trigger={["click"]}>
                        <span className="ant-dropdown-link">
                            <i className="fa-solid fa-language icon-lang" />
                            {s_langItem.name}
                        </span>
                    </Dropdown>
                </div>
            </div>
        </>
    )
}

export default withTranslation(["defaultFooter", "common"])(DefaultFooter);
