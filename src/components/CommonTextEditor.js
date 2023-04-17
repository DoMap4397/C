import React, {useEffect, useState} from "react";
//import PropTypes from "prop-types";
import JoditEditor from "jodit-react";

const CommonTextEditor = ({config: p_config, onChange: p_onChange, ...props}) => {
    const defaultConfig = {
        placeholder: "",
        buttons: [
            'source',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'ul',
            'ol',
            '|',
            'font',
            'fontsize',
            'brush',
            'paragraph',
            '|',
            'image',
            'table',
            'link',
            '|',
            'left',
            'center',
            'right',
            'justify',
            '|',
            'undo',
            'redo',
            '|',
            'hr',
            'eraser',
            'fullsize',
        ],
    };
    
    const [s_config, s_setConfig] = useState({});

    useEffect(() => {
        let config = {...defaultConfig, ...p_config};
        s_setConfig(config);

    }, [p_config]);

    const onChange = (value) => {
        if(p_onChange && value?.trim() !== "") {
            p_onChange(value);
        }
    };

    return (
        <div style={{maxHeight: "500px"}}>
            <JoditEditor
            config={s_config}
            {...props}
            onChange={onChange}
        />
        </div>
    );
}

export default CommonTextEditor;

CommonTextEditor.defaultProps = {
    onChange: (e) => console.log(e),
    value: "",
};

CommonTextEditor.propTypes = {
};