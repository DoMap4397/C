import React, { useEffect, useState } from 'react';
import { Action as ActionConst } from 'constants/Constants';
import i18n from 'translation/i18n';
import ButtonText from 'components/button/ButtonText';
import ButtonIconText from 'components/button/ButtonIconText';
import ButtonIcon from 'components/button/ButtonIcon';
import ActionTable from 'components/button/ActionTable';
import { UserUtils } from 'utils/UserUtils';


const CommonButton = ({ action: p_action, type: p_type, ...rest }) => {

	//#region Method
	const selectButton = () => {
		if (checkPerMission(p_action) === false) {
			return <></>;
		}

		let options = { ...rest };

		options.onClick = commonOnClick;

		let button = null;

		switch (p_type) {
			case 'iconText':
				button = <ButtonIconText {...options} />;
				break;

			case 'icon':
				button = <ButtonIcon {...options} />;
				break;

			case 'actionTable':
				switch (p_action) {
					case ActionConst.VIEW:
						options.title =
							options.title ||
							i18n.t('common:common.tooltip.button-view');
						break;

					case ActionConst.UPDATE:
						options.title =
							options.title ||
							i18n.t('common:common.tooltip.button-update');
						break;

					case ActionConst.INSERT:
						options.title =
							options.title ||
							i18n.t('common:common.tooltip.button-copy');
						break;

					case ActionConst.DELETE:
						options.title =
							options.title ||
							i18n.t('common:common.tooltip.button-delete');
						break;

					default:
						break;
				}

				button = <ActionTable {...options} />;
				break;

			default: //text
				button = <ButtonText {...options} />;
				break;
		}

		return button;
	};
	//#endregion

	//#region Event
	const commonOnClick = (e) => {
		writeLog(p_action);

		if (rest.onClick) {
			rest.onClick(e);
		}
	};
	//#endregion

	//#region Method
	const checkPerMission = (action) => {
		if (!action) {
			return true;
		}

		const menuItem = UserUtils.getCurrentMenuItemLocal();

		if (!menuItem) {
			return true;
		}

		const keyMenu = menuItem.strCode;

		const userPerAction = UserUtils.getUserPerActionLocal();

		const perCurrentForm = userPerAction[keyMenu];

		if (!perCurrentForm.toUpperCase().includes(action.toUpperCase())) {
			return false;
		}

		return true;
	};

	const writeLog = (code) => { };
	//#endregion

	return selectButton();
};

export default CommonButton;
