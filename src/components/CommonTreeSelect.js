import React from "react";
import { ObjectUtils } from "utils/ObjectUtils";
import { TreeSelect } from "antd";

const { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } = TreeSelect;

const _ = require('lodash');

const CommonTreeSelect = ({
  dataRender,
  funcRender,
  showCheckedStrategy,
  ...props
}) => {

  const onChangeValue = (value) => {
    if (props.onChange) {
      if (props.multiple === true) {
        props.onChange(value || []);
      }
      else {
        props.onChange(_.toString(value));
      }

    }
  };

  const onSelectOption = (value, element) => {
    if (props.onSelect) {
      props.onSelect(_.toString(value), element?.item);
    }
  };

  return (
    <>
      <TreeSelect
        {...props}
        className="common-tree-select"
        showCheckedStrategy={showCheckedStrategy === "child" ? SHOW_CHILD : showCheckedStrategy === "parent" ? SHOW_PARENT : SHOW_ALL}
        onChange={onChangeValue}
        onSelect={onSelectOption}
      >
        {funcRender(dataRender)}
      </TreeSelect>
    </>
  );
};

export default CommonTreeSelect;
//export default React.memo(CommonTreeSelect, ObjectUtils.compareProps);

const filterTreeNode = (input, event) => {
  //console.log({input, event});
  return String(event.title.props.children)
    .toLowerCase()
    .includes(input.toLowerCase());
};

CommonTreeSelect.defaultProps = {
  maxTagCount: 'responsive',
  showArrow: true,
  showSearch: true,
  allowClear: true,
  treeDefaultExpandAll: true,
  multiple: false,
  treeCheckable: false,
  showCheckedStrategy: "all",
  treeLine: { showLeafIcon: false },
  dropdownStyle: { maxHeight: 400, overflow: "auto" },
  filterTreeNode: filterTreeNode,
  dataRender: [],
  funcRender: () => { },
};
