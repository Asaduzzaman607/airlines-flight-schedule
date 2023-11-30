import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import reducer
import { setSearchBlockValueToReducer } from '../../services/reducers/CrewManagementReducers/employeeLeaveReducer';

// import antd components
import { Table } from 'antd';

const ScrollTableBlock = ({ action, columns, dataList, pagination, isLoading , actionable = true}) => {

  // initialize dispatch func.
  const dispatch = useDispatch();

  // get stored_SearchBlock_Value value from store
  const { stored_SearchBlock_Value } = useSelector(state => state.employeeLeave);

  // get Data List initially.
  useEffect(() => {
    actionable && dispatch(action({ page: 0, pageSize: 10 }));
  }, []);


  // Handle Pagination
  const _handlePagination = (page, pageSize) => {

    let pageWithSize = {
      page: page - 1,
      pageSize,
      stored_SearchBlock_Value
    };
    dispatch(setSearchBlockValueToReducer({
      ...stored_SearchBlock_Value,
      page: page - 1,
      pageSize,
      name: 'shanto'
    }));
    //call backend with 'page' for current data
    actionable && dispatch(action(pageWithSize));
  };

  return (
    <div className='overflow-hidden'>
      <Table
        columns={columns}
        dataSource={dataList}
        loading={isLoading}
        bordered
        scroll={{
          y: 'calc(100vh - 299px)',
          x: 1500
        }}
        pagination={dataList?.length ? {
          size: 'small',
          onChange: (page, pageSize) => _handlePagination(page, pageSize),
          defaultPageSize: 10,
          current: pagination?.currentPage,
          total: pagination?.pageSize,
          position: ['bottomRight'],
          showSizeChanger: pagination?.pageSize > 10,
          pageSizeOptions: ['10', '20', '50', '100', '200']
        } : false}
      />
    </div>
  );
};

// // validate prop types
// ScrollTableBlock.propTypes = {
//     action: PropTypes.func,
//     columns: PropTypes.array.isRequired,
//     dataList: PropTypes.array.isRequired,
//     pagination: PropTypes.object,
//     isLoading: PropTypes.bool,
// }
//
// ScrollTableBlock.defaultProps = {
//     action: () => {},
//     isLoading: false,
//     dataList: [],
//     columns: []
// }


export default ScrollTableBlock;