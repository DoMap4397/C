import React, { forwardRef, useRef } from "react";
import PropTypes from 'prop-types';
import { Constants as AppConstants } from 'constants/Constants';
import { v4 as uuidv4 } from 'uuid';

import CustomTimePicker from 'components/datePicker/CustomTimePicker';
import CustomDatePicker from 'components/datePicker/CustomDatePicker';
import CustomDatetimePicker from 'components/datePicker/CustomDatetimePicker';
import CustomWeekPicker from 'components/datePicker/CustomWeekPicker';
import CustomMonthPicker from 'components/datePicker/CustomMonthPicker';
import CustomQuarterPicker from 'components/datePicker/CustomQuarterPicker';
import CustomYearPicker from 'components/datePicker/CustomYearPicker';

const format = {
    time: {
        inputFormat: AppConstants.DATE_TIME_FORMAT.TIME,
        outputFormat: AppConstants.DATE_TIME_FORMAT.TIME,
        viewFormat: [AppConstants.DATE_TIME_FORMAT.TIME],
    },

    date: {
        inputFormat: AppConstants.DATE_TIME_FORMAT.DATE,
        outputFormat: AppConstants.DATE_TIME_FORMAT.DATE,
        viewFormat: [AppConstants.DATE_TIME_FORMAT.DATE].concat(AppConstants.INPUT_PICKER.DATE),
    },

    datetime: {
        inputFormat: AppConstants.DATE_TIME_FORMAT.DATE_TIME,
        outputFormat: AppConstants.DATE_TIME_FORMAT.DATE_TIME,
        viewFormat: [AppConstants.DATE_TIME_FORMAT.DATE_TIME],
    },

    week: {
        inputFormat: AppConstants.DATE_TIME_FORMAT.WEEK + "-" + AppConstants.DATE_TIME_FORMAT.YEAR,
        outputFormat: {
            weekYearFormat: AppConstants.DATE_TIME_FORMAT.WEEK + "-" + AppConstants.DATE_TIME_FORMAT.YEAR,
            weekFormat: AppConstants.DATE_TIME_FORMAT.WEEK,
            yearFormat: AppConstants.DATE_TIME_FORMAT.YEAR,
            startDateFormat: AppConstants.DATE_TIME_FORMAT.DATE,
            endDateFormat: AppConstants.DATE_TIME_FORMAT.DATE,
        },
        viewFormat: [AppConstants.DATE_TIME_FORMAT.WEEK + "-" + AppConstants.DATE_TIME_FORMAT.YEAR]
    },

    month: {
        inputFormat: AppConstants.DATE_TIME_FORMAT.MONTH + "/" + AppConstants.DATE_TIME_FORMAT.YEAR,
        outputFormat: {
            monthYearFormat: AppConstants.DATE_TIME_FORMAT.MONTH + "/" + AppConstants.DATE_TIME_FORMAT.YEAR,
            monthFormat: AppConstants.DATE_TIME_FORMAT.MONTH,
            yearFormat: AppConstants.DATE_TIME_FORMAT.YEAR,
            startDateFormat: AppConstants.DATE_TIME_FORMAT.DATE,
            endDateFormat: AppConstants.DATE_TIME_FORMAT.DATE,
        },
        viewFormat: [AppConstants.DATE_TIME_FORMAT.MONTH + "/" + AppConstants.DATE_TIME_FORMAT.YEAR]
    },

    quarter: {
        inputFormat: AppConstants.DATE_TIME_FORMAT.QUARTER + "-" + AppConstants.DATE_TIME_FORMAT.YEAR,
        outputFormat: {
            quarterYearFormat: AppConstants.DATE_TIME_FORMAT.QUARTER + "-" + AppConstants.DATE_TIME_FORMAT.YEAR,
            quarterFormat: AppConstants.DATE_TIME_FORMAT.QUARTER,
            yearFormat: AppConstants.DATE_TIME_FORMAT.YEAR,
            startDateFormat: AppConstants.DATE_TIME_FORMAT.DATE,
            endDateFormat: AppConstants.DATE_TIME_FORMAT.DATE,
        },
        viewFormat: [AppConstants.DATE_TIME_FORMAT.QUARTER + "-" + AppConstants.DATE_TIME_FORMAT.YEAR]
    },

    year: {
        inputFormat: AppConstants.DATE_TIME_FORMAT.YEAR,
        outputFormat: {
            yearFormat: AppConstants.DATE_TIME_FORMAT.YEAR,
            startDateFormat: AppConstants.DATE_TIME_FORMAT.DATE,
            endDateFormat: AppConstants.DATE_TIME_FORMAT.DATE,
        },
        viewFormat: [AppConstants.DATE_TIME_FORMAT.YEAR]
    }
};

// add forwardRef (LuatVQ2 30/04/2022)

const CommonDatePicker = forwardRef(({typePicker: p_typePicker, ...props}, ref) => {

    let ref_id = useRef(props.id || uuidv4());

    const selectComponent = () => {
        let element = null;

        let options = { ...props };

        options.id  = ref_id.current;
        options.style = { width: '100%', marginTop: '0px' };
        options.onChange = onChangeValue;

        if (options.defaultValue) {
            options.value = options.defaultValue;
        }

        switch (p_typePicker) {
            case "time":

                element = <CustomTimePicker ref={ref} {...options} format={options.format || format.time} />
                break;

            case "date":
                element = <CustomDatePicker ref={ref} {...options} format={options.format || format.date} />
                break;

            case "datetime":
                element = <CustomDatetimePicker ref={ref} {...options} format={options.format || format.datetime} />
                break;

            case "week":
                element = <CustomWeekPicker ref={ref} {...options} format={options.format || format.week} />
                break;

            case "month":
                element = <CustomMonthPicker ref={ref} {...options} format={options.format || format.month} />
                break;

            case "quarter":
                element = <CustomQuarterPicker ref={ref} {...options} format={options.format || format.quarter} />
                break;

            case "year":
                element = <CustomYearPicker ref={ref} {...options} format={options.format || format.year} />
                break;

            default:
                element = <CustomDatePicker ref={ref} {...options} format={options.format || format.date} />
                break;
        }

        return element;

    };


    const onChangeValue = (value) => {
        //console.log(value);

        if (props.onChange) {
            props.onChange(value);
        }
    };

    return (
        <div 
        className="common-date-picker" 
        id={"parent-" + ref_id.current}
        style={props.style}>
            {selectComponent()}
        </div>
    );
})

// const CommonDatePicker = ({typePicker: p_typePicker, ...props}) => {

//     let ref_id = useRef(props.id || uuidv4());

//     const selectComponent = () => {
//         let element = null;

//         let options = { ...props };

//         options.id  = ref_id.current;
//         options.style = { width: '100%', marginTop: '0px' };
//         options.onChange = onChangeValue;

//         if (options.defaultValue) {
//             options.value = options.defaultValue;
//         }

//         switch (p_typePicker) {
//             case "time":

//                 element = <CustomTimePicker {...options} format={options.format || format.time} />
//                 break;

//             case "date":
//                 element = <CustomDatePicker {...options} format={options.format || format.date} />
//                 break;

//             case "datetime":
//                 element = <CustomDatetimePicker {...options} format={options.format || format.datetime} />
//                 break;

//             case "week":
//                 element = <CustomWeekPicker {...options} format={options.format || format.week} />
//                 break;

//             case "month":
//                 element = <CustomMonthPicker {...options} format={options.format || format.month} />
//                 break;

//             case "quarter":
//                 element = <CustomQuarterPicker {...options} format={options.format || format.quarter} />
//                 break;

//             case "year":
//                 element = <CustomYearPicker {...options} format={options.format || format.year} />
//                 break;

//             default:
//                 element = <CustomDatePicker {...options} format={options.format || format.date} />
//                 break;
//         }

//         return element;

//     };


//     const onChangeValue = (value) => {
//         //console.log(value);

//         if (props.onChange) {
//             props.onChange(value);
//         }
//     };

//     return (
//         <div 
//         className="common-date-picker" 
//         id={"parent-" + ref_id.current}
//         style={props.style}>
//             {selectComponent()}
//         </div>
//     );
// }

export default CommonDatePicker;

CommonDatePicker.propTypes = {
    typePicker: PropTypes.string,
};

CommonDatePicker.defaultProps = {
    //id: uuidv4(),
};