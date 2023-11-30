import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

// import components
import { Table, Space, Button } from 'antd'

// import icons
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

// import actions
import { getFlightLocationList, updateFlightLocationStatus } from '../../../services/actions/FlightManagementActions/flightLocationAction'
import { ShowDeleteAlert } from '../../../services/actions/commonActions'

const TableView = () => {
    // get aircraft state values from redux
    const { isLoading, flightLocationList } = useSelector(state => state.flightlocation)

    // initialize dispatch func.
    const dispatch = useDispatch()

    // get aircraftTypeList initially.
    useEffect(() => { 
        dispatch(getFlightLocationList()) 
    },[])

    const columns = [
        {
            title: 'Flight Location Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <p className={ 'text-blue-500' }>{text}</p>,
        },
        {
            title: 'Flight Location Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <p className={ 'text-blue-500' }>{text}</p>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size={ 'middle' }>
                    <Link to={`update/${record.id}`}>
                        <Button 
                            type={ 'primary' }
                            icon={ <EditOutlined /> }
                        />
                    </Link>
                    <Button 
                        type={ 'primary' }
                        icon={ <DeleteOutlined /> }
                        danger
                        onClick={ () => ShowDeleteAlert(updateFlightLocationStatus, record.id, dispatch) }
                    />
                </Space>
            ),
        },
    ]
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <Table
                columns={ columns }
                dataSource={ flightLocationList }
                bordered
                size={ 'small' }
                loading={ isLoading }
            />
        </div>
    )
}




export default TableView