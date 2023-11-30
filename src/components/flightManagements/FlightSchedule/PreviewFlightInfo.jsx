// import icons
import { IoAirplane } from 'react-icons/io5'
import { BsClock } from 'react-icons/bs'
import { Divider } from 'antd'
import { useSelector } from 'react-redux'

const PreviewFlightInfo = () => {
	const { secondPhaseValues } = useSelector((state) => state.flightSchedule)
	return (
		<div className={'grid lg:grid-cols-2 sm:grid-cols-1 gap-4'}>
			<div className={'bg-white p-0 rounded shadow'}>
				<Divider orientation={'left'} className={'!p-1 !m-0'}>
					<div className={'font-bold text-lg'}>{'Departure'}</div>
				</Divider>
				{secondPhaseValues?.legDepArr?.length > 0 && (
					<div className={'space-y-2'}>
						{secondPhaseValues.legDepArr.map((item) => (
							<FlightContainer
								key={item?.legField?.leg}
								flightNo={item?.legField?.flightNo}
								dep_time={item?.legField?.depTime}
								arr_time={item?.legField?.arrTime}
								duration={item?.legField?.duration}
								leg_details={item?.legField?.leg_details}
								isNextDay={item?.legField?.isNextDay}
							/>
						))}
					</div>
				)}
				{secondPhaseValues?.legDepArr?.length === 0 && <div>{'Flights not created.'}</div>}
			</div>
			<div className={'bg-white rounded shadow'}>
				<Divider orientation={'left'} className={'!p-1 !m-0'}>
					<div className={'font-bold text-lg'}>{'Return'}</div>
				</Divider>
				<div
					className={
						'flex justify-center items-center w-full text-gray-400 -mt-6 p-2 h-full'
					}
				>
					{'Return flight not created.'}
				</div>
			</div>
		</div>
	)
}

const FlightContainer = ({ flightNo, dep_time, arr_time, duration, leg_details, isNextDay }) => {
	return (
		<div
			className={
				'grid grid-cols-3 gap-2 text-white rounded rounded-t-none shadow px-4 py-2 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600'
			}
		>
			<div className={'col-span-3'}>
				<div
					className={
						'flex items-center space-x-2 text-lg font-bold border-0 border-solid border-b border-gray-500'
					}
				>
					<IoAirplane />
					<div>{flightNo ?? 'N/A'}</div>
				</div>
			</div>
			<div>
				<div className={'text-3xl font-bold'}>{leg_details?.departureLeg ?? 'N/A'}</div>
				<div>{dep_time ?? 'N/A'}</div>
			</div>
			<div className={'flex flex-col items-center'}>
				<BsClock className={'text-4xl p-2'} />
				<div>{duration ?? 'N/A'}</div>
			</div>
			<div className={'flex flex-col items-end'}>
				<div className={'text-3xl font-bold'}>{leg_details?.arrivalLeg ?? 'N/A'}</div>
				<div className={'flex items-center space-x-1'}>
					{isNextDay && (
						<span
							className={
								'text-[10px] font-medium text-red-500 leading-none px-1 py-0.5 bg-red-100 rounded-sm shadow'
							}
						>
							{'Next day'}
						</span>
					)}
					<span>{arr_time ?? 'N/A'}</span>
				</div>
			</div>
		</div>
	)
}

export default PreviewFlightInfo
