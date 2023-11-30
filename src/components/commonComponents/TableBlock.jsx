import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import reducer
import { setSearchBlockValueToReducer } from '../../services/reducers/CrewManagementReducers/employeeLeaveReducer'

// import antd components
import { Table } from 'antd'

const TableBlock = ({ action, columns, dataList, pagination, isLoading }) => {
    // initialize dispatch func.
    const dispatch = useDispatch()

    // get stored_SearchBlock_Value value from store
    const { stored_SearchBlock_Value } = useSelector(state => state.employeeLeave)

    // get Data List initially.
    useEffect(() => {
        dispatch(action({ page: 0, pageSize: 10 }))
    },[])
    
    // Hanlde Pagination
    const _handlePagination = (page, pageSize) => {
        //call backend with 'page' for current data 
        let pageWithSize = {
            page: page - 1,
            pageSize,
            stored_SearchBlock_Value
        }
        dispatch(setSearchBlockValueToReducer({ 
            ...stored_SearchBlock_Value,
            page: page - 1,
            pageSize ,
            name: 'shanto'
        }))
        dispatch(action(pageWithSize))
    }

    return (
        <div className={'overflow-hidden'}>
            <Table
                columns={ columns }
                dataSource={ dataList }
                size={ 'small' }
                bordered
                loading={ isLoading }
                pagination={ dataList?.length ? {
                    onChange: (page, pageSize) =>  _handlePagination(page, pageSize),
                    defaultPageSize: 10,
                    current: pagination?.currentPage,
                    total: pagination?.pageSize,
                    position: ['bottomRight'], 
                    showSizeChanger: pagination?.pageSize > 10 ? true : false,
                    pageSizeOptions: ["10", "20", "50", "100", "200"],
                } : false}
                scroll={{
                    y: 'calc(100vh - 299px)'
                }}
            />
         </div>
    )
}


export default TableBlock