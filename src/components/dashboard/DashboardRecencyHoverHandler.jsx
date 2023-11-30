import { memo } from 'react'

//import component
import PopoverTable from './PopoverTable'

function DashboardRecencyHoverHandler({ recency }) {
	const maxlimit = 25
	const tableHeader = ['Recency Name', 'Expired On']
	const transformData = recency?.length
		? recency?.map((item) => ({
				title:
					(item?.recencyName).length > maxlimit
						? item?.recencyName.substring(0, maxlimit - 3) + '...'
						: item?.recencyName,
				value: item?.recencyExpiredDate,
		  }))
		: []
	return (
		<PopoverTable
			title={'Recency Information'}
			titleColor={'bg-[#B31312]'}
			tableHeader={tableHeader}
			tableData={transformData}
		/>
	)
}

export default memo(DashboardRecencyHoverHandler)
