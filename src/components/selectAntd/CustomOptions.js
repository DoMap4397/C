import React from "react";
import { Select, TreeSelect } from "antd";
import { Row, Col } from "reactstrap";
import Tooltip from "components/CommonTooltip";
import { v4 as uuidv4 } from "uuid";
//import i18n from "translation/i18n";

const { Option } = Select;
const { TreeNode } = TreeSelect;

export const renderListString = (header) => (data) => {
  let children = [];

  if (header) {
    children.push(
      <Option disabled key={uuidv4()} label={"header"} value={"header"}>
        <div key={uuidv4()} className="custom-options header">
          {header}
        </div>
      </Option>
    );
  }

  if (data?.length > 0) {
    data.forEach((item) => {
      let name = item;
      let value = item;

      children.push(
        <Option key={uuidv4()} label={name} value={value}>
          <div key={uuidv4()} className="custom-options">
            <Tooltip key={uuidv4()}>
              <div>{name}</div>
            </Tooltip>
          </div>
        </Option>
      );
    });
  }

  return children;
};

export const renderSingleColumnOptions =
  (valueField = "value", keyField = "key", nameField = "name", header) =>
    (data) => {
      let children = [];

      if (header) {
        children.push(
          <Option disabled key={uuidv4()} label={"header"} value={"header"}>
            <div key={uuidv4()} className="custom-options header">
              {header}
            </div>
          </Option>
        );
      }

      if (data?.length > 0) {
        data.forEach((item) => {
          let keyItem = uuidv4(); //item[keyField];
          let nameItem = item[nameField];
          let valueItem = String(item[valueField]);

          children.push(
            <Option key={keyItem} label={nameItem} value={valueItem} item={item}>
              <div key={uuidv4()} className="custom-options">
                <Tooltip key={uuidv4()} className="content-single-col">
                  <div key={uuidv4()}>{nameItem}</div>
                </Tooltip>
              </div>
            </Option>
          );
        });
      }

      return children;
    };

export const renderMultipleColumnOptions =
  (
    valueField = "value",
    keyField = "key",
    nameField = ["key", "name"],
    header = [],
    widthCol = []
  ) =>
    (data) => {
      let children = [];

      if (header?.length > 0) {
        children.push(
          <Option disabled key={uuidv4()} label={"header"} value={"header"}>
            <div key={uuidv4()} className="custom-options header">
              <Row key={uuidv4()}>
                {header.map((item, index) => {
                  return (
                    <Col key={uuidv4()} className="content" xs={widthCol[index]}>
                      {item}
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Option>
        );
      }

      if (data?.length > 0) {
        data.forEach((item) => {
          let keyItem = uuidv4(); //item[keyField];
          let nameItem = "";
          let valueItem = String(item[valueField]);

          let contentRow = nameField.map((field, index) => {
            nameItem = nameItem + item[field] + " ";

            return (
              <Col key={uuidv4()} className="content" xs={widthCol[index]}>
                <Tooltip key={uuidv4()}>{item[field]}</Tooltip>
              </Col>
            );
          });

          children.push(
            <Option key={keyItem} value={valueItem} label={nameItem} item={item}>
              <div key={uuidv4()} className="custom-options">
                <Row key={uuidv4()}>{contentRow}</Row>
              </div>
            </Option>
          );
        });
      }

      return children;
    };

export const renderTreeOptions =
  (valueField, nameField, childField) => (data) => {
    let tree = [];

    //const

    if (data?.length > 0) {
      const genElement = (tree) => {
        if (tree) {
          return tree.map((item) => {
            let name = item[valueField] +' - '+ item[nameField];
            let value = item[valueField];
            let key = item[valueField]; //uuidv4();

            let data = { ...item };
            delete data[childField];

            return (
              <TreeNode
                value={value}
                item={data}
                title={<Tooltip key={uuidv4()}>{name}</Tooltip>}
                key={key}
              >
                {genElement(item[childField])}
              </TreeNode>
            );
          });
        }
      };

      tree = genElement(data);
    }

    return tree;
  };

  export const renderSingleTreeOptions =
  (valueField, nameField, childField) => (data) => {
    let tree = [];

    //const

    if (data?.length > 0) {
      const genElement = (tree) => {
        if (tree) {
          return tree.map((item) => {
            let name = item[nameField];
            let value = item[valueField];
            let key = item[valueField]; //uuidv4();

            let data = { ...item };
            delete data[childField];

            return (
              <TreeNode
                value={value}
                item={data}
                title={<Tooltip key={uuidv4()}>{name}</Tooltip>}
                key={key}
              >
                {genElement(item[childField])}
              </TreeNode>
            );
          });
        }
      };
      tree = genElement(data);
    }
    return tree;
  };


export const filterTree = (element, matchingTitle) => {
    let node,ii, stack1 =[] ;
    stack1 = stack1.concat(element);
    while (element.length > 0) {
        node = stack1.pop();
        if (node.depId.toString() === matchingTitle.toString()) {
            // Found it!
            return node;
        } else if (node.children && node.children.length) {
            for (ii = 0; ii < node.children.length; ii += 1) {
                stack1.push(node.children[ii]);
            }
        }
    }
    return null;
};
