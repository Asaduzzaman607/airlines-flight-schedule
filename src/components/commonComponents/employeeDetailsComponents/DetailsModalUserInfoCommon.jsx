import React from 'react'

export default function DetailsModalUserInfoCommon({ value, label }) {
	return (
		<div>
			<div className={'text-[13px] italic'}>{label}</div>
			<div className={'font-semibold text-[15px] uppercase'}> {value} </div>
		</div>
	)
}
