import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../commonComponents'

// import actions
import { deleteRecencyData, getRecencySearchList } from '../../../services/actions/RecencyManagementActions/recencyAction'

const TableView = () => {
    // get Recency state values from redux
    const { isLoading, recencyList, pagination } = useSelector(state => state.recency)

    const columns = [
        {
            title: 'Recency Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <span className={'float-left text-left'}> { text } </span>
        },
        {
            title: 'Recency Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Aircraft Type',
            dataIndex: 'aircraftTypesNames',
            key: 'aircraftTypesNames',
            render: (item) => <p className={''}>{ item?.join(', ')}</p>,
        },
        {
            title: 'Validity',
            dataIndex: 'validityWithType',
            key: 'validityWithType',
            render: (item) => <span> { item } </span>,
        },
        {
            title: 'Mandatory',
            dataIndex: 'isMandatory',
            key: 'isMandatory',
            render: (text) => <span >{ text ? 'YES' : 'NO' }</span>,
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteRecencyData } pagination={ pagination } />
        },
    ]

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Recency Name',
            value: 'name'
        },
        {
            id: 1,
            label: 'Recency Code',
            value: 'code'
        },
    ]
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getRecencySearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getRecencySearchList}
                columns={columns}
                dataList={recencyList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}




export default TableView