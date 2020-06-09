import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Drawer, Button, Tree  } from 'antd';

const { DirectoryTree } = Tree;
const { TreeNode } = Tree;
import { DownOutlined } from '@ant-design/icons';

function mapStateToProps(state) {
  return {
    guidelineDrawer: state.user.guidelineDrawer,
  };
}
const handleClick = () => {}


const treeData = [
  {
    title: 'Names',
    key: 'names',
    children: [
      {
        title: 'Maximum of 40 characters.',
        key: '0-0-0',
        isLeaf: true,
      },
      {
        title: 'leaf 0-1',
        key: '0-0-1',
        isLeaf: true,
      },
    ],
  },
];
const EncodingGuidelines = (props) => {
  useEffect(() => {
    
  }, []);


  const onExpand = () => {
    console.log('Trigger Expand');
  };
  const onClose = () => {
    let status = props.guidelineDrawer;
    props.dispatch({
      type: "SHOW_GUIDELINES",
      data: false
    });
  }
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  return (
    <>
      <Drawer
        title="Encoding Guidelines"
        placement="left"
        closable={true}
        mask={false}
        width={480}
        onClose={onClose}
        visible={props.guidelineDrawer}
      >
        <Tree
        showLine
        showIcon={false}
        selectable={false}
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={['0-0']}
        onSelect={onSelect}
      >
        <TreeNode title="General Information Fields" key="0-0">
          <TreeNode title="Alphanumeric, Period, Dash and Slash are only allowed characters." key="0-1" />
          <TreeNode title="Type for dash(-) if none." key="0-2" />
        </TreeNode>
        <TreeNode title="'Pangalan' Fields" key="1-0">
          <TreeNode title="Maximum of 40 characters." key="1-1" />
          <TreeNode title="Alphabets, Period and Dash are only allowed characters." key="1-2" />
          <TreeNode title="'Apelyido' and 'Pangalan' is required." key="1-3" />
          <TreeNode title="Leave blank if none for 'Gitnang Pangalan' and 'Ext'." key="1-4" />
        </TreeNode>
        <TreeNode title="'Edad' Field" key="2-0">
          <TreeNode title="Must be 12 years old and above." key="2-1" />
        </TreeNode>
        <TreeNode title="'Buwanang Kita' Field" key="3-0">
          <TreeNode title="Type for 0 if none." key="3-1" />
        </TreeNode>
        <TreeNode title="'Cellphone No' Field" key="4-0">
          <TreeNode title="Type for dash(-) if none." key="4-1" />
          <TreeNode title="Must have 11 characters." key="4-2" />
          <TreeNode title="Must start with 09." key="4-3" />
        </TreeNode>
        <TreeNode title="'Pinagtratrabahuhan at Lugar' Field" key="5-0">
          <TreeNode title="Required if 'Trabaho' Field is stated." key="5-1" />
          <TreeNode title="Type for dash(-) if none." key="5-2" />
        </TreeNode>

        <TreeNode title="'Sektor' Field" key="6-0-0">
          <TreeNode title="A - Nakakatanda" key="6-1-0">
            <TreeNode title="Must be 60 years old and above." key="6-1-1" />
          </TreeNode>
          <TreeNode title="B - Buntis" key="6-2-0">
            <TreeNode title="Kasarian must be 'Babae'." key="6-2-1" />
            <TreeNode title="'Edad' must be 8 - 55 years old." key="6-2-2" />
          </TreeNode>
          <TreeNode title="C - Nagpapasusong ina" key="6-3-0">
            <TreeNode title="Kasarian must be 'Babae'." key="6-3-1" />
            <TreeNode title="'Edad' must be 8 - 55 years old." key="6-3-2" />
          </TreeNode>
        </TreeNode>

        <TreeNode title="Katutubo Name" key="7-0">
          <TreeNode title="Required if Katutubo is checked." key="7-1" />
        </TreeNode>
        <TreeNode title="Others Name" key="8-0">
          <TreeNode title="Required if Others is checked." key="8-1" />
        </TreeNode>


        <TreeNode title="Miyembro ng Pamilya" key="9-0-0">
          <TreeNode title="3 - Anak" key="9-1-0">
            <TreeNode title="Must be 8 years younger to the puno ng pamilya." key="9-1-1" />
          </TreeNode>
          <TreeNode title="6 - Apo" key="9-2-0">
            <TreeNode title="Must be 16 years younger to the puno ng pamilya." key="9-2-1" />
          </TreeNode>
          <TreeNode title="7 - Ama/Ina" key="9-3-0">
            <TreeNode title="Must be 8 years older to the puno ng pamilya." key="9-3-1" />
          </TreeNode>
        </TreeNode>

        <TreeNode title="'Petsa ng pagrehistro' Field" key="10-0">
          <TreeNode title="Must be on April, May or June 2020 only." key="10-1" />
        </TreeNode>

      </Tree>
      </Drawer>
    </>
  );
}



export default connect(
  mapStateToProps,
)(EncodingGuidelines);