import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { SearchBlock, ScrollTableBlock, TableAction } from '../../commonComponents'
import { SetTableDataAlign } from '../../commonComponents/CommonItems'
import { Image } from 'antd'

// import image
import defaultImage from '../../../assets/images/default_pilot.jpg'

// import actions
import { deleteEmployee, getCockpitCrewSearchList, getContactTypeList } from '../../../services/actions/CrewManagementActions/employeeAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'

// import config
import { PAGE_SIZE } from '../../../config'

const TableView = () => {
    // get employee state values from redux
    const { isLoading, employeeList, contactTypeList, pagination } = useSelector(state => state.employee)
    const { aircraftTypePermission } = useSelector(state => state.auth)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)

    const dispatch = useDispatch()

    // table columns fields
    const columns = [
        {
            title: 'ID No.',
            dataIndex: 'code',
            key: 'code',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Name & Position',
            width: 180,
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            render: text => <SetTableDataAlign text={text} />
        },
        {
            title: 'Employee Type',
            width: 120,
            dataIndex: 'employeeType',
            key: 'employeeType',
        },
        {
            title: 'Contract Type',
            width: 120,
            dataIndex: 'contractType',
            key: 'contractType',
        },
        {
            title: 'Profile Picture',
            width: 120,
            dataIndex: 'profileUrl',
            key: 'profileUrl',
            render: (item) => (
                <Image
                    width={70}
                    height={70}
                    preview={(!item || item === 'N/A') ? false : true}
                    src={(!item || item === 'N/A') ? defaultImage : item}
                />
            )
        },
        {
            title: 'Contract Date',
            dataIndex: 'contractDate',
            key: 'contractDate',
            width: 150,
            render: (item) => item?.startDate ? <div>
                <div> {item?.startDate} </div>
                <div> To </div>
                <div> {item?.endDate} </div>
            </div> : 'N/A'
        },
        {
            title: 'Aircraft Type',
            dataIndex: 'aircraftTypesNames',
            key: 'aircraftTypesNames',
            width: 150,
            render: (item) => <span> { item?.join(', ') } </span>
        },
        {
            title: 'Licence',
            dataIndex: 'licenceTypeWithNumber',
            key: 'licenceTypeWithNumber',
            width: 150,
        },
        {
            title: 'Address Remarks',
            dataIndex: 'addressRemarks',
            key: 'addressRemarks',
            width: 200,
            render: text => <SetTableDataAlign text={text} />
        },
        {
            title: 'Email',
            width: 150,
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Date of Contract',
            dataIndex: 'contractDate',
            key: 'contractDate',
            width: 150,
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 150,
        },
        {
            title: 'Emergency Contact Name',
            dataIndex: 'emergencyContactName',
            key: 'emergencyContactName',
            width: 150,
            render: text => <SetTableDataAlign text={text} />
        },
        {
            title: 'Emergency Contact Number',
            dataIndex: 'emergencyContactNumber',
            key: 'emergencyContactNumber',
            width: 150,
        },
        {
            title: 'PostCode',
            dataIndex: 'postCode',
            key: 'postCode',
            width: 150,
        },
        {
            title: 'Joining Date',
            dataIndex: 'joiningDate',
            key: 'joiningDate',
            width: 150,
        },
        {
            title: 'Crew Type',
            dataIndex: 'crewType',
            key: 'crewType',
            width: 150
        },
        {
            title: 'Cabin Crew Type',
            dataIndex: 'cabinCrewType',
            key: 'cabinCrewType',
            width: 150
        },
        {
            title: 'Cockpit Crew Type',
            dataIndex: 'cockpitCrewType',
            key: 'cockpitCrewType',
            width: 150
        },
        {
            title: 'Serial Rank',
            dataIndex: 'serialRank',
            key: 'serialRank',
            width: 150
        },
        {
            title: 'Passport Number',
            dataIndex: 'passportNumber',
            key: 'passportNumber',
            width: 150
        },
        {
            title: 'Passport Expiry Date',
            dataIndex: 'passportExpiryDate',
            key: 'passportExpiryDate',
            width: 150
        },
        {
            title: 'Foreign',
            dataIndex: 'isForeign',
            key: 'isForeign',
            width: 150,
            render: (text) => <p className={ 'text-blue-500' }>{ text ? 'YES' : 'NO'}</p>,
        },
        {
            title: 'Actions',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteEmployee } pagination={ pagination } />
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
            id: 1,
            label: 'Email',
            value: 'email'
        },
        {
            id: 2,
            label: 'Mobile',
            value: 'mobile'
        },
        {
            id: 3,
            label: 'ID No.',
            value: 'code'
        },
        {
            id: 4,
            label: 'Aircraft Type',
            value: 'aircraftTypeName'
        },
        {
            id: 5,
            label: 'Contract Type',
            value: 'contractType'
        },
    ]

    // Structure type list items for search
    const items = {
        aircraftTypeName: aircraftTypeList,
        contractType: contactTypeList
    }

    useEffect(() => {
        dispatch(getAircraftTypeList(PAGE_SIZE))
        dispatch(getContactTypeList(PAGE_SIZE))
    }, [])

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock 
                action={ getCockpitCrewSearchList } 
                searchableColumnLists={ searchableColumnLists } 
                aircraftTypePermission={ aircraftTypePermission }
                items={ items }
            />
            <ScrollTableBlock 
                action={getCockpitCrewSearchList}
                columns={columns}
                dataList={employeeList}
                pagination={pagination} 
                isLoading={isLoading} 
                aircraftTypePermission={ aircraftTypePermission }
            />
        </div>
    )
}
export default TableView