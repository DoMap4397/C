import { useRef, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

import CommonSelect from 'components/CommonSelect';

const SelectController = ({
    t,
    control,
    name,
    focus,
    onChange,
    ...rest
}) => {
    const ip = useRef();

    useEffect(() => {
        if (focus && ip.current?.focus) ip.current.focus();
    }, []);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const nativeFunc = field.ref;

                return (
                    <CommonSelect
                        {...field}
                        {...rest}
                        onChange={(e) => {
                            if (onChange) onChange(e);

                            field.onChange(e);
                        }}
                        ref={(elm) => {
                            ip.current = elm;

                            nativeFunc(elm);
                        }}
                    />
                );
            }}
        />
    );
};

export default withTranslation(['common'])(SelectController);
