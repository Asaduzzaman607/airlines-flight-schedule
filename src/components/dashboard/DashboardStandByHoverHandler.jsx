import { memo } from 'react'

//import component
import PopoverTable from './PopoverTable'

function DashboardStandByHoverHandler({ standby }) {
	const transformData = [
		{ title: 'Role', value: standby?.crewRoleType },
		{ title: 'Time', value: `${standby?.startTime ?? 'N/A'} - ${standby?.endTime ?? 'N/A'}` },
	]
	return (
		<PopoverTable
			title={'On Standby-' + standby?.shiftName ?? 'N/A'}
			titleColor={'bg-[#7A3E3E]'}
			tableData={transformData}
		/>
	)
}

export default memo(DashboardStandByHoverHandler)
