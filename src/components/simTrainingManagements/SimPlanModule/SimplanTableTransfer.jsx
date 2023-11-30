import { Table, Transfer } from 'antd';
import difference from 'lodash/difference';

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection = {
        getCheckboxProps: (item) => ({
          disabled: listDisabled || item.disabled,
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{
            pointerEvents: listDisabled ? 'none' : undefined,
          }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
          pageSizeOptions
        />
      );
    }}
  </Transfer>
);

const leftTableColumns = [ 
    {
        title: 'Flight Crews',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        render: item => <span className={'float-left text-left'}> { item } </span>
    },
    {
        title: <div>
            <span className={'text-green-400 mr-1'}>LPC</span>
            <span className={'text-blue-400'}>OPC</span>
        </div>,
        dataIndex: 'lastLpcOpc',
        key: 'lastLpcOpc.lpcDate',
        width: 90,
        render: (item) => (item?.lpcDate || item?.opcDate) ? <div>
            <div className={'bg-green-400 rounded-sm text-white'}> {item?.lpcDate} </div>
            <div className={'bg-blue-400 rounded-sm text-white'}> {item?.opcDate} </div>
        </div> : 'N/A'
    },
    {
        title: 'LPC Validity',
        dataIndex: 'lastLpcOpc',
        key: 'lastLpcOpc.lpcValidity',
        render: (item) => item?.lpcValidityStartDate ? <div>
            <div> {item?.lpcValidityStartDate} </div>
            <div> To </div>
            <div> {item?.lpcValidityEndDate} </div>
        </div> : 'N/A'
    },
    {
        title: 'Eligible Simulation',
        dataIndex: 'nextSimulationDate',
        key: 'nextSimulationDate',
        width: 90,
    },
    {
        title: 'Next LPC',
        dataIndex: 'lastLpcOpc',
        key: 'lastLpcOpc.nextLpcDate',
        render: (item) => item?.nextLpcStartDate ? <div>
            <div> {item?.nextLpcStartDate} </div>
            <div> To </div>
            <div> {item?.nextLpcEndDate} </div>
        </div> : 'N/A'
    },
]
const rightTableColumns = [
    {
        title: 'Flight Crews',
        dataIndex: 'name',
        key: 'name',
        width: 150,
    },
    {
        title: 'Eligible Simulation',
        dataIndex: 'nextSimulationDate',
        key: 'nextSimulationDate',
        width: 90,
    },
];

// Simplan Table Transfer components
const SimplanTableTransfer = ({ dataSource, setTargetKeys, targetKeys }) => {

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  return (
    <div className={'my-5'}>
        <TableTransfer
            dataSource={dataSource}
            targetKeys={targetKeys}
            showSearch={true}
            onChange={onChange}
            filterOption={(inputValue, item) =>
                item?.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
            titles={['Eligible Employees List', 'Selected Employees']} 
        />
    </div>
  );
};
export default SimplanTableTransfer;