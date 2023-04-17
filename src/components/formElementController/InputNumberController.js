import { useRef, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

import CommonInputNumber from 'components/CommonInputNumber';

const InputNumberControler = ({ t, control, name, focus, ...rest }) => {
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
                    <CommonInputNumber
                        {...field}
                        {...rest}
                        onChange={(e) => {
                            return field.onChange(e?.floatValue);
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

export default withTranslation(['common'])(InputNumberControler);
