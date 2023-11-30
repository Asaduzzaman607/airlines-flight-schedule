import { useSelector } from 'react-redux'

// import components
import { Alert, Empty } from 'antd'
import { FlightDetailsCard, AircraftSortContainer } from '../FlightAssign'

const SelectedFlightsToAssign = () => {
	// get flights from redux
	const { selectedFlights, selectedAircraft } = useSelector((state) => state.aircraftAssign)

	return (
		<div className={'relative'}>
			<div className={'sticky top-[116px] space-y-1.5'}>
				<AircraftSortContainer />
				{selectedFlights?.length > 0 && (
					<div
						className={
							'grid grid-cols-1 gap-2 max-h-[calc(100vh_-_178px)] overflow-auto'
						}
					>
						{selectedFlights?.map((item) => (
							<FlightDetailsCard key={item?.id + '- selected'} flightDetails={item} />
						))}
					</div>
				)}
				{(!selectedFlights || selectedFlights.length === 0) && (
					<div
						className={'flex justify-center items-center py-2 bg-white rounded shadow'}
					>
						<Empty
							description={
								<Alert
									message={
										selectedAircraft
											? 'Please select flights to assign aircraft.'
											: 'Please select aircraft to assign flights.'
									}
									type={selectedAircraft ? 'info' : 'warning'}
									showIcon={true}
								/>
							}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default SelectedFlightsToAssign
