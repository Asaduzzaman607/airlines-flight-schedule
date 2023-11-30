import { useSelector } from 'react-redux'

// import Components
import { SearchBlock, TableAction, ScrollTableBlock, SingleItemView } from '../../commonComponents'

// import actions
import { deleteRecencyAssign, getRecencyAssignSearchList } from '../../../services/actions/RecencyManagementActions/recencyAssignAction'

const TableView = () => {
    // get Recency state values from redux
    const { isLoading, recency_assignList, pagination } = useSelector(state => state.recencyassign)

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            key: 'employeeName',
            fixed: 'left',
            width: 220,
            render: (text) => <SingleItemView item={text}/>
        },
        {
            title: 'Recency Name',
            dataIndex: 'crewRecencyName',
            key: 'crewRecencyName',
            width: 200,
            render: (text) => <span className={'float-left text-left'}> { text } </span>
        },
        {
            title: 'Start Course Date',
            dataIndex: 'fromDateTime',
            key: 'fromDateTime',
        },
        {
            title: 'End Course Date',
            dataIndex: 'toDateTime',
            key: 'toDateTime',
        },
        {
            title: 'Valid From',
            dataIndex: 'validFrom',
            key: 'validFrom',
            render: (text) => <span className=''>{text ? text : '---------'}</span>,
        },
        {
            title: 'Valid Till',
            dataIndex: 'validTill',
            key: 'validTill',
            render: (text) => <span >{text ? text : '---------'}</span>,
        },
        {
            title: 'Leg',
            dataIndex: 'leg',
            key: 'leg',
            render: (text) => <span >{text ? text : '---------'}</span>,
        },
        {
            title: 'Completed',
            dataIndex: 'isDone',
            key: 'isDone',
            render: (text) => <span >{ text ? 'YES' : 'NO' }</span>,
        },
        {
            title: 'Actions',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteRecencyAssign } pagination={ pagination } />
        },
    ]

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Employee Name',
            value: 'employeeName'
        },
        {
            id: 1,
            label: 'Recency Name',
            value: 'recencyName'
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getRecencyAssignSearchList } searchableColumnLists={ searchableColumnLists }/>
            <ScrollTableBlock 
                action={getRecencyAssignSearchList}
                columns={columns}
                dataList={recency_assignList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TableView