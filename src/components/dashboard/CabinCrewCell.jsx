import { CustomTag } from '../commonComponents/CommonItems'

const CabinCrewCell = ({ cellDetails, onClick }) => {
	if (!cellDetails) {
		return (
			<div className={'w-full hover:cursor-pointer'} onClick={onClick}>
				-
			</div>
		)
	}
	return (
		<div onClick={onClick} className={'hover:cursor-pointer'}>
			<div className={'grid gap-1'}>
				{cellDetails?.map((item, index) =>
					item?.type === 'flight' ? (
						item?.flight?.length && (
							<div className={'grid grid-cols-2 gap-2'}>
								{item.flight.map((item) => (
									<CustomTag color='green'>
										{item?.domestic ? item?.legInfo : item?.flightNo}{' '}
										{item?.training ? ' ' + item?.training : ''}
									</CustomTag>
								))}
							</div>
						)
					) : item?.type === 'layover' ? (
						<div>
							<CustomTag color='red'>
								LO - {item?.layover?.airport} - {item?.layover?.startTime} -
								{item?.layover?.endTime}
							</CustomTag>
						</div>
					) : item?.type === 'leave' ? (
						<div className={'grid grid-cols-2 gap-2'}>
							<CustomTag color='yellow'>{item?.leave}</CustomTag>
						</div>
					) : (
						item?.type === 'stand_by' && (
							<div className={'grid grid-cols-2 gap-2'}>
								<CustomTag color='gold' style={{ width: '100px' }}>
									<div>
										SB -{' '}
										{item?.stand_by?.cabinCrewRoleType === 'PURSER'
											? 'P'
											: item?.stand_by?.cabinCrewRoleType === 'JUNIOR_PURSER'
											? 'JP'
											: 'GC'}
									</div>
									<div>{item?.stand_by?.shiftName}</div>
									<div>
										{item?.stand_by?.startTime} - {item?.stand_by?.endTime}
									</div>
								</CustomTag>
							</div>
						)
					)
				)}
			</div>
		</div>
	)
}

export default CabinCrewCell
