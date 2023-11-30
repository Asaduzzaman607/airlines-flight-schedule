import { useSelector } from 'react-redux'

// import components
import { ScrollTableBlock, SearchBlock, TableAction } from '../../commonComponents'
import { IconHandler, TimeIconComponent } from '../../commonComponents/CommonItems'

// import actions
import { deleteAirport, getAirportSearchList } from '../../../services/actions/FlightManagementActions/airportAction'

const TableView = () => {
    // get airport state values from redux
    const { isLoading, airportList, pagination } = useSelector(state => state.airport)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Airport Name',
            value: 'name'
        },
        {
            id: 1,
            label: 'IATA Code',
            value: 'code'
        },
        {
            id: 2,
            label: 'ICAO Code',
            value: 'icaoCode'
        },
    ]

    const columns = [
        {
            title: 'Airport Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 200,
            render: (item) => <IconHandler item={item} />
        },
        {
            title: 'IATA Code',
            dataIndex: 'code',
            key: 'code',
            fixed: 'left',
            width: 100,
        },
        {
            title: 'ICAO',
            dataIndex: 'icaoCode',
            key: 'icaoCode',
        },
        {
            title: 'Latitude',
            dataIndex: 'latitude',
            key: 'latitude',
        },
        {
            title: 'Longitude',
            dataIndex: 'longitude',
            key: 'longitude',
        },
        {
            title: 'Layover',
            dataIndex: 'isLayover',
            key: 'isLayover',
            render: (item) => <span> { item ? 'YES' : 'NO' } </span>
        },
        {
            title: 'Layover Hours',
            dataIndex: 'layoverHours',
            key: 'layoverHours',
            render: (item) => <TimeIconComponent item={item}/>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (item) => <span className={'float-left text-left'}>{item}</span>
        },
        {
            title: 'Actions',
            key: 'action',
            fixed: 'right',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteAirport } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getAirportSearchList } searchableColumnLists={ searchableColumnLists }/>
            <ScrollTableBlock 
                action={getAirportSearchList}
                columns={columns}
                dataList={airportList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TableView