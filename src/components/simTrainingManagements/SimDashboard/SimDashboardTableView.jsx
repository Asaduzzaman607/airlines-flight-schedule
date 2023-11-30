import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// import components
import { ScrollTableBlock, SearchBlock, SingleItemView } from '../../commonComponents'
import { setColor } from '../../commonComponents/CommonItems'

// import actions
import { getSimDashboardData } from '../../../services/actions/SimTrainingManagementActions/simDashboardAction'

const TableView = () => {
    const [customHeader, setCustomHeader] = useState([])

    // get dashboard state values from redux
    const { isLoading, dashboardData, pagination } = useSelector(state => state.simDashboard)
    const { data , header } = dashboardData;

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Name',
            value: 'name'
        },
        {
            id: 1,
            label: 'Cockpit Crew Type',
            value: 'cockpitCrewType'
        },
    ]

    // construct items list for crew type
    const items = {
        cockpitCrewType: [
            {
                id: 0,
                name: 'CAPTAIN',
                value: 'CAPTAIN'
            },
            {
                id: 1,
                name: 'FIRST OFFICER',
                value: 'FIRST_OFFICER'
            }
        ]
    }

    useEffect(() => {
        const _createChildren = (headerItem, bgColor) => {
            if(!headerItem || headerItem?.length === 0) {
                return []
            }
            const _children = headerItem?.map(item => {
                return {
                    ...item,
                    title: <div style={{backgroundColor: bgColor, padding: '0px', fontWeight: 'bold', color: 'white'}}>{ item?.title }</div>,
                    width: '150px',
                    render: (text) => text ? text : 'N/A',
                }
            })
        
            return _children
        }
        if(header?.length > 0) { 
            const _customHeader = header?.map((_header, index) => {
                const bg_color = setColor[index] ?? '#6554AF';
                if(_header?.children?.length > 0) {
                    return {
                        title: <div style={{backgroundColor: bg_color, padding: '4px', fontWeight: 'bold', color: 'white'}}>{ _header?.title }</div>,
                        children: _createChildren(_header?.children, bg_color)
                    }
                } else {
                    return {
                        ..._header,
                        title: <div style={{backgroundColor: bg_color, padding: '20px', fontWeight: 'bold', color: 'white'}}>{ _header?.title }</div>,
                        width: 200,
                        render: text => _header?.dataIndex === 'name' ? <SingleItemView item={text} /> : text
                    }
                }
            })
            setCustomHeader(_customHeader)
        }
    }, [dashboardData])

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={getSimDashboardData} searchableColumnLists={searchableColumnLists} items={ items } />
            <ScrollTableBlock 
                action={getSimDashboardData}
                columns={customHeader}
                dataList={data}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TableView