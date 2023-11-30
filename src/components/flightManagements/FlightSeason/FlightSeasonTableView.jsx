import { useSelector } from 'react-redux'

// import components
import { MonthYearDateFormater } from '../../commonComponents/CommonItems'
import { SearchBlock, TableAction, TableBlock } from '../../commonComponents'

// import actions
import { deleteFlightSeasonData, getFlightSeasonSearchList } from '../../../services/actions/FlightManagementActions/flightSeasonAction'

const TableView = () => {
  // get flight season state values from redux
  const { isLoading, flightSeasonList, pagination } = useSelector(state => state.flightSeason)

  const columns = [
    {  
      title: 'Seasons Name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: text => <MonthYearDateFormater inputDate={text} />  
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: text => <MonthYearDateFormater inputDate={text} />  
    },
    {
      title: 'Actions',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteFlightSeasonData } pagination={ pagination } />
    },
  ]

  // column list for search
  const searchableColumnLists = [
      {
          id: 0,
          label: 'Season Name',
          value: 'name'
      },
      {
          id: 1,
          label: 'Start Date',
          value: 'startDate'
      },
      {
          id: 2,
          label: 'End Date',
          value: 'endDate'
      },
  ]

  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <SearchBlock action={ getFlightSeasonSearchList } searchableColumnLists={ searchableColumnLists }/>
      <TableBlock 
          action={getFlightSeasonSearchList}
          columns={columns}
          dataList={flightSeasonList}
          pagination={pagination} 
          isLoading={isLoading} 
      />
    </div>
  )
}
export default TableView