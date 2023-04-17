import React, {useEffect, useState} from 'react';
import Tree, {FilteringContainer, renderers} from "react-virtualized-tree";
import {withTranslation} from "react-i18next";
import PropTypes from "prop-types";

import _ from 'lodash';

const {Expandable} = renderers;

const LargeTree = (props) => {
    const {t} = props;

    const [s_nodes, setNodes] = useState([])
    const [selectedNode, setSelectedNode] = useState(null)

    useEffect(() => {
        // console.log('did mountLargeTree ', props.treeData.length)
        setNodes(loopThroughTree(props.treeData));
    }, [props.treeData]);

    const loopThroughTree = (data) => {
        for (let i = 0; i < data.length; i++) {
            if (props.keyField) {
                data[i]['id'] = data[i][props.keyField]
            }
            if (data[i].children === undefined || data[i].children === null) {
                data[i].children = []
            }
            if (Array.isArray(data[i].children)) {
                loopThroughTree(data[i].children);
            }
        }
        // console.log('loopThroughTree done', data)
        return data;
    }

    const handleChange = nodes => {
        console.log('handleChange', nodes)
        setNodes(nodes);
    };

    const nodeSelected = (e, node) => {
        e.preventDefault();
        console.log('nodeSelected', node)
        setSelectedNode(node);
        if (props.onSelect) {
            props.onSelect(node);
        }
    }

    const Deepness = ({node, children, className}) => {
        // console.log("props" , props)
        // console.log("children" , children)
        console.log("node" , node)
        let icon= "";
        if(node.state?.expanded) {
            icon = <i className="fa-sharp fa-solid fa-folder-open colorIconTree"></i>;
        } else {
            icon = <i className="fa-sharp fa-solid fa-folder colorIconTree"></i>;
        }
        if (props.renderNode) {
            return <span className={className} title= {props.renderNode(node)}> {icon}   {props.renderNode(node)}</span>;
        } else {
            return <span className={className} title=  {node[props.nameField]}> {icon}  {node[props.nameField]}</span>;
        }
    };

    return <div className={'field-tree'}>

        <div className='full-height'>
            <Tree nodes={s_nodes} onChange={handleChange}>
                {({style, node, ...rest}) => {
                    let amISelected = selectedNode && node[props.keyField] === selectedNode[props.keyField];
                    return (
                        <div style={style} onClick={(e) => {
                            nodeSelected(e, node)
                        }}>
                            <Expandable node={node} {...rest} iconsClassNameMap={{
                                expanded: 'fa-sharp fa-solid fa-caret-down  marginRight8 ',
                                collapsed: 'fa-sharp fa-solid fa-caret-right marginRight8 ',
                                lastChild: ''
                            }}>
                                <Deepness node={node}
                                          className={amISelected ? "nodeSelected" : ""} {...rest}/>
                            </Expandable>
                        </div>
                    )
                }}
            </Tree>
        </div>

    </div>
}

export default withTranslation(["common"])(LargeTree);

LargeTree.defaultProps = {
    nameField: 'name',
    keyField: 'id'
}

LargeTree.propTypes = {
    treeData: PropTypes.array.isRequired,
    keyField: PropTypes.string.isRequired,
    nameField: PropTypes.string,
    onSelect: PropTypes.func,
    filter: PropTypes.func,
    renderNode: PropTypes.element
}