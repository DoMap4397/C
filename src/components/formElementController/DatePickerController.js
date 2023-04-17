import { useRef, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

import CommonDatePicker from 'components/CommonDatePicker';

const DatePickerControler = ({
    t,
    control,
    name,
    focus,
    typePicker = 'date',
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
                    <CommonDatePicker
                        typePicker={typePicker}
                        {...field}
                        {...rest}
                        onChange={(e) => {
                            // console.log(e, 'Onchange Picker')

                            return field.onChange(e);
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

export default withTranslation(['common'])(DatePickerControler);
