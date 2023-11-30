import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// import components
import { ScrollTableBlock, SearchBlock, SingleItemView, } from '../../commonComponents'
import { setColor } from '../../commonComponents/CommonItems'

// import actions
import { getCrewsLeaveDashDataList } from '../../../services/actions/CrewManagementActions/crewsLeaveDashActions'

const CrewsLeaveDashboard = () => {
  const [customHeader, setCustomHeader] = useState([])

  // get state values from redux
  const { isLoading, crewsLeaveDashDataList, pagination } = useSelector(state => state.crewsLeaveDash)
  const { data , header } = crewsLeaveDashDataList;

  // column list for search
  const searchableColumnLists = [
	{
		id: 0,
		label: 'Employee Name',
		value: 'name'
	},
	{
		id: 1,
		label: 'Employee ID',
		value: 'code'
	},
	{
		id: 2,
		label: 'Employee Type',
		value: 'employeeType'
	},
	{
		id: 3,
		label: 'Crew Type',
		value: 'crewType'
	},
	{
		id: 4,
		label: 'Date Range',
		value: 'dateRange'
	},
  ]

    // Structure type list items for search
    const items = {
        employeeType: [
            {
                id: 0,
                name: 'Foreign',
                value: 'Foreign'
            },
            {
                id: 1,
                name: 'Local',
                value: 'Local'
            }
        ],
        crewType: [
            {
                id: 0,
                name: 'Cabin Crew ',
                value: 'CABIN_CREW'
            },
            {
                id: 1,
                name: 'Cockpit Crew',
                value: 'COCKPIT_CREW'
            }
        ]
    }

  useEffect(() => {
        if(header?.length > 0) { 
            const _customHeader = header?.map((_header, index) => {
                return {
                    ..._header,
                    title: <div style={{backgroundColor: setColor[index] ?? '#6554AF', color: 'white', padding: '8px', fontWeight: 'bold'}}>
                            { _header?.title }
                        </div>,
                    render: (text) =>  _header?.dataIndex === 'name' ? 
                        <SingleItemView item={text} /> : 
                        <RenderItem items={text} />,
                }
            })
            setCustomHeader(_customHeader)
        }
    }, [crewsLeaveDashDataList])

    // render item
    const RenderItem = ({ items }) => {
        return items ? 
            <div className={'bg-[#DAFFFB]'}>
                <p> { items?.text1 } </p>
                <p className={items?.text2 && `bg-[#FFF9C9]`}> { items?.text2 } </p>
            </div> : 'N/A'
    };

  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <SearchBlock action={ getCrewsLeaveDashDataList } searchableColumnLists={ searchableColumnLists } items={ items } />
      <ScrollTableBlock 
        action={getCrewsLeaveDashDataList}
        columns={customHeader}
        dataList={data}
        pagination={pagination} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export default CrewsLeaveDashboard;