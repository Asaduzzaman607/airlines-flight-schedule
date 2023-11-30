import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../../commonComponents'
import { IconHandler } from '../../../commonComponents/CommonItems'

// import icons
import { FaPlaceOfWorship } from 'react-icons/fa'

// import redux actions
import { deleteArea, getAreaSearchList } from '../../../../services/actions/CrewManagementActions/areaAction'

const AreaTableView = () => {
    // get Area state values from redux
    const { isLoading, areaList, pagination } = useSelector(state => state.area)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Area Name',
            value: 'name'
        },
        {
            id: 1,
            label: 'Area Code',
            value: 'areaCode'
        }
    ]

    const columns = [
        {
            title: 'Area Name',
            dataIndex: 'name',
            key: 'name',
            render: (item) => <IconHandler item={item} ICON={FaPlaceOfWorship}/>
        },
        {
            title: 'Area Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteArea } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getAreaSearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getAreaSearchList}
                columns={columns}
                dataList={areaList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}




export default AreaTableView