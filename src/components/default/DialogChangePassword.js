import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'antd';
import yup from 'utils/Validation';
import useFocusError from 'hook/useFocusError';
import {
    Col,
    Row,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { AuthenticationService } from "services/authen/AuthenticationService";
import { Services as ServicesConst } from "constants/Constants";
import { UserUtils } from "utils/UserUtils";
import { showConfirm, showInfo, showError } from "components/MessageBox";
import CommonLabel from 'components/CommonLabel';
import CommonValidTooltip from 'components/CommonValidTooltip';
import CommonButton from 'components/CommonButton';


const _ = require('lodash');

const DialogChangePassword = (props) => {

    const { t } = props;
    const userInfo = UserUtils.getUserInfoLocal();

    const schema = yup.object({
        oldPassword: yup.string().trim().notEmpty(),
        newPassword: yup.string().trim().notEmpty(),
        reNewPassword: yup.string().trim().notEmpty().custom((value, parent) => {
            let result = { isValid: true, message: "" };

            if (_.toString(parent["newPassword"]) !== _.toString(value)) {
                result = {
                    isValid: false,
                    message: t('validate.matKhauNhapLaiKhongChinhXac'),
                };
            }

            return result;
        }),
    });

    const { control, watch, handleSubmit, reset, setValue, getValues, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            userName: userInfo.username,
            oldPassword: "",
            newPassword: "",
            reNewPassword: "",
        },
        resolver: yupResolver(schema)
    });

    useFocusError("formChangePassword", errors);

    const onSave = async () => {
        try {
            const data = getValues();

            const res = await AuthenticationService.changePassword({
                userName: userInfo.username,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });

            if (res.code === ServicesConst.RESPONSE_CODE.SUCCESS) {
                showInfo(res.data);
                props.options.onComplete()
            }else {
                showError(res.data || res.message);
            }
        }
        catch (error) {
            console.log(error);
            showError(t("common:errors.exception"));
        }
    };

    const onCancel = () => {
        if (isDirty) {
            showConfirm(t("common:common.msg.confirmClose"), props.options.onCancel);
        }
        else {
            props.options.onCancel();
        }

    };

    return (<>
        <form id="formChangePassword" autoComplete='off' onSubmit={handleSubmit(onSave)}>
            <ModalHeader toggle={onCancel}>{t("changePassword")}</ModalHeader>
            <ModalBody>
                <Row xs={1}>
                    <Col>
                        <CommonLabel required>{t("fields.matKhauCu")}</CommonLabel>
                        <Controller
                            control={control}
                            name="oldPassword"
                            render={({ fieldState, field }) => (
                                <>
                                    <CommonValidTooltip>{fieldState.error?.message}</CommonValidTooltip>
                                    <Input.Password
                                        {...field}
                                    />
                                </>
                            )}
                        />
                    </Col>

                    <Col>
                        <CommonLabel required>{t("fields.matKhauMoi")}</CommonLabel>
                        <Controller
                            control={control}
                            name="newPassword"
                            render={({ fieldState, field }) => (
                                <>
                                    <CommonValidTooltip>{fieldState.error?.message}</CommonValidTooltip>
                                    <Input.Password
                                        {...field}
                                    />
                                </>
                            )}
                        />
                    </Col>

                    <Col>
                        <CommonLabel required>{t("fields.nhapLaiMatKhauMoi")}</CommonLabel>
                        <Controller
                            control={control}
                            name="reNewPassword"
                            render={({ fieldState, field }) => (
                                <>
                                    <CommonValidTooltip>{fieldState.error?.message}</CommonValidTooltip>
                                    <Input.Password
                                        {...field}
                                    />
                                </>
                            )}
                        />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <CommonButton htmlType='submit'>{t("button.luu")}</CommonButton>
                <CommonButton onClick={onCancel}>{t("button.thoat")}</CommonButton>
            </ModalFooter>
        </form>
    </>);
};

export default withTranslation(["changePassword", "common"])(DialogChangePassword);