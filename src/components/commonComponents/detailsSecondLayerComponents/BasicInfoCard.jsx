import React from 'react'
import EmployeeProfileAvatar from './EmployeeProfileAvatar'
import CustomTitleCard from '../CustomTitleCard'

const BasicInfoCard = ({ items, titleKey }) =>
	items?.basicInfo?.length ? (
		<div className='flex items-center space-x-8 w-full'>
			<EmployeeProfileAvatar url={items?.profile} />
			<div className={'grid grid-cols-4 w-full space-y-2'}>
				{items?.basicInfo?.map((item, index) =>
					item?.name === titleKey ? (
						<div className='col-span-4 mb-2' key={index}>
							<CustomTitleCard
								titleSize={'lg'}
								subText={item?.label}
								title={item?.value}
							/>
						</div>
					) : (
						<CustomTitleCard subText={item?.label} title={item?.value} />
					)
				)}
			</div>
		</div>
	) : (
		<div></div>
	)

export default BasicInfoCard
