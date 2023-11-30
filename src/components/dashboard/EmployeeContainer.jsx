import { useMemo } from 'react'

// import components
import { Space, Tag, Popover, Divider } from 'antd'
import PopoverTable from './PopoverTable'

const EmployeeContainer = ({ employee }) => {
	// check if employee is not valid
	if (!employee || !employee.name) {
		return null
	}

	// generate random HEX color
	const _getRandomColor = () =>
		useMemo(() => {
			// Generate a random hex color code
			let hex = '#'
			for (let i = 0; i < 6; i++) {
				hex += Math.floor(Math.random() * 16).toString(16)
			}
			return hex
		}, [])

	const {
		batchNo,
		areaCode,
		dateRangeFlyTime,
		completedFlights,
		canceledFlights,
		totalFlightInDataRange,
		remainingDays,
	} = employee

	const transformData = [
		{ title: 'Flights', value: totalFlightInDataRange ?? 0 },
		{ title: 'Flying Hours', value: dateRangeFlyTime ?? 0 },
		{ title: 'Flown Flights', value: completedFlights ?? 0 },
		{ title: 'On Type Hour', value: canceledFlights ?? 0 },
		{ title: 'Remaining Days', value: remainingDays ?? 'N/A' },
	]

	return (
		<div
			className={'absolute top-0 left-0 h-full w-full'}
			style={{ borderLeft: `5px solid ${_getRandomColor()}` }}
		>
			<PopoverTable
				placement='rightTop'
				tableData={transformData}
				title={'Employee Information'}
				disableTitle={true}
				contentChildren={
					<>
						<Divider style={{ margin: 0 }} />
						<div className='p-1'>
							<Tag color={'purple'}>{'B-' + batchNo ?? 'N/A'}</Tag>
							<Tag color={'cyan'}>{areaCode ?? 'N/A'}</Tag>
						</div>
					</>
				}
			>
				<div className={'w-full h-full'}>
					<div className={'ml-2 font-semibold text-md'}>{employee?.name}</div>
				</div>
			</PopoverTable>
		</div>
	)
}

export default EmployeeContainer
