import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import BootstrapTable from 'react-bootstrap-table-next';
import { Form } from "reactstrap";
import { Button } from 'antd';

const _ = require('lodash');

const CustomTableNoPaging = ({
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

    //#region Effect
    useEffect(() => {
        p_funcFeature.genHeaderGroup(props.id, p_headerGroup, s_columns);
    }, [p_headerGroup, s_columns]);

    useEffect(() => { //trigger when props.columns change
        s_setColumns(p_columns);
    }, [p_columns]);

    useEffect(() => { //trigger when props.data change

        let dataAfterFilter = p_funcFeature.filter(p_data);
        let dataAfterSort = p_funcFeature.sort(null, dataAfterFilter);

        s_setDataAfterFilter(dataAfterSort);
    }, [p_data]);

    //#endregion

    //#region Event
    const handleClick = (e) => {
        const name = e?.target?.name;

        if (name === "btnFilterTable") {

            let dataAfterFilter = p_funcFeature.filter(p_data);

            s_setDataAfterFilter(dataAfterFilter);
        }
        else if (name === "btnSortTable") {
            const filedName = JSON.parse(e.target.dataset.info).fieldName;
            let dataAfterSort = p_funcFeature.sort(filedName, s_dataAfterFilter);

            s_setDataAfterFilter(dataAfterSort);
        }

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
                <Button hidden name="btnFilterTable" id={`btnFilter-${props.id}`}/>
                <BootstrapTable
                    {...props}
                    columns={_.filter(s_columns, { visible: true }) || []}
                    data={s_dataAfterFilter}
                />
            </Form>
        </>
    );
}

export default withTranslation(["common", "commonDatatable"])(CustomTableNoPaging);
