import React, { useState, useEffect, useRef } from "react";
import { Input, Tree } from "antd";
//import { v4 as uuidv4 } from "uuid";
import { ObjectUtils } from "utils/ObjectUtils";
import { StringUtils } from 'utils//StringUtils';

const _ = require('lodash');

const CommonTree = ({
  dataRender: p_data,
  showSearch: p_showSearch,
  field: p_field,
  onSelect: p_onSelect,
  ...props
}) => {
  const [s_treeData, s_setTreeData] = useState([]);
  const [s_expandedKeys, s_setExpandedKeys] = useState(props.defaultExpandedKeys);
  const [s_autoExpandParent, s_setAutoExpandParent] = useState(true);

  const ref_dataList = useRef([]);
  const ref_flatList = useRef([]);
  const ref_searchCondition = useRef('');

  useEffect(() => {
    s_setTreeData(p_data);
    ref_dataList.current = [];

    parseTreeToList(p_data);

    if (props.defaultExpandAll) {
      let expandedKeys = [];
      ref_dataList.current.map(item => {
        expandedKeys.push(item[p_field.fieldValue])
      });

      s_setExpandedKeys(expandedKeys);
    }
  }, [p_data]);

  //#region Method
  const parseTreeToList = (tree) => {
    for (let i = 0; i < tree.length; i++) {
      const item = tree[i];

      ref_dataList.current.push({
        [p_field.fieldName]: item[p_field.fieldName],
        [p_field.fieldValue]: item[p_field.fieldValue]
      });

      ref_flatList.current.push(item);

      if (item[p_field.fieldChild]) {
        parseTreeToList(item[p_field.fieldChild]);
      }
    }
  };

  const getParentKey = (value, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];

      if (node[p_field.fieldChild]) {
        if (_.some(node[p_field.fieldChild], item => item[p_field.fieldValue] === value)) {
          parentKey = node[p_field.fieldValue];
        }
        else if (getParentKey(value, node[p_field.fieldChild])) {
          parentKey = getParentKey(value, node[p_field.fieldChild]);
        }
      }
    }
    return parentKey;
  };

  const genTreeHighLight = (data) => data.map((item) => {
    let filter = StringUtils.nvl(ref_searchCondition.current,"").toLowerCase();
    const index = item[p_field.fieldName].toLowerCase().indexOf(filter);

    const beforeStr = item[p_field.fieldName].substring(0, index);
    const centerStr = item[p_field.fieldName].slice(index, index + filter.length);
    const afterStr = item[p_field.fieldName].slice(index + filter.length);

    const title =
      index > -1 ? (
        <span>
          {beforeStr}
          <span className="highlight-text">{centerStr}</span>
          {afterStr}
        </span>
      ) : (
        <span>{item[p_field.fieldName]}</span>
      );

    if (item[p_field.fieldChild]) {
      return { title, key: item[p_field.fieldValue], children: genTreeHighLight(item[p_field.fieldChild]) };
    }

    return {
      title,
      key: item[p_field.fieldValue],
    };
  });

  const filter = (value) => {
    ref_searchCondition.current = value;

    let dataList = ref_dataList.current;
    let treeData = s_treeData;

    if (value === "") {
      s_setExpandedKeys([]);
      s_setAutoExpandParent(false);
      return;
    }

    let expandedKeys = [];
    _.map(dataList, obj => {
      if (StringUtils.compareString(value, obj[p_field.fieldName])) {
        expandedKeys.push(getParentKey(obj[p_field.fieldValue], treeData));
      }
    });

    s_setExpandedKeys(expandedKeys);
    s_setAutoExpandParent(true);

  };
  //#endregion

  //#region Event
  const onSelect = (value, e) => {

    let nodeKey = e?.node?.key;
    let node = null;

    if (nodeKey) {
      node = _.find(ref_flatList.current, obj => obj[p_field.fieldValue] === nodeKey);
    }
    
    if(p_onSelect) {
      p_onSelect(value, node, e)
    }
  }
  const onExpand = (expandedKeys) => {
    s_setExpandedKeys(expandedKeys);
    s_setAutoExpandParent(false);
  };

  const onSearch = _.debounce((e) => {
    filter(e.target.value);
  }, 300);
  //#endregion

  return (
    <div className="common-tree">
      {p_showSearch === true ? <Input className="search-field" defaultValue={ref_searchCondition.current} allowClear onChange={onSearch} /> : null}
      <div className="content-tree">
        <Tree
          expandedKeys={s_expandedKeys}
          autoExpandParent={s_autoExpandParent}
          onExpand={onExpand}
          treeData={genTreeHighLight(s_treeData)}
          onSelect={onSelect}
          {...props}
        />
      </div>
    </div>
  );
};

export default CommonTree;
//export default React.memo(CommonTree, ObjectUtils.compareProps);

CommonTree.defaultProps = {
  showSearch: true,
  defaultExpandAll: false,
  defaultExpandedKeys: [],
  field: { fieldName: "name", fieldValue: "value", fieldChild: "child" },
  checkable: false,
  dataRender: [],
  showLine: { showLeafIcon: false },
  onSelect: (selectedKeys, node, e) => console.log("onSelect", { selectedKeys, node, e }),
  onCheck: (checkedKeys, node, e) => console.log("onCheck", { checkedKeys, node, e }),
};
