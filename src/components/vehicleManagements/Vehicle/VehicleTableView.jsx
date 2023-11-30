import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

// import components
import { SearchBlock, TableBlock, TableAction } from '../../commonComponents'

// import actions
import { deleteVehicleData, getVehicleSearchList } from '../../../services/actions/VehicleManagementActions/vehicleAction'

const VehicleTableView = () => {
    // get Vehicle state values from redux
    const { isLoading, vehicleList, pagination, typeList } = useSelector(state => state.vehicle)
    
    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Name',
            value: 'name'
        },
        {
            id: 1,
            label: 'Model',
            value: 'model'
        },
        {
            id: 2,
            label: 'License Plate',
            value: 'licensePlate'
        },
        {
            id: 3,
            label: 'Type',
            value: 'type'
        },
    ]

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model'
        },
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color'
        },
        {
            title: 'License Plate',
            dataIndex: 'licensePlate',
            key: 'licensePlate'
        },
        {
            title: 'Seat Capacity',
            dataIndex: 'capacity',
            key: 'capacity'
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor'
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteVehicleData } pagination={ pagination } />
        },
    ]
    
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getVehicleSearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={ getVehicleSearchList }
                columns={columns}
                dataList={vehicleList}
                pagination={pagination} 
                isLoading={isLoading} 
                type={typeList}
            />
        </div>
    )
}




export default VehicleTableView