import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock, SingleItemView } from '../../../commonComponents'

// import redux actions
import { getTrainerSearchList, deleteTrainer } from '../../../../services/actions/SimTrainingManagementActions/trainerAction'

const TrainerTableView = () => {
    // get SimModule state values from redux
    const { isLoading, trainerList, pagination } = useSelector(state => state.trainer)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Trainer',
            value: 'name'
        },
        {
            id: 1,
            label: 'Training Center Name',
            value: 'trainingCenterName'
        },
    ]

    const columns = [
        {
            title: 'Trainer',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <SingleItemView item={text}/>
        },
        {
            title: 'Training Center Name',
            dataIndex: 'trainingCenterName',
            key: 'trainingCenterName',
        },
        {
            title: 'Country',
            dataIndex: 'countryName',
            key: 'countryName',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            key: 'dob',
        },  
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'License No',
            dataIndex: 'licenseNo',
            key: 'licenseNo',
        },
        {
            title: 'License Authorized By',
            dataIndex: 'licenseAuthorizedBy',
            key: 'licenseAuthorizedBy',
        },
        {
            title: 'License Expired Date',
            dataIndex: 'licenseExpiredDate',
            key: 'licenseExpiredDate',
        },
        {
            title: 'CAAB Validity',
            dataIndex: 'caabValidity',
            key: 'caabValidity',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteTrainer } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getTrainerSearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getTrainerSearchList}
                columns={columns}
                dataList={trainerList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TrainerTableView