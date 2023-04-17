import React, {Component, useState} from 'react';
import {Tree} from "antd";
import {StringUtils} from "../../utils/StringUtils";
import {closeCircleLoading, showCircleLoading} from "../CircleLoading";

const {TreeNode} = Tree;

class CustomTree extends Component {
    static defaultProps = {
        dataTree: [],
        selectable: true,
        showLine: true,
        showIcon: true,
        id: "id",
        code: "code",
        name: "name",
        separator: " - "
    };

    constructor(props) {
        super(props);
        if (this.props.renderOption) {
            this.state = {
                renderOption: this.props.renderOption,
            }
        } else {
            this.state = {
                renderOption: [this.props.code, this.props.name],
            }
        }
    };

    render() {
        return (
            (this.props.dataTree && this.props.dataTree?.length > 0) ?
                <Tree {...this.props} selectable={this.props.selectable}
                      showLine={this.props.showLine} showIcon={this.props.showIcon}
                      className="hide-file-icon" style={{listStyle: 'none'}}>
                    {this.renderTreeNodes(this.props.dataTree, this.props.id, this.props.code, this.props.name, this.state.renderOption, this.props.separator, this.props.searchValue)}
                </Tree> : ""

        );
    };

    renderTreeNodes = (data, id, code, name, renderOption, separator, searchValue = "") => {
        if (data?.length > 0) {
            return data?.map(item => {
                if (!item) return null;
                let titleArr = [];
                for (let field of renderOption) {
                    titleArr.push(item[field]);
                }
                let titleData = titleArr.join(separator);
                const index = titleData.toLowerCase().indexOf(searchValue.toLowerCase());
                const beforeStr = titleData.substr(0, index);
                const afterStr = titleData.substr(index + searchValue.length);
                const content = titleData.substring(index, index + searchValue.length);
                let title =
                    index > -1 ? (<span>{beforeStr}<span
                            style={{color: 'red', fontWeight: "bold"}}>{content}</span>{afterStr}</span>)
                        : (<span>{titleData}</span>);
                if (StringUtils.stringNullOrEmpty(searchValue)) {
                    title = index > -1 ? beforeStr + " " + content + " " + afterStr : titleData;
                }
                let booleanIcon = true;
                if (this.props.expandedKeys.indexOf(item[id]) > -1) {
                    booleanIcon = true;
                } else {
                    booleanIcon = false;
                }
                if (item.children || item.hasChild) {
                    return (
                        <TreeNode style={{listStyle: 'none'}} title={title}
                                  icon={booleanIcon ?
                                      <i className="fa-sharp fa-solid fa-folder-open colorIconTree"></i> :
                                      <i className="fa-sharp fa-solid fa-folder colorIconTree"></i>}
                                  className={"noWrap"}
                                  key={item[id]} dataRef={item} isLeaf={!item.children}>
                            {this.renderTreeNodes(item.children, id, code, name, renderOption, separator, searchValue)}
                        </TreeNode>
                    );
                }
                return <TreeNode style={{listStyle: 'none'}} title={title} icon={booleanIcon ?
                    <i className="fa-sharp fa-solid fa-folder-open colorIconTree"></i> :
                    <i className="fa-sharp fa-solid fa-folder colorIconTree"></i>}
                                 key={item[id]} dataRef={item} className={"noWrap"} isLeaf={!item.children}/>;
            });
        }

    };
}

export default CustomTree;