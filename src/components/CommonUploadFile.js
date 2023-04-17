import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {v4 as uuidv4} from 'uuid';
import {Button, Dropdown} from "antd";
import {Input, InputGroup, ListGroup, ListGroupItem,} from "reactstrap";
import {showError} from "components/MessageBox";
import {Trans} from "translation/i18n";
import {Constants as AppConstants} from "constants/Constants";

const _ = require('lodash');

const CommonUploadFile = ({
                              onChange: onChangeFile,
                              config,
                              files,
                              disabled,
                              readOnly,
                              maxSize,
                              additionalBtns,
                              ...props
                          }) => {

    const [s_visible, s_setVisible] = useState(false);
    const [s_listFile, s_setListFile] = useState([]);
    const [s_contentDropDonw, s_setContentDropDonw] = useState([]);

    const ref_inputFile = useRef();
    const ref_inputText = useRef();

    useEffect(() => {
        s_setListFile(files);
    }, [files]);

    useEffect(() => {
        let inputText = ref_inputText.current;

        let filenames = [];
        let items = [];

        items = s_listFile.map(file => {
            let fileInfo = file.url ? <a rel="noreferrer" download={file.name || ""} href={file.blob || file.url}
                                         target="_blank">{file.name || file.url}</a> :
                <span>{file.name}</span>;

            filenames.push(file.name || file.url);

            return <ListGroupItem key={uuidv4()} title={file.name || file.url}>
                {fileInfo}
                <i
                    hidden={readOnly || disabled}
                    className="fa-solid fa-xmark"
                    onClick={onRemoveFile(file.url || file.name)}
                />
            </ListGroupItem>
        });

        inputText.value = filenames.join(", ");
        s_setContentDropDonw(items);

    }, [s_listFile]);

    const onChange = (e) => {
        const template = AppConstants.REGEX.FILE_NAME;

        let inputFile = ref_inputFile.current;

        let files = [...inputFile.files];

        let isValid = true, sizeValid = true;
        let filenames = [];

        let index = 0;
        for (index = 0; index < files.length; index++) {
            const file = files[index];

            if (!template.test(file.name)) {
                isValid = false;
                break;
            }
            if (maxSize && file.size > maxSize) {
                sizeValid = false;
                break;
            }
            filenames.push(file.name);
        }

        console.log(maxSize, "Maxsize")
        // console.log(file.size, "file")
        if (isValid === false) {
            showError(<Trans ns="commonInputText" name={"commonInputText:filenameIsValid"}/>);
            s_setListFile([]);
            inputFile.value = '';
            return;
        }
        if (!sizeValid) {
            showError(<Trans ns="commonInputText" name={"commonInputText:fileTooLarge"}
                             params={{size: (maxSize / (1024 * 1024))}}/>);
            s_setListFile([]);

            return;
        }

        s_setListFile(files);

        if (onChangeFile) {
            onChangeFile({files});
        }

        inputFile.value = '';
    };

    const onRemoveFile = (fileKey) => (e) => {
        let index = _.findIndex(s_listFile, file => file.name === fileKey || file.url === fileKey);
        let newListFile = [...s_listFile];

        newListFile.splice(index, 1);

        s_setListFile(newListFile);

        if (onChangeFile) {
            onChangeFile({files: newListFile});
        }
    };

    const renderAdditionalButton = () => {
        if (Array.isArray(additionalBtns)) {
            return additionalBtns.map(btn => {
                return (
                    <Button
                        hidden={btn.hidden ?? false}
                        title={btn.title}
                        onClick={btn.onClick}
                        // disabled={btn.disabled ?? false}
                    >
                        <i className={btn.iconClass}/>
                    </Button>
                )
            })
        }
    }

    return <div>
        <Dropdown
            overlay={<div className="file-dropdown">
                <ListGroup flush>
                    {s_contentDropDonw}
                </ListGroup>
            </div>}
            visible={s_visible}
            disabled={disabled}
            onVisibleChange={() => s_setVisible(false)}
        >
            <InputGroup className="common-upload-file" {...props} onMouseEnter={() => s_setVisible(true)}>
                <Input
                    innerRef={ref_inputText}
                    className="ant-input"
                    readOnly={true}
                    disabled={disabled}
                    onClick={() => s_setVisible(true)}
                />
                <Button
                    hidden={readOnly}
                    title={"Upload"}
                    onClick={() => ref_inputFile.current.click()}
                    disabled={disabled}
                >
                    <i className="fa-solid fa-upload"/>
                </Button>

                {renderAdditionalButton()}

            </InputGroup>
        </Dropdown>
        <Input
            {...config}
            innerRef={ref_inputFile}
            type="file"
            hidden
            disabled={disabled}
            onChange={onChange}
        />
    </div>;
}

export default CommonUploadFile;

CommonUploadFile.defaultProps = {
    files: [],
    readOnly: false,
    disabled: false,
    config: {
        multiple: true,
        //accept: ".xlsx, .pdf",
    },
    onChange: (e) => console.log(e),
};

CommonUploadFile.propTypes = {
    files: PropTypes.array,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    config: PropTypes.object,
    onChange: PropTypes.func,
}
