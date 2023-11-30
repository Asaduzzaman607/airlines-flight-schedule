import { useSelector } from 'react-redux'
// import actions 
import { deleteDriverData, getDriverSearchList } from '../../../services/actions/VehicleManagementActions/driverAction'

// import components
import { SearchBlock, TableBlock, TableAction } from '../../commonComponents'


const DriverTableView = () => {
    // get Driver state values from redux
    const { isLoading, driverList, pagination } = useSelector(state => state.driver)
    
    const columns = [
        {
            title: 'Driver Name',
            dataIndex: "name",
            key: "name",
            width: 140
        },
        {
            title: 'Phone No',
            dataIndex: 'phone',
            key: 'phone',
            width: 140
        },
        {
            title: 'Driving Licence Number',
            dataIndex: 'drivingLicenceNumber',
            key: 'drivingLicenceNumber',
            width: 140
        },
        {
            title: 'Present Address',
            dataIndex: 'presentAddressFull',
            key: 'presentAddressFull',
            width: 140
        },
        {
            title: 'Permanent Address',
            dataIndex: 'permanentAddressFull',
            key: 'permanentAddressFull',
            width: 140
        },
        {
            title: 'Actions',
            key: 'action',
            width: 140,
            render: (record) => <TableAction rowInfo={record} deleteAction={deleteDriverData} pagination={pagination} />
        },
    ]
 
    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Name',
            value: 'name'
        },
        {
            id: 1,
            label: 'Phone',
            value: 'phone'
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={getDriverSearchList} searchableColumnLists={searchableColumnLists} />
            <TableBlock
                action={getDriverSearchList}
                columns={columns}
                dataList={driverList}
                pagination={pagination}
                isLoading={isLoading}
                rowKey="id"
                rowClassName={(record) => (!record.checked ? 'inactive-row' : '')}
            />
        </div>
    )
}

export default DriverTableView