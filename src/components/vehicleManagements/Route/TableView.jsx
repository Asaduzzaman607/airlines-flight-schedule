import { useSelector } from 'react-redux'

// import actions
import { getRouteList, deleteRouteData, getRouteSearchList } from '../../../services/actions/VehicleManagementActions/routeAction'

// import components
import SearchBlock from '../../commonComponents/SearchBlock'
import TableBlock from '../../commonComponents/TableBlock'
import TableAction from '../../commonComponents/TableAction'

const TableView = () => {
    // get Route state values from redux
    const { isLoading, routeList, pagination } = useSelector(state => state.route)

    const columns = [
        {
            title: 'Route Name',
            dataIndex: 'name',
            key: 'name',
            // render: (text) => <p >{text}</p>,
        },
        {
            title: 'Estimated Time',
            dataIndex: 'estimatedTime',
            key: 'estimatedTime',
            render: (text) => <span >{text + ' Minutes'}</span>,
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteRouteData } pagination={ pagination } />
        },
    ]
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getRouteSearchList }/>
            <TableBlock 
                action={getRouteList}
                columns={columns}
                dataList={routeList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TableView