import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../commonComponents'
import { IconHandler } from '../../commonComponents/CommonItems'

// import actions
import { deleteAirportPair, getAirportPairSearchList } from '../../../services/actions/FlightManagementActions/airportPairAction'

const TableView = () => {
    // get airportPair state values from redux
    const { isLoading, airportPairList, pagination } = useSelector(state => state.airportpair)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Start Airport Name',
            value: 'srcAirportName'
        },
        {
            id: 1,
            label: 'Leg Name',
            value: 'legName'
        },
        {
            id: 2,
            label: 'ICAO Code Leg',
            value: 'icaoCode'
        },
    ]

    const columns = [
        {
            title: 'Start Airport Name',
            dataIndex: 'fromAirportName',
            key: 'fromAirportName',
            render: (item) => <IconHandler item={item} />
        },
        {
            title: 'End Airport Name',
            dataIndex: 'toAirportName',
            key: 'toAirportName',
            render: (item) => <IconHandler item={item} />
        },
        {
            title: 'Aircraft Type',
            dataIndex: 'aircraftTypeName',
            key: 'aircraftTypeName',
        },
        {
            title: 'Leg',
            dataIndex: 'leg',
            key: 'leg',
        },
        {
            title: 'ICAO Code Leg',
            dataIndex: 'icaoCodeLeg',
            key: 'icaoCodeLeg',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteAirportPair } pagination={ pagination } />
        },
    ]
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getAirportPairSearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getAirportPairSearchList}
                columns={columns}
                dataList={airportPairList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TableView