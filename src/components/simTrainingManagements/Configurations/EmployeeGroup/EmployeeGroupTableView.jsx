import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../../commonComponents'
import { MultipleEmployeeView, SingleItemView } from '../../../commonComponents/CommonItems'

// import icon
import { TeamOutlined, UserOutlined } from '@ant-design/icons'

// import redux actions
import { getEmployeeGroupSearchList, deleteEmployeeGroup } from '../../../../services/actions/SimTrainingManagementActions/employeeGroupAction'

const EmployeeGroupTableView = () => {
    // get EmployeeGroup state values from redux
    const { isLoading, employeeGroupList, pagination } = useSelector(state => state.employeeGroup)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Group Name',
            value: 'name'
        },
    ]

    const columns = [
        {
            title: 'Group Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <SingleItemView item={text} Icon={TeamOutlined} size={25} />
        },
        {
            title: 'Employees',
            dataIndex: 'employees',
            key: 'employees',
            render: (text) => <MultipleEmployeeView items={text} Icon={UserOutlined} size={25}/>
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteEmployeeGroup } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getEmployeeGroupSearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getEmployeeGroupSearchList}
                columns={columns}
                dataList={employeeGroupList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default EmployeeGroupTableView