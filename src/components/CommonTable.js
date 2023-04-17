import React, {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import {v4 as uuidv4} from 'uuid';
import {Col, Row} from "reactstrap";
import {Button, Checkbox, Input} from "antd";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import i18n, {Trans} from "translation/i18n";
import {Action as ActionConst, Constants as AppConstants} from "constants/Constants";
import CommonButton from 'components/CommonButton';
import CommonInputNumber from 'components/CommonInputNumber';
import CommonSelect from 'components/CommonSelect';
import CommonDatePicker from 'components/CommonDatePicker';
import CommonTooltip from 'components/CommonTooltip';
import {renderSingleColumnOptions} from "components/selectAntd/CustomOptions";
import CustomTableNoPaging from "components/table/CustomTableNoPaging";
import CustomTablePagingApi from "components/table/CustomTablePagingApi";
import CustomTablePagingClient from "components/table/CustomTablePagingClient";
import {DateUtils} from 'utils/DateUtils';
import {StringUtils} from 'utils/StringUtils';
import {StatusConst} from "../constants/Status";
import moment from "moment";
import {ObjectUtils} from "../utils/ObjectUtils";

const _ = require('lodash');

const CommonTable = ({
                         pagingType: p_pagingType,
                         pagingConfig: p_pagingConfig,
                         pagingConfigDefault: p_pagingConfigDefault,
                         resetWhenDataChange: p_resetWhenDataChange,
                         size: p_size,
                         watch: p_watch,
                         containerStyle,
                         ...props
                     }) => {
    const sampleDataColumn = [
        {
            dataField: "", //tên trường
            header: "",
            headerStyle: {},

            cellRender: { //không cần custom cell thì có thể bỏ
                style: {}, //style cho cell, không cần thì có thể bỏ
                function: (cell, row, rowIndex) => {
                }, //hàm render (không cần custom thì có thể bỏ)
            },

            filter: {
                type: "text", //loại element filter text/number/select/date
                advanced: {}, //cấu hình đặc biệt cho element filter (không cần có thể bỏ)
                function: (data, condition) => {
                }, //trong trường hợp muốn custom hàm filter (không cần có thể bỏ)
            },
            sort: { //(không cần có thể bỏ)
                type: "text", // text/number/date (type = text hoặc number có thể bỏ qua)
                formatDate: "DD/MM/YYYY", //formart date của trường cần date cần sort, chỉ áp dụng cho sort.type: date
                function: (row) => {
                }, //trong trường hợp muốn custom hàm sort (không cần có thể bỏ)
            },
            visible: true,
            editor: null,
        }
    ];

    const optionsMatchMode = [
        {
            value: "contains",
            name: "%%",
        },
        {
            value: "equals",
            name: "==",
        },
        {
            value: "notContains",
            name: "!=",
        },
        {
            value: "startWith",
            name: "%.",
        },
        {
            value: "endWith",
            name: ".%",
        },
    ];

    const [s_pagingInfo, s_setPagingInfo] = useState({
        ...{
            current: 1,
            pageSize: AppConstants.DATATABLE.PAGE_SIZE_DEFAULT,
        }, ...p_pagingConfigDefault
    });

    let ref_idTable = useRef(props.id || uuidv4());
    let ref_filterConidtion = useRef({});
    let ref_mathMode = useRef({});
    let ref_sortCondition = useRef({});
    let ref_dataSelected = useRef([]);

    let ref_elementFocus = useRef("");

    //#region useEffect
    // useEffect(() => { //trigger when p_pagingConfig change
    //     if (p_pagingConfig) {
    //         s_setPagingInfo(p_pagingConfig);
    //     }
    // }, [p_pagingConfig]);

    useEffect(() => { //trigger when props.data or props.columns change
        return () => { //before change
            if (p_resetWhenDataChange) {
                resetTable();
                //s_setPagingInfo({ current: 1, pageSize: AppConstants.DATATABLE.PAGE_SIZE_DEFAULT });
                s_setPagingInfo(prev => ({
                    ...prev,
                    current: 1
                }));
            }
        };
    }, [JSON.stringify(props.data)]);
    //}, [JSON.stringify(props.data), JSON.stringify(props.columns)]);
    //#endregion

    //#region Gen component
    const genColumnObject = (data) => {
        let columnsData = [...data];

        if (columnsData.length === 0) {
            columnsData = [
                {
                    dataField: '',
                    header: ''
                }
            ];
        }

        const columns = columnsData.map((item) => {
            const {header, sort, filter, cellRender,headerAction, ...col} = item;

            if (col.dataField === "#") {
                cellRender.function = genRowIndex;
            }

            if (typeof header === "string") {
                col.text = header;
            } else {
                col.text = col.dataField;
            }

            col.headerFormatter = () => <>
                <Row key={uuidv4()} className="header-column" xs={1}>
                    {genSort(col, sort)}
                    <Col key={uuidv4()} className="header-field">
                        {genHeaderName(header)}
                    </Col>
                    <Col key={uuidv4()} style={{padding: "0px"}}>
                        {genFilter(col, filter)}
                    </Col>
                    <Col key={uuidv4()} style={{padding: "0px"}}>
                        {genHeaderAction(col, headerAction)}
                    </Col>
                </Row>
            </>;

            col.formatExtraData = (cell, row, rowIndex) => <CommonTooltip className="cell">
                {genCellContent(cell, row, rowIndex, cellRender)}
            </CommonTooltip>;

            col.formatter = (cell, row, rowIndex, formatExtra) => formatExtra(cell, row, rowIndex);

            if (col.visible === undefined) col.visible = true;

            return col;
        });

        return columns;
    };

    const genSort = (column, sort) => {

        let icon = "fa-solid fa-sort";

        switch (ref_sortCondition.current[column.dataField]) {
            case "desc":
                icon = "fa-solid fa-arrow-down-wide-short";
                break;

            case "asc":
                icon = "fa-solid fa-arrow-down-short-wide";
                break;

            default:
                break;
        }

        if (sort) {
            return <Button
                key={uuidv4()}
                className="btn-sort"
                name="btnSortTable"
                data-info={JSON.stringify({
                    fieldName: column.dataField,
                })}
            >
                <i disabled className={icon}/>
            </Button>;
        }

        return null;
    };

    const genHeaderName = (header) => {
        return <div className="header-text">{header}</div>
    };

    const genHeaderGroup = (idTable, newHeaderGroup, columns) => {
        let oldHeaderGroup = document.evaluate(`//*[@id="${idTable}"]/thead/tr[@class="headerGroup"]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        if (oldHeaderGroup) {
            for (let i = 0; i < oldHeaderGroup.snapshotLength; i++) {
                oldHeaderGroup.snapshotItem(i).remove();
            }
        }

        if (newHeaderGroup) {
            let header = document.evaluate(`//*[@id="${idTable}"]/thead/tr`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            header.insertAdjacentHTML('beforebegin', newHeaderGroup);

            let table = document.evaluate(`//*[@id="${idTable}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; //.offsetWidth
            table.style.tableLayout = "auto";

            let lstWidthCol = [];
            columns.map((col) => {
                lstWidthCol.push(col?.headerStyle?.width || "350px");
            });

            table.style.width = `calc(${lstWidthCol.join(' + ')})`;
        } else {
            let table = document.evaluate(`//*[@id="${idTable}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; //.offsetWidth
            table.style.tableLayout = "fixed";
            table.style.width = "100%";
        }
    };

    const genFilter = (column, filter) => {
        let debounceWait = 1000;

        if (!filter) {
            return null;
        }

        let defaultMatchMode = ref_mathMode.current[column.dataField] || optionsMatchMode[0].value;
        let defaultConditionFilter = ref_filterConidtion.current[column.dataField] || filter?.advanced?.defaultValue || "";

        let filterComponent = null;
        let styleMatchMode = {};
        let styleCondition = {};
        switch (filter.type) {
            case "number":
                styleMatchMode = {width: "0px", display: "none"};
                styleCondition = {width: "calc(100% - 0px - 0px)"};

                if (filter.function) {
                    styleMatchMode = {display: "none"};
                    styleCondition = {width: "calc(100% - 0px)"};
                }
                filterComponent = <>
                    <CommonSelect
                        style={styleMatchMode}
                        defaultValue={defaultMatchMode}
                        allowClear={false} showSearch={false}
                        onChange={(value) => buildMathMode(column.dataField, value)}
                        dataRender={optionsMatchMode}
                        funcRender={renderSingleColumnOptions("value", "value", "name")}/>
                    <CommonInputNumber
                        key={ref_idTable.current + "-" + column.dataField}
                        id={ref_idTable.current + "-" + column.dataField}
                        onFocus={handleFocus} onBlur={handleFocus}
                        style={styleCondition}
                        allowClear
                        onChange={_.debounce((values) => {
                            buildFilterCondition(column.dataField, _.toString(values.floatValue));
                            onFilter();
                        }, debounceWait)}
                        defaultValue={defaultConditionFilter}
                        {...filter.advanced} />
                </>
                break;

            case "select":
                filterComponent = <CommonSelect
                    key={ref_idTable.current + "-" + column.dataField}
                    id={ref_idTable.current + "-" + column.dataField}
                    onFocus={handleFocus} onBlur={handleFocus}
                    style={{width: "calc(100% - 0px)"}}
                    onChange={_.debounce((value) => {
                        buildFilterCondition(column.dataField, _.toString(value));
                        onFilter();
                    }, debounceWait)}

                    defaultValue={defaultConditionFilter}
                    {...filter.advanced} />
                break;

            case "date":
                filterComponent = <CommonDatePicker
                    key={ref_idTable.current + "-" + column.dataField}
                    id={ref_idTable.current + "-" + column.dataField}
                    onFocus={handleFocus} onBlur={handleFocus}
                    style={{width: "calc(100% - 0px)"}}
                    onChange={_.debounce((value) => {
                        buildFilterCondition(column.dataField, _.toString(value));
                        onFilter();
                    }, debounceWait)}
                    defaultValue={defaultConditionFilter}
                    {...filter.advanced} />
                break;

            case "checkbox":
                filterComponent = <Checkbox
                    key={ref_idTable.current + "-" + column.dataField}
                    id={ref_idTable.current + "-" + column.dataField}
                    onFocus={handleFocus} onBlur={handleFocus}
                    style={{textAlign: "center"}}
                    onChange={_.debounce((value) => {
                        buildFilterCondition(column.dataField, _.toString(value));
                        onFilter();
                    }, debounceWait)}
                    // defaultValue={defaultConditionFilter}
                    checked={ref_filterConidtion.current[column.dataField] == 1}
                    {...filter.advanced} />
                break;

            default: //text
                styleMatchMode = {width: "0px", display: "none"};
                styleCondition = {width: "calc(100% - 0px - 0px)"};

                if (filter.function) {
                    styleMatchMode = {display: "none"};
                    styleCondition = {width: "calc(100% - 0px)"};
                }
                ;

                filterComponent = <>
                    <CommonSelect
                        style={styleMatchMode}
                        defaultValue={defaultMatchMode}
                        allowClear={false} showSearch={false}
                        onChange={(value) => buildMathMode(column.dataField, value)}
                        dataRender={optionsMatchMode}
                        funcRender={renderSingleColumnOptions("value", "value", "name")}/>
                    <Input
                        style={styleCondition}
                        key={ref_idTable.current + "-" + column.dataField}
                        id={ref_idTable.current + "-" + column.dataField}
                        onFocus={handleFocus} onBlur={handleFocus}
                        onChange={_.debounce((e) => {
                            buildFilterCondition(column.dataField, _.toString(e.target.value));
                            onFilter();
                        }, debounceWait)}
                        allowClear
                        defaultValue={defaultConditionFilter}
                        {...filter.advanced} />
                </>
                break;
        }

        focusElementAfterRender();

        return <Input.Group key={uuidv4()} compact className="filter-field" style={{textAlign: 'center'}}>
            {filterComponent}
            <Button
                key={uuidv4()}
                style={{
                    display: "none",
                }}
                name="btnFilterTable"
            >
                <i key={uuidv4()} className="fa-solid fa-magnifying-glass"/>
            </Button>
        </Input.Group>
    };

    const genHeaderAction = (column, headerAction) => {
        if (!headerAction) {
            return null;
        }

        let headerComponent = headerAction.function;
        focusElementAfterRender();

        return <Input.Group key={uuidv4()} compact className="filter-field" style={{textAlign: 'center'}}>
            {headerComponent}
            <Button
                key={uuidv4()}
                style={{
                    display: "none",
                }}
                name="btnFilterTable"
            >
                <i key={uuidv4()} className="fa-solid fa-magnifying-glass"/>
            </Button>
        </Input.Group>
    };

    const genCellContent = (cell, row, rowIndex, cellRender) => {
        if (cellRender?.function) {
            return <div style={cellRender?.style}>{cellRender.function(cell, row, rowIndex)}</div>;
        }

        return <div style={cellRender?.style}>{cell}</div>;
    };

    const genRowIndex = (cell, row, rowIndex) => <div
        key={uuidv4()}>{(s_pagingInfo.current - 1) * s_pagingInfo.pageSize + rowIndex + 1}</div>;

    const genItemPaging = (page, type, element) => {
        let resultElement = null;

        switch (type) {//'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next'

            case "prev":
                resultElement = <Button className="ant-pagination-item-link">
                    <i className="fa-solid fa-backward"/>
                </Button>;
                break;

            case "next":
                resultElement = <Button className="ant-pagination-item-link">
                    <i className="fa-solid fa-forward"/>
                </Button>;
                break;

            default:
                resultElement = element;
                break;
        }

        return resultElement;
    };

    //#endregion

    //#region Event
    const onSelectRow = (mode, callBackFunc) => (row, isSelect, rowIndex, e) => {
        const keyField = props.keyField;

        let dataSelected = [...ref_dataSelected.current];

        let rowsSelected = [];
        let record = {};

        if (mode === "radio") {
            dataSelected = [row[keyField]]
            rowsSelected = [row];
        } else {
            let key = row[keyField];

            if (isSelect) {
                dataSelected.push(key);
            } else {
                dataSelected = _.remove(dataSelected, (item) => item !== key);
                //dataSelected = dataSelected.splice(rowIndex, 1);
            }
            ;

            record = _.find(props.data, obj => obj[keyField] === key) || {};
            rowsSelected = _.filter(props.data, (obj) => dataSelected.indexOf(obj[keyField]) !== -1);
        }

        setTimeout(() => {
            if (dataSelected.length > 0 && dataSelected.length < props.data.length) {
                let checkBoxAll = document.evaluate(`//*[@id="${ref_idTable.current}"]//th[@class="selection-cell-header"]/input`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (checkBoxAll) {
                    checkBoxAll.checked = false;
                    checkBoxAll.indeterminate = true;
                }
            }
        }, 600);

        ref_dataSelected.current = dataSelected;

        if (callBackFunc) {
            callBackFunc({rowsSelected, rowIndex, e, record});
        }
    };

    const onSelectAllRow = (mode, callBackFunc) => (isSelect, rows, e) => {
        const keyField = props.keyField;

        let keySelected = [];
        let rowsSelected = [];

        if (!isSelect) {
            keySelected = [];
            rowsSelected = [];
        } else {
            keySelected = _.map(props.data, keyField);
            rowsSelected = [...props.data];
        }

        ref_dataSelected.current = keySelected;

        if (callBackFunc) {
            callBackFunc({rowsSelected, e});
        }
    };

    const onChangePaging = (current, pageSize) => {
        console.log(current, 'changePage');
        s_setPagingInfo({current, pageSize});
    };

    const onFilter = (e) => {
        s_setPagingInfo((preState) => {
            return ({
                ...preState,
                current: 1
            })
        })
        document.getElementById(`btnFilter-${ref_idTable.current}`).click();
    };

    const handleFocus = (e) => {
        //console.log(e);
        let id = e.target.id;

        if (e.type === "focus") {
            ref_elementFocus.current = id;
        } else if (e.type === "blur") {
            ref_elementFocus.current = "";
        }
    };
    //#endregion

    //#region Method 
    const buildFilterCondition = (field, value) => {
        let filterCondition = {...ref_filterConidtion.current};

        if (value?.target?.type === 'checkbox') {
            filterCondition[field] = value.target.checked ? 1 : 0;
        } else if (!value || value.trim() === "") {
            delete filterCondition[field];
        } else {
            filterCondition[field] = value;
        }
        ref_filterConidtion.current = filterCondition;

        if (p_watch) console.log(ref_filterConidtion.current);
    };

    const buildMathMode = (field, value) => {
        let mathMode = {...ref_mathMode.current};

        mathMode[field] = value;

        ref_mathMode.current = mathMode;

        if (p_watch) console.log(ref_mathMode.current);
    };

    const buildSortCondition = (field) => {
        let sortCondition = {...ref_sortCondition.current};

        if (sortCondition[field]) {
            sortCondition[field] = sortCondition[field] === "asc" ? "desc" : "asc";
        } else {
            sortCondition = {};
            sortCondition[field] = "asc";
        }

        ref_sortCondition.current = sortCondition;
        //ref_sortCondition.current = { [field]: sortCondition[field] };

        if (p_watch) console.log(ref_sortCondition.current);
    };

    const filter = (data) => {
        let dataAfterFilter = [...data];

        const lstField = _.keys(ref_filterConidtion.current);
        lstField.map((field) => {

            let col = _.find(props.columns, {dataField: field}) || {};

            let mathMode = "";
            if (col?.filter?.type === "select" || col?.filter?.type === "date") {
                mathMode = "equals";
            } else {
                mathMode = ref_mathMode.current[field] || optionsMatchMode[0].value;
            }

            const findString = ref_filterConidtion.current[field];

            if (col?.filter?.function) {
                dataAfterFilter = col?.filter?.function(dataAfterFilter, ref_filterConidtion.current[field], field);
            } else {
                dataAfterFilter = _.filter(dataAfterFilter, (obj) => StringUtils.compareString(findString, obj[field], mathMode));
            }

        });

        return dataAfterFilter;
    };

    const sort = (fieldName, data) => {
        if (fieldName) buildSortCondition(fieldName);

        let dataAfterSort = [];

        const iteratees = _.keys(ref_sortCondition.current);
        const orders = _.values(ref_sortCondition.current);

        props.columns.map((col) => {
            if (col.sort?.function) {
                let indexIteratees = _.indexOf(iteratees, col.dataField);
                iteratees[indexIteratees] = col.sort?.function;
            } else {
                switch (col.sort?.type) {
                    case "date":
                        let indexIteratees = _.indexOf(iteratees, col.dataField);
                        iteratees[indexIteratees] = (obj) => DateUtils.convertStringToDate(obj[fieldName], col.sort?.formatDate)
                        break;

                    default:
                        break;
                }
            }
        });

        dataAfterSort = _.orderBy(data, iteratees, orders);

        return dataAfterSort;
    };

    const resetTable = () => {
        ref_filterConidtion.current = {};
        ref_mathMode.current = {};
        ref_sortCondition.current = {};
        ref_dataSelected.current = [];
    };

    const changeVisibleCol = (lstCol, colName, visible) => {
        const index = _.findIndex(lstCol, {dataField: colName});

        let countVisibleCol = _.countBy(lstCol, {visible: true}).true;

        if (countVisibleCol === 1 && visible === false) {
            return lstCol;
        }

        let lstColNew = [...lstCol];
        lstColNew[index] = {...lstColNew[index]};

        lstColNew[index].visible = visible;

        return lstColNew;
    };

    const getListSelectdKey = (data) => {
        let keys = _.map(data, props.keyField);

        ref_dataSelected.current = keys;

        return keys;
    };

    const focusElementAfterRender = () => {
        if (ref_elementFocus.current !== "") {
            let interval = setInterval(() => {
                try {
                    document.getElementById(ref_elementFocus.current).focus();
                    clearInterval(interval);
                } catch (error) {
                }
            }, 100);
        }
    };
    //#endregion
    const selectTable = () => {
        let options = {...props};
        options.columns = [...options.columns];
        options.columns = genColumnObject(options.columns);

        options.id = ref_idTable.current;
        //options.cellEdit = cellEditFactory({ mode: 'click' });

        options.striped = true;
        options.condensed = true;
        options.hover = true;
        options.noDataIndication = <Trans ns="commonDatatable" name="commonDatatable:empty"/>;
        options.classes = "table-custom";

        options.funcFeature = {
            genHeaderGroup: genHeaderGroup,
            filter: filter,
            sort: sort,
            changeVisibleCol: changeVisibleCol,
            resetFilterAndSort: resetTable,
        };

        const pagingConfigDefault = {
            showSizeChanger: true,
            showLessItems: true,
            responsive: true,
            itemRender: genItemPaging,
            pageSizeOptions: AppConstants.DATATABLE.PAGE_SIZE_OPTIONS,
            current: s_pagingInfo.current,
            pageSize: s_pagingInfo.pageSize,
            onChange: onChangePaging,
        };
        const pagingConfigCustom = p_pagingConfig;

        let configSelect = undefined;
        if (options?.selectRow) {
            let configSelectCustom = {...options.selectRow};
            let configSelectDefault = {
                clickToSelect: options.selectRow?.clickToSelect ?? true,
                clickToEdit: true,
                selected: options.selectRow?.selected ? getListSelectdKey(options.selectRow?.selected) : ref_dataSelected.current,
                onSelect: onSelectRow(options.selectRow.mode, options.selectRow?.onChangeSelected),
                onSelectAll: onSelectAllRow(options.selectRow.mode, options.selectRow?.onChangeSelected),
                classes: options.selectRow?.enabledClass ? 'selection-row' : '',
            }

            configSelect = {...configSelectCustom, ...configSelectDefault};
        }
        options.selectRow = configSelect;

        switch (p_pagingType) {
            case "none":
                return <CustomTableNoPaging {...options} />

            case "api":
                options.pagingConfig = {...pagingConfigDefault, ...pagingConfigCustom};
                return <CustomTablePagingApi {...options} />

            default: //client
                options.pagingConfig = {...pagingConfigDefault, ...pagingConfigCustom};
                return <CustomTablePagingClient {...options} />
        }
    };

    return (
        <div id={"field-table-" + ref_idTable.current} className="common-datatble" style={containerStyle}>
            <style>
                {`
                    #field-table-${ref_idTable.current} .react-bootstrap-table {
                        max-height: ${p_size.scrollHeight};
                        height: ${p_size.height || "auto"};
                        max-width: ${p_size.scrollWidth};
                    }
                    #field-table-${ref_idTable.current} .react-bootstrap-table > table{
                   
                        width: ${p_size.width || "100%"} !important;
                    }
                `}
            </style>
            {selectTable()}
        </div>
    );
}

//export default React.memo(CommonTable, ObjectUtils.compareProps);
export default CommonTable;

//#region Gen Body function
export const genColDateChangeFormatDateString = (fromFormat, toFormat = AppConstants.DATE_TIME_FORMAT.DATE_FORMAT) => (cell, row, rowIndex) => {
    return <>{DateUtils.changeFormatDateString(cell, fromFormat, toFormat)}</>;
};
//#endregion

//#region Filter function
export const filterDateStringByString = (fromFormat, toFormat) => (data, condition, field) => {
    let result = [];

    try {
        result = _.filter(
            data,
            (obj) => DateUtils.changeFormatDateString(obj[field], fromFormat, toFormat).includes(condition)
        );
    } catch (error) {
        console.log(error);
        result = [];
    }

    return result;
};
//#endregion

CommonTable.propTypes = {
    keyField: PropTypes.string,
    data: PropTypes.array,
    columns: PropTypes.array,
    selectRow: PropTypes.any
};

CommonTable.defaultProps = {
    data: [],
    columns: [],
    size: {
        scrollHeight: "600px",
        height: "auto",
    },
    resetWhenDataChange: true,
    //pagingConfig: {},
};

export const genActionDefault = (options = {}) => (cell, row) => {
    // {
    //     onView: null,
    //     onInsert: null,
    //     onUpdate: null,
    //     onDelete: null,
    // }

    return <div key={uuidv4()} style={{textAlign: "center"}}>

        {options?.onView ? <CommonButton
            key={uuidv4()}
            type="actionTable"
            action={ActionConst.VIEW}
            title={i18n.t("common:common.tooltip.button-view")}
            onClick={options.onView(row)}
        >
            <i key={uuidv4()} className="fa-solid fa-eye"/>
        </CommonButton> : <></>}

        {options?.onInsert ? <CommonButton
            key={uuidv4()}
            type="actionTable"
            action={ActionConst.INSERT}
            title={i18n.t("common:common.tooltip.button-insert")}
            onClick={options.onInsert(row)}
        >
            <i key={uuidv4()} className="fa-solid fa-plus"/>
        </CommonButton> : <></>}

        {options?.onUpdate ? <CommonButton
            key={uuidv4()}
            type="actionTable"
            action={ActionConst.UPDATE}
            title={i18n.t("common:common.tooltip.button-update")}
            onClick={options.onUpdate(row)}
        >
            <i key={uuidv4()} className="fa-regular fa-pen-to-square"/>
        </CommonButton> : <></>}

        {options?.onDelete ? <CommonButton
            key={uuidv4()}
            type="actionTable"
            action={ActionConst.DELETE}
            title={i18n.t("common:common.tooltip.button-delete")}
            onClick={options.onDelete(row)}
        >
            <i key={uuidv4()} className="fa-regular fa-trash-can"/>
        </CommonButton> : <></>}

    </div>
};

export const genColumnValue = (lstValue, valueCode = "code", valueName = "name", data, rowData) => {
    // console.log('genColumnValue', lstValue, valueCode, valueName, data)
    if (StringUtils.stringNullOrEmpty(data)) return "";
    let value = _.clone(data);
    // console.log('genColumnValue', valueCode, valueName, value, lstValue);
    if (lstValue && !StringUtils.stringNullOrEmpty(value)) {
        for (let item of lstValue) {
            if (String(value) === String(item[valueCode])) {
                value = item[valueName];
                return value;
            }
        }
    }
    return value;
};

export const genColumnValueNumber = (value, rowData) => {
    if (StringUtils.stringNullOrEmpty(value)) return "";
    return StringUtils.stringToNumber(value);
};

export const genColumnCheckBox = (value, rowData) => {
    if(value == 'TRUE' || value == 'FALSE'){
        value = value == 'TRUE' ? 1 : 0 ;
    }
    return <Checkbox disabled checked={value == 1} style={{textAlign: "center"}}/>;
};

export const genColumnStatus = (data, rowData) => {
    if (StringUtils.stringNullOrEmpty(data)) return "";
    let value = _.clone(data);
    if (StatusConst.STATUS_TYPE && !StringUtils.stringNullOrEmpty(value)) {
        for (let item of StatusConst.STATUS_TYPE) {
            if (value == item['code']) {
                value = item['name'];
                return value;
            }
        }
    }
    return value;
};

export const genColumnDate = (srcDateFormat = AppConstants.DATE_TIME_FORMAT.DATE, desDateFormat = AppConstants.DATE_TIME_FORMAT.DATE, data, row, index) => {
    // console.log('genColumnDate', srcDateFormat, desDateFormat, data, row, index)
    if (StringUtils.stringNullOrEmpty(data)) return "";
    let value = _.clone(data);
    return moment(value, srcDateFormat).format(desDateFormat);
};

export const genColumnActionCheckBox = (equalValue, field, lstData, checkAll, cell, rowData ) => {

    return <Checkbox defaultChecked={rowData[field] == equalValue} style={{textAlign: "center"}}
                     onChange={(e) => onChangeTableCheckBox(rowData,field, e.target.checked, lstData, checkAll)}/>;
};

const onChangeTableCheckBox = (rowData, field, value, lstData, checkAll) => {

    if(value == false) {
        rowData[field] = 'FALSE';
        let findListTrue = lstData.find(item => item.checked === 'TRUE');
        if(ObjectUtils.objectNullOrEmpty(findListTrue)) {
            checkAll = false;
        }
    }
    if(value == true) {
        rowData[field] = 'TRUE';
        let findListTrue = lstData.find(item => item.checked === 'FALSE');
        if(!ObjectUtils.objectNullOrEmpty(findListTrue)) {
            checkAll = true;
        }
    }

}