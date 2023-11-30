import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

// import components
import { SearchBlock, TableAction, ScrollTableBlock, GroupTableHeader, SingleItemView } from '../../commonComponents'
import { Tag } from 'antd'

// import actions
import { deleteValidation, getValidationSearchList } from '../../../services/actions/SimTrainingManagementActions/validationAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'

// import page size
import { PAGE_SIZE } from '../../../config'

const TableView = () => {
    // get validation state values from redux
    const { isLoading, validationList, pagination } = useSelector(state => state.validation);
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
  
    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch this action for aircraft list.
        dispatch(getAircraftTypeList(PAGE_SIZE))
    }, [])

    const columns = [
        {
            title: 'Name of Pilots',
            dataIndex: 'employeeName',
            key: 'employeeName',
            fixed: 'left',
            width: 190,
            render: (text) => <SingleItemView item={text}/>
        },
        {
            title: 'Fleet',
            dataIndex: 'fleetsName',
            key: 'fleetsName',
            width: 140,
            render: text => text ?? 'N/A'
        },
        {
            title: 'Licence No',
            dataIndex: 'licenceNo',
            key: 'licenceNo',
            width: 150,
            render: text => text ?? 'N/A'
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            width: 120,
            render: text => text ?? 'N/A'
        },
        {
            title:  <GroupTableHeader title="Authentication & NOC Letter Info"/>,
                          
            children: [
                {
                    title: 'Action Type',
                    dataIndex: 'authNocLetterActionType',
                    key: 'authNocLetterActionType',
                    width: 160,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Action Date',
                    dataIndex: 'authNocLetterActionDate',
                    key: 'authNocLetterActionDate',
                    width: 160,
                    render: text => text ?? 'N/A'
                },
            ]

        },

        {
            title:  <GroupTableHeader title="NOC Info"/>,
                           
            children: [
                {
                    title: 'Action Type',
                    dataIndex: 'nocActionType',
                    key: 'nocActionType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Issue Date',
                    dataIndex: 'nocIssueDate',
                    key: 'nocIssueDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
            ]

        },
        {
            title:   <GroupTableHeader title="Medical Letter Info"/>,
                            
            children: [
                {
                    title: 'Action Type',
                    dataIndex: 'medicalLetterActionType',
                    key: 'medicalLetterActionType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Action Date',
                    dataIndex: 'medicalLetterActionDate',
                    key: 'medicalLetterActionDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
            ]
        },

        {
            title:  <GroupTableHeader title="Oral Letter Info"/>,
                          
            children: [
                {
                    title: 'Action Type',
                    dataIndex: 'oralLetterActionType',
                    key: 'oralLetterActionType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Action Date',
                    dataIndex: 'oralLetterActionDate',
                    key: 'oralLetterActionDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
            ]
        },
        {
            title: 'Air Law',
            dataIndex: 'airLawResultType',
            key: 'airLawResultType',
            width: 120,
            render: text => text ?? 'N/A'
        },
        {
            title: 'Air Law Date',
            dataIndex: 'airLawResultDate',
            key: 'airLawResultDate',
            width: 120,
            render: text => text ?? 'N/A'
        },
        {
            title: 'Oral Test',
            dataIndex: 'oralResultType',
            key: 'oralResultType',
            width: 110,
            render: text => text ?? 'N/A'
        },
        {
            title: 'Oral Test Date',
            dataIndex: 'oralResultDate',
            key: 'oralResultDate',
            width: 120,
            render: text => text ?? 'N/A'
        },
        {
            title: '90 Days Currency Valid',
            dataIndex: 'ninetyDaysCurrencyValid',
            key: 'ninetyDaysCurrencyValid',
            width: 120,
            render: (text) => (
                <Tag style={{ color: text === 'YES' ? 'green' : 'red' }}><b>{text}</b></Tag>
              ),
        },
        {
            title:   <GroupTableHeader title="Medical Validity Date Info"/>,
                            
            children: [
                {
                    title: 'Licence',
                    dataIndex: 'licenceMedicalValidDate',
                    key: 'licenceMedicalValidDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },

                {
                    title: 'Bangladeshi',
                    dataIndex: 'bdMedicalValidDate',
                    key: 'bdMedicalValidDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
            ]
        },
        {
            title:  <GroupTableHeader title="Visa Info"/>,
                       
            children: [
                {
                    title: 'Expired Date',
                    dataIndex: 'visaExpiredDate',
                    key: 'visaExpiredDate',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'visaDaysLeft',
                    key: 'visaDaysLeft',
                    width: 120,
                    sorter: (a, b) => a.visaDaysLeft - b.visaDaysLeft,
                    render: text => <Tag>{text ?? 'N/A'}</Tag>
                },
            ]
        },
       
        {
            title:  <GroupTableHeader title="Work Permit Info"/>,
                      
            children: [
                {
                    title: 'Expired Date',
                    dataIndex: 'workPermitExpiredDate',
                    key: 'workPermitExpiredDate',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'workPermitDaysLeft',
                    key: 'workPermitDaysLeft',
                    width: 120,
                    sorter: (a, b) => a.visaDaysLeft - b.visaDaysLeft,
                    render: text => <Tag>{text ?? 'N/A'}</Tag>
                },
            ]
        },
        {
            title:  <GroupTableHeader title="Restricted Validation Info"/>,
               
            children: [
                {
                    title: 'Issue Date',
                    dataIndex: 'resValIssueDate',
                    key: 'resValIssueDate',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Issue From',
                    dataIndex: 'resValFromDate',
                    key: 'resValFromDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Issue To',
                    dataIndex: 'resValToDate',
                    key: 'resValToDate',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
            ]
        },
        {
            title:  <GroupTableHeader title="Full Validation Info"/>,
    
            children: [
                {
                    title: 'Issue Date',
                    dataIndex: 'fullValIssueDate',
                    key: 'fullValIssueDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Issue From',
                    dataIndex: 'fullValFromDate',
                    key: 'fullValFromDate',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Issue To',
                    dataIndex: 'fullValToDate',
                    key: 'fullValToDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
               
            ]
        },
        {
            title: 'Remaining Days of Validation',
            dataIndex: 'fullValDaysLeft',
            key: 'fullValDaysLeft',
            width: 110,
            render: text => <Tag>{text ?? 'N/A'}</Tag>
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: 150,
            render: text => text ?? 'N/A'
        },
        {
            title: 'Actions',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (record) => <TableAction rowInfo={record} deleteAction={deleteValidation} pagination={pagination} />
        },
    ]

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Name',
            value: 'name'
        },
        {
            id: 0,
            label: 'Fleets',
            value: 'aircraftType'
        }
    ]

    const items = {
        aircraftType:aircraftTypeList  
    }

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={getValidationSearchList} searchableColumnLists={searchableColumnLists} items={items}/>
            <ScrollTableBlock
                action={getValidationSearchList}
                columns={columns}
                dataList={validationList}
                pagination={pagination}
                isLoading={isLoading}
            />
        </div>
    )
}

export default TableView