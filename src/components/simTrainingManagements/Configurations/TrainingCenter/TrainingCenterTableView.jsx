import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Timeline } from 'antd'

// import components
import { ScrollTableBlock, SearchBlock, TableAction } from '../../../commonComponents'

// import redux actions
import { getTrainingCenterSearchList, deleteTrainingCenter } from '../../../../services/actions/SimTrainingManagementActions/trainingCenterAction'
import { getAircraftTypeList } from '../../../../services/actions/FlightManagementActions/aircraftTypeAction'

// import page size
import { PAGE_SIZE } from '../../../../config'

const TrainingCenterTableView = () => {
    // get training Center state values from redux
    const { isLoading, trainingCenterList, pagination } = useSelector(state => state.trainingCenter)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)

    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch this action for aircraft list.
        dispatch(getAircraftTypeList(PAGE_SIZE))
    }, [])

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Training Center Name',
            value: 'name'
        },
        {
            id: 1,
            label: 'Aircraft Types',
            value: 'aircraftType'
        },
    ]

    const childrenHeaderHandler = (text, dataIndex) => {
         return (
            <span className={'text-left'}>
                { text && text?.length ? 
                    <Timeline 
                        items={text.map(item => ({children: item[dataIndex]}))}
                    />
                : ''}
            </span>
        )
    }

    const columns = [
        {
            title: 'Training Center',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 230,
            render: (text) => <span className={'float-left text-left'}>{text}</span>
        },
        {
            title: 'Aircraft Types',
            dataIndex: 'aircraftTypesNames',
            key: 'aircraftTypesNames',
            width: 120,
            render: (text) => <span> { text?.join(', ') } </span>
        },
        {
            title: 'Country',
            dataIndex: 'countryName',
            key: 'countryName',
            width: 120,
        },
        {
            title: 'City',
            dataIndex: 'cityName',
            key: 'cityName',
            width: 120,
        },
        {
            title: 'ATO Certificate No',
            dataIndex: 'atoCertificateNo',
            key: 'atoCertificateNo',
            width: 120,
        },
        {
            title: 'ATO Certificate Validity',
            dataIndex: 'atoCertificateValidity',
            key: 'atoCertificateValidity',
            width: 120,
        },
        {
            title: 'CAAB Validity',
            dataIndex: 'caabValidity',
            key: 'caabValidity',
            width: 130,
        },
        {
            title: 'File',
            dataIndex: 'documentPath',
            key: 'documentPath',
            width: 150,
            render: (item, items) => <a target={'_blank'} href={item}> {items?.documentName} </a>
        },
        {
            title: 'Certificates',
            children: [
                {
                    title: 'Certificate No.',
                    dataIndex: 'certificates',
                    key: 'certificates',
                    width: 150,
                    render: (text) => (
                        childrenHeaderHandler(text, 'certificateNo')
                    )
                },
                {
                    title: 'Certificate Validity',
                    dataIndex: 'certificates',
                    key: 'certificates',
                    width: 150,
                    render: (text) => (
                        childrenHeaderHandler(text, 'certificateValidity')
                    )
                },
                {
                    title: 'Document Name',
                    dataIndex: 'certificates',
                    key: 'certificates',
                    width: 150,
                    render: (text) => (
                        childrenHeaderHandler(text, 'documentName')
                    )
                },
                {
                    title: 'File',
                    dataIndex: 'certificates',
                    key: 'certificates',
                    width: 170,
                    render: (item) => (
                        <span className={'text-left'}>
                            { item && item?.length ? 
                                item.map((value, index) => 
                                    <p key={value.id} style={{borderBottom: `${value?.length > 1 ? '2px solid green' : ''}`}}>
                                         { value?.documentPath && <a target={'_blank'} href={value?.documentPath}> {index + 1 + '.'} { value?.documentName } </a> }
                                    </p> 
                                ) : ''
                            }
                        </span>
                    )
                },
                {
                    title: 'Qualification Level',
                    dataIndex: 'certificates',
                    key: 'certificates',
                    width: 150,
                    render: (text) => (
                        childrenHeaderHandler(text, 'qualificationLevel')
                    )
                },
                {
                    title: 'Serial No',
                    dataIndex: 'certificates',
                    key: 'certificates',
                    width: 150,
                    render: (text) => (
                        childrenHeaderHandler(text, 'serialNo')
                    )
                },
            ],
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: 120,
        },
        {
            title: 'Actions',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteTrainingCenter } pagination={ pagination } />
        },
    ]

    const items = {
        aircraftType:aircraftTypeList  
    }
    
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getTrainingCenterSearchList } searchableColumnLists={ searchableColumnLists }  items={items}/>
            <ScrollTableBlock
                action={getTrainingCenterSearchList}
                columns={columns}
                dataList={trainingCenterList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TrainingCenterTableView