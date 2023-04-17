import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import {
  Navbar,
  NavItem,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Button,
  Progress,
} from "reactstrap";
import { Menu } from "antd";
import { openSidebar } from "components/default/DefaultSideBar"
import { showError } from "components/MessageBox"
import { AuthenticationService } from "services/authen/AuthenticationService";
import { CommonService } from 'services/common/CommonService';
import { UserUtils } from "utils/UserUtils";
import { Config } from "constants/Constants";
import DialogChangePassword from "components/default/DialogChangePassword";
import { DialogItem } from "components/Dialog";
import CommonButton from 'components/CommonButton';
//import { Language } from "translation/language"

const _ = require('lodash');
const DefaultHeader = (props) => {

  const [s_openCollapse, s_setOpenCollapse] = useState(false);

  const [s_dialogChangePassWord, s_setDialogChangePassWord] = useState(false);

  const { t } = props;
  const userInfo = UserUtils.getUserInfoLocal();
  let history = useHistory();

  //#region useEffect

  //#endregion

  //#region Event
  const onClickItem = function (e, menuItem) {
    let which = e.nativeEvent.which;
    if (which !== 1) {
      return;
    }

    menuItem.command();

  };

  const onClickImage = () => {
    history.push("/");
  };

  const onClickHelpIcon = () => {
    try {
      CommonService.getUserManual("MBF_B11_2022_PM_UM_FB va GQKN.pdf");
    }
    catch (error) {
      console.log(error);
      showError(t("common:errors.exception"));
    }
  };
  //#endregion

  //#region Method

  const genActionOptions = () => {
    let options = [
      {
        name: "depId",
        type: "view",
        icon: <i key="icoChangePassword" className="fas fa-eye" />,
        title: userInfo.deptId + " - " + userInfo.deptName,
        command: () => { },
      },
      {
        name: "changePassword",
        type: "action",
        title: t("defaultHeader:optionsDropdown.changePassword"),
        icon: <i key="icoChangePassword" className="fas fa-key" />,
        command: changePassword,
      },
      {
        name: "logout",
        type: "action",
        title: t("defaultHeader:optionsDropdown.logout"),
        icon: <i key="icoLogout" className="fas fa-power-off" />,
        command: logout,
      },
    ];

    let menuElement = options.map((item) => {
      return (
        <Menu.Item
          onPointerDown={(e) => onClickItem(e, item)}
          key={uuidv4()}
          icon={item.icon}
        >
          {item.title}
        </Menu.Item>
      );
    });
    return menuElement;
  };

  const logout = () => {
    try {
      AuthenticationService.logoutSSO();
    }
    catch (error) {
      console.log(error);
      showError(t('common:errors.exception'));
    }
  };

  const changePassword = () => {
    let content = <DialogItem>
      <DialogChangePassword options={{
        onComplete: () => {
          s_setDialogChangePassWord(null);
        },
        onCancel: () => {
          s_setDialogChangePassWord(null);
        }
      }} />
    </DialogItem>

    s_setDialogChangePassWord(content);
  };

  //#endregion

  return (
    <div className="navbar-style">
      {s_dialogChangePassWord}
      <Navbar id="defaultNavbar" expand="md">
        <NavbarBrand>
          <Button outline onClick={() => openSidebar()}>
            <i className="fas fa-bars" />
          </Button>
        </NavbarBrand>
        <NavbarBrand>
          <div className="title">
            <img onClick={onClickImage} alt="" src={`${Config.PUBLIC_URL}/images/logo.png`} />
            {/* <div>Base</div> */}
          </div>
        </NavbarBrand>
        <NavbarToggler onClick={() => s_setOpenCollapse(!s_openCollapse)}>
          <i className="fas fa-ellipsis-v" />
        </NavbarToggler>
        <Collapse navbar isOpen={s_openCollapse}>
          <Nav className="me-auto" navbar></Nav>
          <NavItem style={{ paddingRight : "10px" }}>
            <i className="button-i fa-solid fa-circle-question" onClick={onClickHelpIcon} />
          </NavItem>
          <UncontrolledDropdown>
            <DropdownToggle caret nav >
              <i className="fas fa-user" />
              <span>{userInfo?.username}</span>
            </DropdownToggle>
            <DropdownMenu>
              <div>
                <Menu mode="vertical">
                  {genActionOptions()}
                </Menu>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Collapse>
      </Navbar>
      <Progress multi className='line-color'>
        <Progress
          bar
          style={{ backgroundColor: "#f2b03f" }}
          value="30"
        />
        <Progress
          bar
          style={{ backgroundColor: "#277cbe" }}
          value="30"
        />
        <Progress
          bar
          style={{ backgroundColor: "#e13b3b" }}
          value="40"
        />
      </Progress>
    </div>
  );
};

export default withTranslation(["defaultHeader", "common"])(DefaultHeader);
