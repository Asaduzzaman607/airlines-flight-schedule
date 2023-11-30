import React from 'react'

// import components
import DetailsModalUserInfoCommon from './DetailsModalUserInfoCommon'
import { Image } from 'antd'

// import image
import defaultImage from '../../../assets/images/default_pilot.jpg'

export default function DetailsViewModalUserInfo({ userInfo }) {
	return (
		<div className={'flex justify-between rounded-lg bg-purple-100 px-4 py-1'}>
			<div className={'flex'}>
				<Image
					width={70}
					height={70}
					className={'rounded-full'}
					src={userInfo?.profile ?? defaultImage}
				/>
				<div className={'block pl-4'}>
					<div className={'font-bold text-[17px] uppercase'}> {userInfo?.name} </div>
					<div className={'text-[12px] italic uppercase'}>{userInfo?.designation}</div>
				</div>
			</div>
			<DetailsModalUserInfoCommon value={userInfo?.id} label={'ID'} />
			<DetailsModalUserInfoCommon value={userInfo?.phone} label={'PHONE'} />
			<DetailsModalUserInfoCommon value={userInfo?.email} label={'EMAIL'} />
		</div>
	)
}
