import { useSelector } from 'react-redux'

// import actions
import { getFlightGroupList, updateFlightGroupStatus, getFlightGroupSearchList } from '../../../services/actions/FlightManagementActions/flightGroupAction'

// import components
import SearchBlock from '../../commonComponents/SearchBlock'
import TableBlock from '../../commonComponents/TableBlock'
import TableAction from '../../commonComponents/TableAction'

const TableView = () => {
    // get aircraft state values from redux
    const { isLoading, flightGroupList, pagination } = useSelector(state => state.flightgroup)
    
    const columns = [
        {
            title: 'Flight Group Name',
            dataIndex: 'name',
            key: 'name',
            // render: (text) => <p className={ 'text-blue-500' }>{text}</p>,
        },
        {
            title: 'Flight Group Description',
            dataIndex: 'description',
            key: 'description',
            // render: (text) => <p className={ 'text-blue-500' }>{text}</p>,
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ updateFlightGroupStatus } pagination={ pagination } />
        },
    ]
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getFlightGroupSearchList }/>
            <TableBlock 
                action={getFlightGroupList}
                columns={columns}
                dataList={flightGroupList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}




export default TableView