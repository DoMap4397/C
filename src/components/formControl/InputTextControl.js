import { useEffect, useRef } from 'react';
import { Controller } from 'react-hook-form';

import CommonLabel from 'components/CommonLabel';
import CommonValidTooltip from 'components/CommonValidTooltip';

import { Input } from 'antd';
import { Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';

/**
 *
 * @param {string} label
 * @param {control} control ({ control } = useForm())
 * @param {string} name
 * @param {boolean} required
 * @param {number} maxLength
 * @param {number} minLength
 * @param {number} maxByte
 * @param {object} errors ({ formState: { errors } = useForm() })
 * @param {object} rules
 * @param {object} colConfig
 * @param {boolean} focus
 * @param {boolean} ignoreBlank
 * @returns
 */

const InputTextControl = ({
    t,
    label = '',
    control,
    name,
    required = false,
    maxLength = 999999999,
    minLength = 0,
    maxByte = 9999999999,
    minByte = 0,
    errors = {},
    rules = {},
    colConfig = { xs: 12, md: 6, lg: 4 },
    focus = false,
    ignoreBlank = false,
    ...rest
}) => {
    if (!control) throw new Error('control not found');
    if (!name) throw new Error('name not found');

    const ip = useRef();

    useEffect(() => {
        if (focus && ip.current?.focus) ip.current.focus();
    }, []);

    const getErrMsg = (type) => {
        switch(type) {
            case 'required': 
            case 'blank':
                return t('common.msg.emptyMessage');

            case 'maxLength':
            case 'maxByte': 
                return t('common.message.maxLength');

            case 'minLength': 
                return `Nhập tối thiếu ${minLength} ký tự!`;

            case 'minByte': 
                return `Giá trị nhập vào quá ngắn!`;    

            default:
                return '';
        }
    }

    return (
        <Col {...colConfig}>
            <CommonLabel children={label} required={required} />

            <CommonValidTooltip children={getErrMsg(errors?.[name]?.type)} />

            <Controller
                rules={{
                    required,
                    maxLength,
                    minLength,
                    validate: {
                        maxByte: (value) => { 
                            return new Blob([value]).size < maxByte; 
                        },
                        blank: (value) => {
                            if (ignoreBlank) return !!value?.trim();

                            return true;
                        }
                    },
                    ...rules,
                }}
                control={control}
                name={name}
                render={({ field }) => {
                    const nativeFunc = field.ref;

                    return (
                        <Input
                            {...field}
                            {...rest}
                            ref={(elm) => {
                                ip.current = elm;                                

                                nativeFunc(elm);
                            }}
                        />
                    );
                }}
            />
        </Col>
    );
};

export default withTranslation(['common'])(InputTextControl);
