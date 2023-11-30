import { useMemo } from 'react'
import { useSelector } from 'react-redux'

//import components
import { Tabs, Tag } from 'antd'
import FlightsAddEdit from './FlightsAddEdit'
import StantByAddEdit from './StantByAddEdit'
import LeavesAddEdit from './LeavesAddEdit'

function CabinCrewAddEdit() {
	//global states
	const { cabinCrewdetails } = useSelector((state) => state.dashboard)

	// tab lists
	const tabItems = useMemo(() => {
		return [
			{
				key: 1,
				label: 'Flights',
				children: <FlightsAddEdit />,
			},
			{
				key: 2,
				label: 'Stand By',
				children: <StantByAddEdit />,
			},
			{
				key: 3,
				label: 'Leaves',
				children: <LeavesAddEdit />,
			},
		]
	})

	return (
		<div>
			<div className={'p-2 mb-2 shadow rounded grid grid-cols-1 gap-2'}>
				<div>
					<span className='font-bold mr-2'>Flight Date: </span>
					<Tag color={'green'}>{cabinCrewdetails?.flightDate ?? 'N/A'}</Tag>
				</div>
				<div>
					<span className='font-bold'>Crew name: </span>
					{cabinCrewdetails?.name ?? 'N/A'}
				</div>
				<div className={`flex items-center gap-2 flex-wrap md:flex-nowrap`}>
					<div>
						<span className='font-bold'>Crew Designation: </span>
						{cabinCrewdetails?.cabinCrewType ?? 'N/A'}
					</div>
					<div>
						<span className='font-bold'>Crew Rated: </span>
						{cabinCrewdetails?.rated ?? 'N/A'}
					</div>
				</div>
			</div>
			<Tabs
				defaultActiveKey='1'
				size={'small'}
				type={'card'}
				style={{
					marginBottom: 32,
				}}
				items={tabItems}
			/>
		</div>
	)
}

export default CabinCrewAddEdit
