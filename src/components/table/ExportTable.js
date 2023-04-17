import React from "react";
import * as XLSX from "xlsx";

const ExportTable = ({
    idTable: p_idTable,
    data: p_data,
    columns: p_columns,
    ...props
}) => {

    //#region Event
    const onExport = () => {
        let ws = fullDataToSheet();
        //let ws = currentPageDataToSheet();

        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);

        XLSX.writeFile(wb, "Data-export.xlsx");
    };
    //#endregion

    //#region Method
    const currentPageDataToSheet = () => {
        let headers = p_columns.map((col) => {
            return col.text;
        });

        let table = document.getElementById(p_idTable);

        let opts = {
            raw: true
        };

        let ws = XLSX.utils.table_to_sheet(table, opts);
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 0 });

        return ws;
    };

    const fullDataToSheet = () => {
        let headers = [];
        let fields = [];
        for (let i = 0; i < p_columns.length; i++) {
            const col = p_columns[i];
            if (col.dataField !== "#" && col.dataField !== "actions") {
                headers.push(col.text);
                fields.push(col.dataField);
            }
        }

        let data = p_data.map((record, index) => {
            let dataRow = fields.map((field) => {
                return record[field] ?? "";
            });

            return dataRow;
        });
        

        let opts = {};

        data.unshift(headers);
        let ws = XLSX.utils.aoa_to_sheet(data, opts);
        XLSX.utils.sheet_add_aoa(ws, [], { origin: 0 });

        return ws;
    };
    //#endregion

    return (
        <>
            {/* <button {...props} onClick={onExport}>
                <i className="fa-solid fa-file-export" />
            </button> */}
        </>
    );
}

export default ExportTable;
