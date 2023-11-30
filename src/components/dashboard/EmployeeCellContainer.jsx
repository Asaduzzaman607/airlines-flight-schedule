import { lazy, cloneElement } from 'react'

// import components
import { FlightContainer } from './index'
import DashboardLeaveHoverHandler from './DashboardLeaveHoverHandler'
import DashboardStandByHoverHandler from './DashboardStandByHoverHandler'
import DashboardRecencyHoverHandler from './DashboardRecencyHoverHandler'
import DashboardLayoverHoverHandler from './DashboardLayoverHoverHandler'
const EmployeeCellContainer = ({ cellInfo }) => {
	const { type } = cellInfo

	return (
		<div className={'absolute top-0 w-full h-full'}>
			{componentsByType[type] &&
				cloneElement(componentsByType[type], { [type]: cellInfo[type] })}
		</div>
	)
}

const componentsByType = {
	flight: <FlightContainer />,
	leave: <DashboardLeaveHoverHandler />,
	layover: <DashboardLayoverHoverHandler />,
	standby: <DashboardStandByHoverHandler />,
	recency: <DashboardRecencyHoverHandler />,
}

export default EmployeeCellContainer
