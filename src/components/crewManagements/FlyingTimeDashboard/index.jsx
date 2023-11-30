import { useState } from 'react'
import { useSelector } from 'react-redux'

// import actions and components
import { getFlyingDashboardData } from '../../../services/actions/CrewManagementActions/flyingTimeAction'
import { TimeIconComponent } from '../../commonComponents/CommonItems'
import { ScrollTableBlock, SearchBlock, SingleItemView, } from '../../commonComponents'
import FlyingTimeViewModal from './FlyingTimeViewModal'
import { Button } from 'antd'

const FlyingTimeDashboard = () => {
    const [flyingModalOpen, setFlyingModalOpen] = useState(false)

  // get state values from redux
  const { isLoadingDashboard, flyingDashboardDataList, pagination } = useSelector(state => state.flyingTime)

  // table colums fields
  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (text, fullPath) => <SingleItemView item={text} fullPath={fullPath} isClickable={true} />
    },  
    {
      title: 'Licence NO.',
      dataIndex: 'licenseNo',
      key: 'licenseNo',
      width: 120,
      render: text => <span> { text ?? 'N/A' } </span>
    },  
    {
      title: 'Flying Hour As Cabin Crew',
      dataIndex: 'totalFlyingHourAsCabinCrew',
      key: 'totalFlyingHourAsCabinCrew',
      width: 120,
      render: (item) => item ? <TimeIconComponent item={item} /> : ''
    },  
    {
      title: 'Flying Hour As Captain',
      dataIndex: 'totalFlyingHourAsCaptain',
      key: 'totalFlyingHourAsCaptain',
      width: 120,
      render: (item) => item ? <TimeIconComponent item={item} /> : ''
    },  
    {
      title: 'Flying Hour As First Officer',
      dataIndex: 'totalFlyingHourAsFirstOfficer',
      key: 'totalFlyingHourAsFirstOfficer',
      width: 120,
      render: (item) => item ? <TimeIconComponent item={item} /> : ''
    },  
    {
      title: 'Flying Hour As Instructor',
      dataIndex: 'totalFlyingHourAsInstructor',
      key: 'totalFlyingHourAsInstructor',
      width: 120,
      render: (item) => item ? <TimeIconComponent item={item} /> : ''
    },  
    {
      title: 'Flying Hour Of Present Airlines',
      dataIndex: 'totalFlyingHourPresentAirline',
      key: 'totalFlyingHourPresentAirline',
      width: 120,
      render: (item) => item ? <TimeIconComponent item={item} /> : ''
    },  
    {
        title: 'Total Flying Hour',
        dataIndex: 'totalFlyingHour',
        key: 'totalFlyingHour',
        fixed: 'right',
        width: 90,
        render: (item) => item ? <TimeIconComponent item={item} /> : ''
    },  
    {
      title: 'All Flying Times',
      dataIndex: 'flyingTimes',
      key: 'flyingTimes',
      width: 90,
      fixed: 'right',
      render: (item, allItems) => (item && item?.length > 0) ? <Button type={'primary'} onClick={() => setFlyingModalOpen(allItems)}> View </Button> : 'N/A'
    },  
    
  ];

  // column list for search
  const searchableColumnLists = [
	{
		id: 0,
		label: 'Employee Name',
		value: 'name'
	},
  ]

  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <SearchBlock action={ getFlyingDashboardData } searchableColumnLists={ searchableColumnLists }/>
      <ScrollTableBlock 
        action={getFlyingDashboardData}
        columns={columns}
        dataList={flyingDashboardDataList}
        pagination={pagination} 
        isLoading={isLoadingDashboard} 
      />
      {
        (flyingModalOpen) && <FlyingTimeViewModal items={flyingModalOpen} setFlyingModalOpen={setFlyingModalOpen}/>
      }
    </div>
  );
}

export default FlyingTimeDashboard;