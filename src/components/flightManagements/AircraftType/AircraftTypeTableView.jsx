import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../commonComponents'

// import actions
import { updateAircraftTypeStatus, getAircraftTypeSearchList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'

const TableView = () => {
    // get aircraft type state values from redux
    const { isLoading, aircraftTypeList, pagination } = useSelector(state => state.aircrafttype)

    const columns = [
        {
            title: 'Aircraft Type',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ updateAircraftTypeStatus } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={getAircraftTypeSearchList}/>
            <TableBlock 
                action={getAircraftTypeSearchList}
                columns={columns}
                dataList={aircraftTypeList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TableView