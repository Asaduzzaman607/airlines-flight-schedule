import { memo } from 'react'

//import component
import PopoverTable from './PopoverTable'

function DashboardLeaveHoverHandler({ leave }) {
	const transformData = [
		{ title: 'Type', value: leave?.leaveName },
		{ title: 'Status', value: leave?.approvalStatus },
		{ title: 'Emergency', value: leave?.isEmergency ? ' YES' : ' NO' },
	]
	return <PopoverTable title={'On Leave'} titleColor={'bg-[#3f51b5]'} tableData={transformData} />
}

export default memo(DashboardLeaveHoverHandler)
