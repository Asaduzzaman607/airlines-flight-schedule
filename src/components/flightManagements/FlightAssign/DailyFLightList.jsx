import { useSelector } from 'react-redux'

// import components
import FlightDetailsCard from './FlightDetailsCard'
import { Empty } from 'antd'

const DailyFlightList = () => {
	// data from redux
	const { flights } = useSelector((state) => state.aircraftAssign)

	return (
		<>
			{flights?.length > 0 && (
				<div
					className={
						'grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-[calc(100vh_-_178px)] overflow-auto'
					}
				>
					{flights?.map((item) => (
						<FlightDetailsCard key={item?.id} flightDetails={item} />
					))}
				</div>
			)}
			{(!flights || flights.length === 0) && (
				<div className={'flex justify-center items-center rounded shadow-sm py-2'}>
					<Empty
						description={'No flights found for selected day.'}
						className={'select-none text-slate-400'}
					/>
				</div>
			)}
		</>
	)
}

export default DailyFlightList
