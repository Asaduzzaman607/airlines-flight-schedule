import { useSelector } from 'react-redux'

// import actions and components
import { deleteFlyingTimeData, getFlyingTimeSearchList } from '../../../services/actions/CrewManagementActions/flyingTimeAction'
import { ScrollTableBlock, SearchBlock, SingleItemView, TableAction } from '../../commonComponents'
import { TimeIconComponent } from '../../commonComponents/CommonItems'

const FlyingTimeTableView = () => {
  // get flying time state values from redux
  const { isLoading, flyingTimeList, pagination } = useSelector(state => state.flyingTime)

  // table colums fields
  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 220,
      fixed: 'left',
      render: (text) => <SingleItemView item={text} />
    },  
    {
      title: 'Flying Time',
      children: [
        {
            title: 'Hour',
            dataIndex: 'hour',
            key: 'hour',
            width: 120,
            render: (item) => item ? <TimeIconComponent item={item} /> : ''
        },
        {
            title: 'Minutes',
            dataIndex: 'min',
            key: 'min',
            width: 120,
            render: (item) => item ? <TimeIconComponent item={item} /> : ''
        }
      ]
    },
    {
        title: 'Aircraft Type',
        dataIndex: 'aircraftType',
        key: 'aircraftType',
        width: 150,
        render: (item) => <span> {item?.name} </span>
    },  
    {
        title: 'Crew Type',
        dataIndex: 'crewType',
        key: 'crewType',
        width: 200,
    }, 
    {
        title: 'Crew Role Type',
        dataIndex: 'cockpitCrewFlightRoleType',
        key: 'cockpitCrewFlightRoleType',
        width: 200,
        render: (item, fullItems) => <span> { item ?? fullItems?.cabinCrewType} </span>
    }, 
    {
        title: 'Present Airlines',
        dataIndex: 'isPresent',
        key: 'isPresent',
        width: 120,
        render: (item) => <span> {item ? 'YES' : 'NO'} </span>
    },  
    {
        title: 'Actions',
        key: 'action',
        fixed: 'right',
        width: 120,
        render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteFlyingTimeData } pagination={ pagination } />
    }
  ];

  // column list for search
  const searchableColumnLists = [
	{
		id: 0,
		label: 'Name',
		value: 'employeeName'
	},
  ]

  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <SearchBlock action={ getFlyingTimeSearchList } searchableColumnLists={ searchableColumnLists }/>
      <ScrollTableBlock 
        action={getFlyingTimeSearchList}
        columns={columns}
        dataList={flyingTimeList}
        pagination={pagination} 
        isLoading={isLoading} 
      />
    </div>
  );
}
export default FlyingTimeTableView;