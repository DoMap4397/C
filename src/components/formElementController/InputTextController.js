import { useRef, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

import { Input } from 'antd';

const InputTextControler = ({ t, control, name, focus, ...rest }) => {
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
    );
};

export default withTranslation(['common'])(InputTextControler);
