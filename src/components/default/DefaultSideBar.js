import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Button, Offcanvas, OffcanvasBody, OffcanvasHeader} from "reactstrap";
import {Menu} from "antd";
import store from "redux/store";
import {getStatusSidebar} from "redux/selectors/defaultSidebarSelectors";
import {toggleSideBar} from "redux/actions/defaultSidebarActions";
import {Config} from "constants/Constants";
import {AuthenticationService} from "../../services/authen/AuthenticationService";
import {flatten} from "../../utils/ArrayUtils";
import {UserUtils} from "../../utils/UserUtils";

const DefaultSideBar = (props) => {
    const dispatch = useDispatch();
    const r_statusSidebar = useSelector(getStatusSidebar);

    const [s_rootSubmenu, s_setRootSubmenu] = useState([]);

    const [s_subSelected, s_setSubSelected] = useState([]);
    const [s_itemSelected, s_setItemSelected] = useState([]);

    const [s_menu, s_setMenu] = useState(null);

    //#region Effect
    useEffect(async () => {
        let menuRes = await AuthenticationService.getMenu();

        let menuDataSplit = splitMenuData(menuRes);
        UserUtils.setUserMenuSubLocal(menuDataSplit.subs);
        UserUtils.setUserMenuItemLocal(menuDataSplit.items);

        localStorage.setItem("menuData", JSON.stringify(menuRes));
        localStorage.setItem("menuFlat", JSON.stringify(flatten(menuRes)));
        let menu = genMenu(menuRes);
        s_setMenu(menu);
    }, []);

    //#region Event
    const onToggleSidebar = () => {
        dispatch(toggleSideBar(false));
    };

    const onSubMenuClick = (keys) => {
        const latestOpenKey = keys.find((key) => s_subSelected.indexOf(key) === -1);
        if (s_rootSubmenu.indexOf(latestOpenKey) === -1) {
            s_setSubSelected(keys);
        } else {
            s_setSubSelected(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const onMenuItemClick = ({key}) => {
        s_setItemSelected([String(key)]);
        onToggleSidebar();
    };
    //#endregion

    //#region Method

    const genMenu = (menuData, isRoot = true) => {
        let menu = [];

        for (const item of menuData) {
            if (Array.isArray(item["items"]) && item["items"].length > 0) {
                if (isRoot && s_rootSubmenu.indexOf(item["id"]) === -1) {
                    s_setRootSubmenu(prevRootSubmenu => [...prevRootSubmenu, item["id"]]);
                }
                menu.push(
                    <Menu.SubMenu
                        key={item["id"]}
                        title={item["label"]}
                    >
                        {genMenu(item["items"], false)}
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
        }
        return menu;
    };

    //#endregion

    return (
        <>
            <Offcanvas
                className="sidebar-style"
                style={{
                    backgroundImage: `url('${Config.PUBLIC_URL}/images/background.jpg')`,
                }}
                isOpen={r_statusSidebar}
                fade={true}
                scrollable={true}
                backdrop={true}
                direction="start"
                toggle={onToggleSidebar}
            >
                <OffcanvasHeader className="sidebar-header-style">
                    <div className="img-field">
                        <img alt="" src={`${Config.PUBLIC_URL}/images/logo.png`}/>
                    </div>
                    <Button
                        close
                        className="button-toggle-sidebar"
                        onClick={onToggleSidebar}
                    />
                </OffcanvasHeader>
                <OffcanvasBody className="sidebar-body-style">
                    <Menu
                        mode="inline"
                        // mode="inline" subMenuCloseDelay={0.5}
                        style={{width: "100%"}}
                        onOpenChange={onSubMenuClick}
                        openKeys={s_subSelected}
                        onClick={onMenuItemClick}
                        selectedKeys={s_itemSelected}
                    >
                        {s_menu}
                    </Menu>
                </OffcanvasBody>
            </Offcanvas>
        </>
    );
};

export default DefaultSideBar;

export const openSidebar = function () {
    store.dispatch(toggleSideBar(true));
};

export const splitMenuData = (menuData, parent = "") => {
    let subs = [];
    let items = [];
    menuData.sort((a, b) => {
        if (a.ord == null) a.ord = 110;
        if (b.ord == null) b.ord = 110;
        return a.ord - b.ord
    });

    menuData.map((menu) => {
        if ( Array.isArray(menu["items"])&& menu["items"].length>0) {
            let sub = {...menu};
            sub["parentMenu-Client"] = parent;
            sub["typeMenu-Client"] = "sub";
            delete sub.items;

            subs.push(sub);

            let resultSplit = splitMenuData(menu["items"], menu["id"]);
            subs = subs.concat(resultSplit.subs);
            items = items.concat(resultSplit.items);
        } else {
            let item = {...menu};
            item["parentMenu-Client"] = parent;
            item["typeMenu-Client"] = "item";

            items.push(item);
        }
    });

    return {
        subs: subs,
        items: items
    };
};