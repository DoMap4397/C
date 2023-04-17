import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {UserUtils} from "utils/UserUtils";
import {v4 as uuidv4} from "uuid";
import {Spinner} from "reactstrap";
import {Breadcrumb, Dropdown, Menu} from "antd";
import {closeTooltip, openTooltip} from "components/CommonTooltip";
import {AuthenticationService} from "services/authen/AuthenticationService";
import {Config} from "constants/Constants";
import {StringUtils} from "../../utils/StringUtils";

const DefaultBreadcrumb = (props) => {
    const {t} = props;
    let history = useHistory();

    const [s_breadcrumb, s_setBreadcrumb] = useState(null);

    useEffect(() => {
        let url = new URL(window.location.href);
        let pathName = url.pathname.replace(/\/$/, "");
        //Truy cập màn home
        if (pathName === Config.PUBLIC_URL) {
            s_setBreadcrumb(null);
            return;
        }

        pathName = pathName.replaceAll(Config.PUBLIC_URL, "").replace(/\/$/, "");
        pathName += '?urlPathId=' + url.searchParams.get("urlPathId");
        let menuItem = UserUtils.findUserMenuItemLocal({["to"]: pathName});
        // console.log(menuItem);
        //Check quyền truy cập
        if (menuItem === null) {
            alert(t("common:errors.cantAccessThisPage"));
            AuthenticationService.logout();
        } else {
            document.title = menuItem["label"];
            let breadcrumb = genBreadcrumb(menuItem);
            // console.log('breadcrumb',breadcrumb)
            s_setBreadcrumb(breadcrumb);
        }
    }, [props]);

    //#region Method
    const genBreadcrumb = (menuItem) => {
        let lstBreadcrumb = [];

        let item = menuItem;
        // console.log('genBreadcrumb', item, JSON.stringify(item))
        while (true) {
            let content = null;
            if (item["typeMenu-Client"] === "sub") {
                content = <BreadcrumbSub key={uuidv4()} menu={item}/>;
            } else {
                content = <BreadcrumbChild key={uuidv4()} menu={item}/>;
            }

            lstBreadcrumb.unshift(
                <Breadcrumb.Item key={uuidv4()}>{content}</Breadcrumb.Item>
            );

            if (item["parentMenu-Client"] !== "") {
                item = UserUtils.findUserMenuSubLocal({
                    ["id"]: item["parentId"],
                });
            } else {
                break;
            }
            // console.log('loop', item)
        }

        return lstBreadcrumb;
    };

    //#endregion

    return (
        <div className="breadcrumb-style">
            <Breadcrumb className="test">
                <Breadcrumb.Item>
          <span className="breadcrumbItem" onClick={() => history.push("/")}>
            <i className="fa-solid fa-house"/>
          </span>
                </Breadcrumb.Item>
                {s_breadcrumb}
            </Breadcrumb>
        </div>
    );
};

const BreadcrumbSub = (props) => {
    //#region init
    const initContent = (
        <div className="init-content-dropdown-breadcrum-item" key={uuidv4()}>
            <Spinner key={uuidv4()}/>
        </div>
    );
    //#endregion

    const [s_content, s_setContent] = useState(null);

    //#region Event
    const onHoverBreadcrumb = () => {
        if (s_content !== null) {
            return;
        }

        let menuData = UserUtils.getUserMenuDataLocal();
        let meunSub = findSubMenu(props.menu, menuData);

        if (meunSub) {
            s_setContent(null);

            let menu = genMenuBreadcrumb(meunSub["items"]);
            s_setContent(<Menu className="breadcrumb-style-scroll" key={uuidv4()}>{menu}</Menu>);
        }
    };

    //#endregion

    //#region Method
    const findSubMenu = (currentSub, menuData) => {
        let sub = {};

        for (let i = 0; i < menuData.length; i++) {
            const menu = menuData[i];

            if (currentSub["id"] === menu["id"]) {
                sub = menu;
                break;
            } else if (menu["items"]) {
                let child = findSubMenu(currentSub, menu["items"]);
                if (currentSub["id"] === child["id"]) {
                    sub = child;
                    break;
                }
            }
        }

        return sub;
    };

    const genMenuBreadcrumb = (menuData) => {
        let menu = [];
        console.log('genMenuBreadcrumb',menuData)

        menuData?.map((item) => {
            if (item["items"].length > 0) {
                menu.push(
                    <Menu.SubMenu
                        key={item["id"]}
                        title={item["label"]}
                    >
                        {genMenuBreadcrumb(item["items"], false)}
                    </Menu.SubMenu>
                );
            } else {
                menu.push(
                    <Menu.Item
                        key={item["id"]}
                    >
                        <Link to={item["to"] || "/"}>{item["label"]}</Link>
                    </Menu.Item>
                );
            }
        });

        return menu;
    };
    //#endregion

    return (
        <Dropdown
            overlay={s_content || initContent}
            trigger={["click"]}
            key={uuidv4()}
        >
      <span
          className="ant-dropdown-link breadcrumbItem over-flow-text"
          onMouseMove={onHoverBreadcrumb}
          onMouseOver={openTooltip(props.menu["label"], 10, -40)}
          onMouseLeave={closeTooltip}
          key={uuidv4()}
      >
        {props.menu["label"]}
      </span>
        </Dropdown>
    );
};

const BreadcrumbChild = (props) => {
    return <span className="breadcrumbItem">{props.menu["label"]}</span>;
};

export default withTranslation(["common"])(DefaultBreadcrumb);
