import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

// import components
import { SearchBlock, TableAction, ScrollTableBlock, GroupTableHeader, ValueTag, SingleItemView } from '../../commonComponents'

// import actions
import { deleteLicence, getLicenceSearchList } from '../../../services/actions/SimTrainingManagementActions/licenceAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'

// import page size
import { PAGE_SIZE } from '../../../config'

const LicenceTableView = () => {
    // get licence state values from redux
    const { isLoading, licenceList, pagination } = useSelector(state => state.licence);
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)

    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch this action for aircraft list.
        dispatch(getAircraftTypeList(PAGE_SIZE))
    }, [])

    const columns = [
        {
            title: 'ID No',
            dataIndex: 'idNo',
            key: 'idNo',
            fixed: 'left',
            width: 120,
            render: text => text ?? 'N/A'
        },
        {
            title: 'Pilot Type',
            dataIndex: 'pilotType',
            key: 'pilotType',
            fixed: 'left',
            width: 100,
            render: text => text ?? 'N/A'
        },
        {
            title: 'Name of Pilots',
            dataIndex: 'employeeName',
            key: 'employeeName',
            fixed: 'left',
            width: 230,
            render: (text) => <SingleItemView item={text}/>
        },
        {
            title:  <GroupTableHeader title= "Employee Info" />,
            children: [
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
                    width: 140,
                    render: text => text ?? 'N/A'
                },
            ]

        },
        {
            title:  <GroupTableHeader title="Licence Info"/>,
            children: [
                {
                    title: 'Validity Type',
                    dataIndex: 'licenseType',
                    key: 'licenseType',
                    width: 130,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Expired Date',
                    dataIndex: 'licenseExpiryDate',
                    key: 'licenseExpiryDate',
                    width: 130,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'licenseDaysLeft',
                    key: 'licenseDaysLeft',
                    width: 100,
                    sorter: (a, b) => a.licenseDaysLeft - b.licenseDaysLeft,
                    render: text => <ValueTag value={text} />
                },
            ]
        },
        {
            title:  <GroupTableHeader title="CFTI Info"/>,
            children: [
                {
                    title: 'Validity Type',
                    dataIndex: 'cftiValidityType',
                    key: 'cftiValidityType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Expired Date',
                    dataIndex: 'cftiValidityExpiryDate',
                    key: 'cftiValidityExpiryDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'cftiValidityDaysLeft',
                    key: 'cftiValidityDaysLeft',
                    width: 100,
                    sorter: (a, b) => a.cftiValidityDaysLeft - b.cftiValidityDaysLeft,
                    render: text => <ValueTag value={text} />
                }
            ]

        },
        {
            title: <GroupTableHeader title="DCP Info"/>,
            children: [
                {
                    title: 'Type',
                    dataIndex: 'dcpCType',
                    key: 'dcpCType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Validity Type',
                    dataIndex: 'dcpCValidityType',
                    key: 'dcpCValidityType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Expired Date',
                    dataIndex: 'dcpCValidityExpiryDate',
                    key: 'dcpCValidityExpiryDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'dcpCValidityDaysLeft',
                    key: 'dcpCValidityDaysLeft',
                    width: 100,
                    sorter: (a, b) => a.dcpCValidityDaysLeft - b.dcpCValidityDaysLeft,
                    render: text => <ValueTag value={text} />
                },
            ]
        },
        {
            title:  <GroupTableHeader title="Medical Info"/>,
             
            children: [
                {
                    title: 'Validity Type',
                    dataIndex: 'medicalType',
                    key: 'medicalType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Expired Date',
                    dataIndex: 'medicalExpiryDate',
                    key: 'medicalExpiryDate',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'medicalDaysLeft',
                    key: 'medicalDaysLeft',
                    width: 100,
                    sorter: (a, b) => a.dcpCValidityDaysLeft - b.dcpCValidityDaysLeft,
                    render: text => <ValueTag value={text} />
                },
            ]
        },
        {
            title:  <GroupTableHeader title="ELP Info"/>,
            children: [
                {
                    title: 'Validity Type',
                    dataIndex: 'elpType',
                    key: 'elpType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Expiry Date',
                    dataIndex: 'elpExpiryDate',
                    key: 'elpExpiryDate',
                    width: 110,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'elpDaysLeft',
                    key: 'elpDaysLeft',
                    width: 100,
                    sorter: (a, b) => a.elpDaysLeft - b.elpDaysLeft,
                    render: text => <ValueTag value={text} />
                },
            ]
        },
        {
            title:   <GroupTableHeader title="I.R Info"/>,
            children: [
                {
                    title: 'Validity Type',
                    dataIndex: 'irType',
                    key: 'irType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Expired Date',
                    dataIndex: 'irExpiryDate',
                    key: 'irExpiryDate',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'irDaysLeft',
                    key: 'irDaysLeft',
                    width: 100,
                    sorter: (a, b) => a.irDaysLeft - b.irDaysLeft,
                    render: text => <ValueTag value={text} />
                },
            ]
        },
        {
            title: 'Last PPC Date',
            dataIndex: 'lastPpcDate',
            key: 'lastPpcDate',
            width: 110,
            render: text => text ?? 'N/A'
        },
        {
            title: 'CAAB Endorsment Type',
            dataIndex: 'lastPpcCaabEndorsmentType',
            key: 'lastPpcCaabEndorsmentType',
            width: 120,
            render: text => text ?? 'N/A'
        },
        {
            title:    <GroupTableHeader title="PPC Info"/>,
            children: [
                {
                    title: 'Validity Type',
                    dataIndex: 'ppcValidityType',
                    key: 'ppcValidityType',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Expiry Date',
                    dataIndex: 'ppcValidityExpiryDate',
                    key: 'ppcValidityExpiryDate',
                    width: 120,
                    render: text => text ?? 'N/A'
                },
                {
                    title: 'Days Left',
                    dataIndex: 'ppcValidityDaysLeft',
                    key: 'ppcValidityDaysLeft',
                    width: 100,
                    sorter: (a, b) => a.ppcValidityDaysLeft - b.ppcValidityDaysLeft,
                    render: text => <ValueTag value={text} />
                },
            ]  
        },

        {
            title: 'Actions',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (record) => <TableAction rowInfo={record} deleteAction={deleteLicence} pagination={pagination} />
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
            label: 'Fleets',
            value: 'aircraftType'
        }
    ]

    const items = {
        aircraftType:aircraftTypeList 
    }

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock 
                action={getLicenceSearchList} 
                searchableColumnLists={searchableColumnLists} 
                items={items}
            />
            <ScrollTableBlock
                action={getLicenceSearchList}
                columns={columns}
                dataList={licenceList}
                pagination={pagination}
                isLoading={isLoading}
            />
        </div>
    )
}

export default LicenceTableView