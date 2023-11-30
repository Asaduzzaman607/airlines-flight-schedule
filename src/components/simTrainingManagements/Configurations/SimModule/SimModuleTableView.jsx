import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../../commonComponents'

// import redux actions
import { getSimModuleSearchList, deleteSimModule } from '../../../../services/actions/SimTrainingManagementActions/simModuleAction'

const SimModuleTableView = () => {
    // get SimModule state values from redux
    const { isLoading, simModuleList, pagination } = useSelector(state => state.simModule)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Name',
            value: 'name'
        },
    ]

    const columns = [
        {
            title: 'SIM Module Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteSimModule } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getSimModuleSearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getSimModuleSearchList}
                columns={columns}
                dataList={simModuleList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default SimModuleTableView