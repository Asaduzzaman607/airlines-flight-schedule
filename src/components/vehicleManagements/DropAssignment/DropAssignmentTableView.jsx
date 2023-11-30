import { useSelector } from 'react-redux'
import { useEffect } from 'react';
import { useDispatch} from 'react-redux'
import dayjs from 'dayjs'
import { Table } from 'antd';

// import components
import { SearchBlock } from '../../commonComponents'

// import actions
import { getDropAssignList } from '../../../services/actions/VehicleManagementActions/dropAssignAction'

//import date config
import { DATE_FORMAT } from '../../../config'

const DropAssignmentTableView = () => {
  // get employee state values from redux
  const { isLoading, dropAssignList } = useSelector(state => state.dropassign)
  
  const dispatch = useDispatch()
  const currentDate = dayjs();

  const columns = [
    {
      title: 'Route Name',
      dataIndex: 'routeName',
      key: 'routeName',
      width: 160,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeesNames',
      key: 'employeesNames',
      width: 180,
      render:  names => names.join(', ')
    },
    {
      title: 'Receive Time',
      dataIndex: 'reciveTime',
      key: 'reciveTime',
      width: 110,
    },
   
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 110,
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 110,
    }
  ]

  useEffect(() => {
    dispatch(getDropAssignList({ date: currentDate && currentDate.format(DATE_FORMAT) }))
  }, [])


  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <SearchBlock action={ getDropAssignList } from="journeyLog"/>
      <Table 
          bordered
          className={"my-custom-table"}
          loading={isLoading}
          dataSource={dropAssignList} 
          columns={columns} 
          scroll={{
              y: 'calc(100vh - 358px)',
              x: 1500
          }}
          pagination={true}
      />
    </div>
  )
}

export default DropAssignmentTableView