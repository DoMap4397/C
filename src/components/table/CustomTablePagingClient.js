import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import BootstrapTable from 'react-bootstrap-table-next';
import { Form } from "reactstrap";
import { Button, Pagination } from 'antd';
import SelectColumnsTable from "./SelectColumnsTable"
import ExportTable from "./ExportTable"

const _ = require('lodash');

const CustomTablePagingClient = ({
    data: p_data,
    columns: p_columns,
    funcFeature: p_funcFeature,
    pagingConfig: p_pagingConfig,
    headerGroup: p_headerGroup,
    ...props
}) => {
    const { t } = props;

    const [s_columns, s_setColumns] = useState(p_columns);
    const [s_dataAfterFilter, s_setDataAfterFilter] = useState([]);
    const [s_dataAfterPaging, s_setDataAfterPaging] = useState([]);

    //#region Effect
    useEffect(() => {
        p_funcFeature.genHeaderGroup(props.id, p_headerGroup, s_columns);
    }, [p_headerGroup, s_columns]);

    useEffect(() => { //trigger when props.columns change
        let oldColumns = [...s_columns];
        let newColumns = p_columns.map(newCol => {
            let oldCol = _.find(oldColumns, obj => obj.dataField === newCol.dataField) || {};

            newCol.visible = oldCol.visible;

            return newCol;
        });


        s_setColumns(newColumns);
    }, [p_columns]);

    useEffect(() => { //trigger when props.data change

        let dataAfterFilter = p_funcFeature.filter(p_data);
        let dataAfterSort = p_funcFeature.sort(null, dataAfterFilter);

        s_setDataAfterFilter(dataAfterSort);
    }, [p_data]);

    useEffect(() => { //trigger after filter or page change
        const { current: currentPage, pageSize } = p_pagingConfig;

        let dataAfterPadding = _.slice(
            s_dataAfterFilter,
            currentPage * pageSize - pageSize,
            currentPage * pageSize
        );

        s_setDataAfterPaging(dataAfterPadding);

    }, [s_dataAfterFilter, p_pagingConfig.current, p_pagingConfig.pageSize]);
    //#endregion

    //#region Event
    const handleClick = (e) => {
        //console.log(e);

        const name = e?.target?.name;

        if (name === "btnFilterTable") {
            let dataAfterFilter = p_funcFeature.filter(p_data);

            s_setDataAfterFilter(dataAfterFilter);
        } else if (name === "btnSortTable") {
            const filedName = JSON.parse(e.target.dataset.info).fieldName;
            let dataAfterSort = p_funcFeature.sort(filedName, s_dataAfterFilter);

            s_setDataAfterFilter(dataAfterSort);
        }

    };

    const onChangeVisibleCol = (colName, visible) => {
        s_setColumns(p_funcFeature.changeVisibleCol([...s_columns], colName, visible));
    };

    const onResetFilterAndSort = () => {
        p_funcFeature.resetFilterAndSort();
        s_setDataAfterFilter(p_data);
    };
    //#endregion

    //#region Method
    //#endregion

    return (
        <>
            <Form
                onClick={handleClick}
                noValidate='novalidate' autoComplete="off"
                onSubmit={(e) => e.preventDefault()}>
                <Button hidden name="btnFilterTable" id={`btnFilter-${props.id}`} />
                <BootstrapTable
                    {...props}
                    columns={_.filter(s_columns, { visible: true }) || []}
                    data={s_dataAfterPaging}
                />
            </Form>
            <div className="common-datatble-paging client">
                <div className="total-field">
                    <span>
                        {s_dataAfterFilter.length}
                        {t("commonDatatable:record")}
                    </span>
                </div>
                <Pagination
                    className="page-filed"
                    total={s_dataAfterFilter.length}
                    {...p_pagingConfig}
                />
                <div className="action-field">
                    <button onClick={onResetFilterAndSort} title={t("commonDatatable:resetFilterAndSort")}>
                        <i className="fa-solid fa-arrow-rotate-left" />
                    </button>
                    <SelectColumnsTable title={t("commonDatatable:visibleColumn")}
                        columns={s_columns}
                        onChange={onChangeVisibleCol} />
                    <ExportTable
                        idTable={props.id}
                        title={t("commonDatatable:exportExcel")}
                        columns={_.filter(s_columns, { visible: true }) || []}
                        data={p_data}
                    />
                </div>
            </div>
        </>
    );
}

export default withTranslation(["common", "commonDatatable"])(CustomTablePagingClient);
