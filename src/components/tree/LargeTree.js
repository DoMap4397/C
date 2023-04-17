import React, {useEffect, useState} from 'react';
import Tree, {FilteringContainer, renderers} from "react-virtualized-tree";
import {withTranslation} from "react-i18next";
import PropTypes from "prop-types";

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
        // console.log('handleChange', nodes)
        setNodes(nodes);
    };

    const nodeSelected = (e, node) => {
        e.preventDefault();
        // console.log('nodeSelected', node)
        setSelectedNode(node);
        if (props.onSelect) {
            props.onSelect(node);
        }
    }

    const indexByName = searchTerm => ({name, id}) => {
        // console.log('indexByName', name, id)
        if (props.filter) {
            return props.filter(searchTerm, name);
        } else {
            const upperCaseName = name.toUpperCase();
            const upperCaseSearchTerm = searchTerm.toUpperCase();
            return upperCaseName.indexOf(upperCaseSearchTerm.trim()) > -1 || String(id).toUpperCase().indexOf(upperCaseSearchTerm.trim()) > -1;
        }
    };

    const Deepness = ({node, children, className}) => {
        if (props.renderNode) {
            return <span className={className}>{props.renderNode(node)}</span>;
        } else {
            return <span className={className}>{node[props.nameField]}</span>;
        }
    };

    return <div className={'field-tree'}>
        {!props.lazySearch ?
            <FilteringContainer nodes={s_nodes} indexSearch={indexByName}>
                {({nodes}) => {
                    return (
                        <div className='full-height'>
                            <Tree nodes={nodes} onChange={handleChange}>
                                {({style, node, ...rest}) => {
                                    let amISelected = selectedNode && node[props.keyField] === selectedNode[props.keyField];
                                    return (
                                        <div className={'nodeItem'} style={style} onClick={(e) => {
                                            nodeSelected(e, node)
                                        }}>
                                            <Expandable node={node} {...rest} iconsClassNameMap={{
                                                expanded: 'fa-regular fa-square-minus marginRight8',
                                                collapsed: 'fa-regular fa-square-plus marginRight8',
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
                    )
                }}
            </FilteringContainer>
            :
            <div className='full-height'>
                <Tree nodes={s_nodes} onChange={handleChange}>
                    {({style, node, ...rest}) => {
                        let amISelected = selectedNode && node[props.keyField] === selectedNode[props.keyField];
                        return (
                            <div style={style} onClick={(e) => {
                                nodeSelected(e, node)
                            }}>
                                <Expandable node={node} {...rest} iconsClassNameMap={{
                                    expanded: 'fa-regular fa-square-minus marginRight8',
                                    collapsed: 'fa-regular fa-square-plus marginRight8',
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
        }
    </div>
}

export default withTranslation(["common"])(LargeTree);

LargeTree.defaultProps = {
    nameField: 'name',
    keyField: 'id',
    lazySearch: false
}

LargeTree.propTypes = {
    treeData: PropTypes.array.isRequired,
    keyField: PropTypes.string.isRequired,
    nameField: PropTypes.string,
    onSelect: PropTypes.func,
    filter: PropTypes.func,
    renderNode: PropTypes.element,
    lazySearch: PropTypes.bool
}