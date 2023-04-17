import React, { forwardRef, useMemo, useState, useEffect } from "react";
import { Select, Checkbox, Spin } from "antd";
import { ObjectUtils } from "utils/ObjectUtils";
import debounce from 'lodash/debounce';
import { StringUtils } from "../utils/StringUtils";
import PropTypes from "prop-types";
import CommonAction from "./CommonAction";

const _ = require('lodash');

const CommmonSelect = forwardRef(({ dataRender, funcRender, lazyLoad, checkAll, ...props }, ref) => {
    const [s_isCheckAll, s_setIsCheckAll] = useState(false);

    useEffect(() => {
        if (props.mode === "multiple") {
            if (!_.isEmpty(props.value)) {
                props.value.length === dataRender.length ? s_setIsCheckAll(true) : s_setIsCheckAll(false);
            }
            else {
                s_setIsCheckAll(false);
            }
        }
    }, [props.value]);

    const onChangeValue = (value, option) => {
        if (props.onChange) {
            props.onChange(value ?? "", option);
        }

        if (props.mode === "multiple") {
            value.length === dataRender.length ? s_setIsCheckAll(true) : s_setIsCheckAll(false);;
        }
    };

    const onSelectOption = (value, element) => {
        if (props.onSelect) {
            props.onSelect(value ?? "", element?.item);
        }
    };

    const onCheckAll = (e) => {
        let fieldValue = _.toString(checkAll);

        if (!props.onChange || fieldValue === "" || _.isEmpty(dataRender)) {
            return;
        }

        if (e.target.checked) {
            props.onChange(_.map(dataRender, obj => String(obj[fieldValue])), dataRender);

            s_setIsCheckAll(true);
        }
        else {
            props.onChange([], []);

            s_setIsCheckAll(false);
        }

    };

    const selectComponent = () => {
        let options = { ...props };
        options.className = "common-select " + props.className;
        options.onChange = onChangeValue;
        options.onSelect = onSelectOption;

        if (options.mode === "multiple" && !options.dropdownRender && checkAll) {
            options.dropdownRender = (menu) => <>
                {menu}
                <div className="common-select-check-all">
                    <Checkbox checked={s_isCheckAll} onChange={onCheckAll}>Chọn tất cả</Checkbox>
                </div>
            </>;
        }

        if (!lazyLoad) {
            return <NormalSelect ref={ref} {...options} value={props.value && props.mode === 'single' ? _.toString(props.value) : props.value}>
                {funcRender(dataRender)}
            </NormalSelect>
        } else {
            options.filterOption = false;
            options.funcRender = funcRender;
            options.dataRender = dataRender;

            return <LazySelect ref={ref} {...options} />
        }
    };

    return <>
        {selectComponent()}
        {/* <input hidden /> */}
    </>;
})


// const CommmonSelect = ({dataRender, funcRender, lazyLoad, ...props}) => {

//     const onChangeValue = (value) => {
//         if (props.onChange) {
//             props.onChange(value);
//         }
//     }

//     const onSelectOption = (value, element) => {
//         if (props.onSelect) {
//             props.onSelect(value, element?.item);
//         }
//     }

//     const selectComponent = () => {
//         let options = {...props};
//         options.className = "common-select " + props.className;
//         options.onChange = onChangeValue;
//         options.onSelect = onSelectOption;

//         if (!lazyLoad) {
//             return <NormalSelect {...options} value={props.value && props.mode === 'single' ? _.toString(props.value) : props.value}>
//                 {funcRender(dataRender)}
//             </NormalSelect>
//         } else {
//             options.filterOption = false;
//             options.funcRender = funcRender;
//             options.dataRender = dataRender;

//             return <LazySelect {...options} />
//         }
//     };

//     return <>
//         {selectComponent()}
//         {/* <input hidden /> */}
//     </>;
// };

//export default React.memo(CommmonSelect, ObjectUtils.compareProps);
export default React.memo(CommmonSelect);

const NormalSelect = forwardRef((props, ref) => {
    return <Select ref={ref} {...props} />;
})

// const NormalSelect = (props) => {
//     return <Select {...props} />;
// };

const LazySelect = forwardRef(({ dataRender, defaultDataRender, funcRender, ...props }, ref) => {
    const [s_fetching, s_setFetching] = useState(false);
    const [s_data, s_setData] = useState(defaultDataRender);

    const onSearch = useMemo(() => {
        const loadOptions = async (value) => {
            s_setFetching(true);
            s_setData([]);

            let newData = await dataRender(value);

            s_setFetching(false);
            s_setData(newData);
        };

        return debounce(loadOptions, 1000);
    }, []);

    return <Select
        ref={ref}
        onSearch={onSearch}
        notFoundContent={s_fetching ? <Spin size="small" /> : null}
        {...props}>
        {funcRender(s_data, props.setFieldInfo)}
    </Select>
})

// const LazySelect = ({dataRender, funcRender, ...props}) => {
//     const [r_fetching, r_setFetching] = useState(false);
//     const [r_data, r_setData] = useState([]);

//     const onSearch = useMemo(() => {
//         const loadOptions = async (value) => {
//             r_setFetching(true);
//             r_setData([]);

//             let newData = await dataRender(value);

//             r_setFetching(false);
//             r_setData(newData);
//         };

//         return debounce(loadOptions, 1000);
//     }, []);

//     return <Select
//         onSearch={onSearch}
//         notFoundContent={r_fetching ? <Spin size="small"/> : null}
//         {...props}>
//         {funcRender(r_data)}
//     </Select>
// };

const filterSelectOption = (input, event) => {
    return String(event.value) === "header"
        // || String(event.key).toLowerCase().includes(input.toLowerCase())
        || _.includes(_.toString(event.label).toLowerCase(), input.toLowerCase())
        || _.includes(_.toString(event.value).toLowerCase(), input.toLowerCase())
};

CommmonSelect.defaultProps = {
    showArrow: true,
    showSearch: true,
    allowClear: true,
    maxTagCount: 'responsive',
    filterOption: filterSelectOption,
    defaultDataRender: [],
    dataRender: [],
    funcRender: () => {
    },
    mode: 'single',
    checkAll: "",
};

CommonAction.propTypes = {
    showSearch: PropTypes.bool,
    allowClear: PropTypes.bool,
    dataRender: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func
    ]),
    filterOption: PropTypes.func,
    funcRender: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.any,
    mode: PropTypes.oneOf(['single', 'multiple']),
    checkAll: PropTypes.string,
    disabled: PropTypes.bool
};
