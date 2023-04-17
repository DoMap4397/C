import { useEffect, useRef } from 'react';
import { Controller } from 'react-hook-form';

import CommonLabel from 'components/CommonLabel';
import CommonValidTooltip from 'components/CommonValidTooltip';
import CommonSelect from 'components/CommonSelect';

import { Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';

/**
 *
 * @param {string} label
 * @param {control} control ({ control } = useForm())
 * @param {string} name
 * @param {boolean} required
 * @param {boolean} focus
 * @param {number} maxLength
 * @param {number} minLength
 * @param {object} errors ({ formState: { errors } = useForm() })
 * @param {object} rules
 * @param {object} colConfig
 * @returns
 */

const SelectControl = ({
    t,
    label = '',
    control,
    name,
    required = false,
    focus = false,
    errors = {},
    rules = {},
    colConfig = { xs: 12, md: 6, lg: 4 },
    ...rest
}) => {
    if (!control) throw new Error('control not found');
    if (!name) throw new Error('name not found');

    const ip = useRef();

    useEffect(() => {
        if (focus && ip.current?.focus) ip.current.focus();
    }, []);

    return (
        <Col {...colConfig}>
            <CommonLabel children={label} required={required} />

            <CommonValidTooltip children={errors?.[name]?.message} />

            <Controller
                rules={{
                    required: { value: required, message: t('common.msg.emptyMessage') },
                    ...rules,
                }}
                control={control}
                name={name}
                render={({ field }) => {
                    const nativeFunc = field.ref;

                    return (
                        <CommonSelect
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

export default withTranslation(['common'])(SelectControl);
