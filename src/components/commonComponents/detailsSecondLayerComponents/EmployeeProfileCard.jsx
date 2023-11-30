import React from 'react'
import EmployeeProfileAvatar from './EmployeeProfileAvatar'
import CustomTitleCard from '../CustomTitleCard'

const EmployeeProfileCard = ({ data }) => {
	let gridSizeRange = data?.length < 4 && data?.length > 1 ? data?.length : undefined
	return (
		<div className={`grid grid-cols-${gridSizeRange ?? 4} w-full gap-4`}>
			{data?.map((item) => (
				<div
					className={`p-4 rounded-2xl bg-[#f1f4ff] shadow flex flex-row space-x-4 items-center`}
				>
					<EmployeeProfileAvatar src={item?.imgSrc} />
					<div className={`grid grid-cols-none w-full space-y-2`}>
						<CustomTitleCard
							subText={item?.role + '-' + item?.type}
							title={item?.name}
						/>
						<CustomTitleCard subText={'Command Type'} title={item?.commandType} />
					</div>
				</div>
			))}
		</div>
	)
}

export default EmployeeProfileCard
