import { memo } from 'react'
//import component
import PopoverTable from './PopoverTable'

function DashboardLayoverHoverHandler({ layover }) {
	const transformData = [
		{ title: 'Flight No.', value: layover?.flightNo },
		{ title: 'Time', value: `${layover?.startTime ?? 'N/A'} - ${layover?.endTime ?? 'N/A'}` },
		{ title: 'Leg', value: layover?.legName },
	]
	return (
		<PopoverTable title={'On Layover'} titleColor={'bg-[#164B60]'} tableData={transformData} />
	)
}

export default memo(DashboardLayoverHoverHandler)
