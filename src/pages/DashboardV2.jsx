import React, { lazy, startTransition, Suspense, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import { Button, DatePicker, Segmented, Space } from 'antd'
import { SubmitOptionsOccDashboard } from '../components/dashboard'

// import icons
import { SearchOutlined } from '@ant-design/icons'

// import actions
import { getCabinCrewFlights, getCockpitCrewFlights } from '../services/actions/dashboardAction'
import { setSelectedDatesAndCrewType } from '../services/reducers/dashboardReducer'

const { RangePicker } = DatePicker

const EmployeesView = lazy(() => import('../components/dashboard/EmployeesView'))
const FlightsView = lazy(() => import('../components/dashboard/FlightsView'))
const CabinCrewDashboard = lazy(() => import('../components/dashboard/CabinCrewDashboard'))

const DashboardV2 = () => {
	const [selectedOption, setSelectedOption] = useState('flights')
	const [selectedDates, setSelectedDates] = useState(null)

	const { isLoading } = useSelector((state) => state.dashboard)

	const dispatch = useDispatch()

	const options = [
		{ label: 'Flights', value: 'flights', disabled: false },
		{ label: 'Cockpit Crew', value: 'cockpit_crew' },
		{ label: 'Cabin Crew', value: 'cabin_crew' },
	]

	// get initial one week data
	useEffect(() => {
		const _startDate =
			selectedOption === 'cockpit_crew'
				? dayjs().startOf('week')
				: selectedOption === 'cabin_crew'
				? dayjs().startOf('month')
				: dayjs()
		const _endDate =
			selectedOption === 'cockpit_crew'
				? dayjs().endOf('week')
				: selectedOption === 'cabin_crew'
				? dayjs().endOf('month')
				: dayjs()

		setSelectedDates([_startDate, _endDate])

		const params = {
			fromDate: _startDate.format('YYYY-MM-DD'),
			toDate: _endDate.format('YYYY-MM-DD'),
			crewType: 'COCKPIT_CREW',
		}
		// set dates into redux
		dispatch(setSelectedDatesAndCrewType(params))
	}, [])

	// handle on date change
	const _handleDateChange = (dates) => {
		setSelectedDates(dates)
	}

	// handle on search
	const _handleSearch = () => {
		const params = {
			fromDate: selectedDates[0].format('YYYY-MM-DD'),
			toDate: selectedDates[1].format('YYYY-MM-DD'),
			crewType: 'COCKPIT_CREW',
		}

		if (selectedOption === 'cockpit_crew') {
			// set dates into redux
			dispatch(setSelectedDatesAndCrewType(params))
			dispatch(getCockpitCrewFlights(params))
		}

		if (selectedOption === 'cabin_crew') {
			dispatch(setSelectedDatesAndCrewType(params))
			dispatch(getCabinCrewFlights(params))
		}
	}

	// handle segment select change
	const _handleSegmentSelectChange = (value) => {
		setSelectedOption(value)

		const _startDate =
			value === 'cockpit_crew'
				? dayjs().startOf('week')
				: value === 'cabin_crew'
				? dayjs().startOf('month')
				: dayjs()
		const _endDate =
			value === 'cockpit_crew'
				? dayjs().endOf('week')
				: value === 'cabin_crew'
				? dayjs().endOf('month')
				: dayjs()

		setSelectedDates([_startDate, _endDate])

		const params = {
			fromDate: _startDate.format('YYYY-MM-DD'),
			toDate: _endDate.format('YYYY-MM-DD'),
			crewType: 'COCKPIT_CREW',
		}

		dispatch(setSelectedDatesAndCrewType(params))
		dispatch(getCockpitCrewFlights(params))
		dispatch(getCabinCrewFlights(params))
	}

	return (
		<section className={'p-2 space-y-2 mt-1'}>
			<div>
				<div className={'grid grid-cols-1 md:grid-cols-2'}>
					<div>
						<Segmented
							options={options}
							value={selectedOption}
							onChange={_handleSegmentSelectChange}
							className={'bg-blue-50 drop-shadow'}
						/>
					</div>
					{(selectedOption === 'cockpit_crew' || selectedOption === 'cabin_crew') && (
						<div className={'flex justify-end items-center drop-shadow'}>
							<Space.Compact direction={'horizontal'}>
								<RangePicker
									presets={{
										Today: [dayjs(), dayjs()],
										'This Week': [
											dayjs().startOf('week'),
											dayjs().endOf('week'),
										],
										'This Month': [
											dayjs().startOf('month'),
											dayjs().endOf('month'),
										],
									}}
									onChange={_handleDateChange}
									format={'DD-MMM-YYYY'}
									value={selectedDates}
									allowClear={false}
								/>
								<Button
									icon={<SearchOutlined />}
									type={'primary'}
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
									onClick={() => {
										startTransition(() => _handleSearch())
									}}
									loading={isLoading}
								>
									{'Search'}
								</Button>
							</Space.Compact>
						</div>
					)}
					{selectedOption === 'flights' && <SubmitOptionsOccDashboard />}
				</div>
			</div>

			<Suspense fallback={<div>Loading...</div>}>
				{selectedOption === 'cockpit_crew' && <EmployeesView />}
				{selectedOption === 'flights' && <FlightsView />}
				{selectedOption === 'cabin_crew' && <CabinCrewDashboard />}
			</Suspense>
		</section>
	)
}

export default DashboardV2
