import React, {useRef} from "react";
import {Button} from "antd";
import {InputGroup, Input} from "reactstrap";
import {showError} from "components/MessageBox";
import {Trans} from "translation/i18n";
import {Constants as AppConstants} from "constants/Constants";

const CommonInputFile = ({onChange: onChangeFile, config, ...props}) => {

    let ref_inputFile = useRef();
    let ref_inputText = useRef();

    const onChange = (e) => {
        const template = AppConstants.REGEX.FILE_NAME;

        let inputFile = ref_inputFile.current;
        let inputText = ref_inputText.current;

        let files = [...inputFile.files];

        let isValid = true;
        let filenames = [];

        let index = 0;
        for (index = 0; index < files.length; index++) {
            const file = files[index];

            if (!template.test(file.name)) {
                isValid = false;
                break;
            }

            filenames.push(file.name);
        }

        if (isValid === false) {
            showError(<Trans ns="commonInputText" name={"commonInputText:filenameIsValid"}/>);
            inputText.value = "";

            return;
        }

        inputText.value = filenames.join(", ");
        inputText.title = filenames.join(", ");

        if (onChangeFile) {
            onChangeFile({files});
        }

        inputFile.value = '';
    };
    const removeAllFile = (e) => {
        ref_inputFile.current.files = undefined;
        ref_inputText.current.value = "";
        onChangeFile({});

    }

    return <>
        <InputGroup className="common-input-file" {...props}>
            <Input
                innerRef={ref_inputText}
                className="ant-input"
                readOnly={true}
                disabled={props.disabled === true}
            />
            <Button onClick={() => ref_inputFile.current.click()}
                disabled={props.disabled === true}
                title={"Upload file"}
            >
                <i className="fa-solid fa-upload"/>
            </Button>
            <Button onClick={removeAllFile}
                    disabled={props.disabled === true}
                    title={"Xóa file"}
            >
                <i className="fa-solid fa-trash"/>
            </Button>
        </InputGroup>
        <Input {...config} accept={props.accept || ''} innerRef={ref_inputFile} type="file" onChange={onChange} hidden/>
    </>;
}

export default CommonInputFile;
