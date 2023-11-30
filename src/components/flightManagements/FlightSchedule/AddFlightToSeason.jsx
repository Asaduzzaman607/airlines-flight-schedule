import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

// import components
import { FlightDetailsForm, PreviewFlightDetails, SelectSeason } from './index'
import { Steps } from 'antd'

// import actions, reducers, hooks
import { getFlightDetails } from '../../../services/actions/FlightManagementActions/flightScheduleAction'
import {
	setFirstPhaseValues,
	setSecondPhaseValues,
	setSelectedIndex,
} from '../../../services/reducers/FlightManagementReducers/flightScheduleReducer'

const AddFlightToSeason = () => {
	const { selectedIndex, firstPhaseValues } = useSelector((state) => state.flightSchedule)
	const dispatch = useDispatch()
	const { id } = useParams()

	const steps = [
		{
			title: 'Season Selector',
			key: 'Season Selector',
			content: <SelectSeason firstPhaseValues={firstPhaseValues} />,
		},
		{
			title: 'Flight Details',
			key: 'Flight Details',
			content: <FlightDetailsForm />,
		},
		{
			title: 'Preview',
			key: 'Preview',
			content: <PreviewFlightDetails />,
		},
	]

	// check if page has id
	useEffect(() => {
		if (id) {
			dispatch(getFlightDetails(id))
		} else {
			dispatch(
				setFirstPhaseValues({
					selectedDayOrDate: {
						selectedDayOrDateType: 'days',
					},
				})
			)
			dispatch(
				setSecondPhaseValues({
					legType: 'regular',
					legDepArr: [{ legField: { leg: null } }],
				})
			)
		}
		return () => dispatch(setSelectedIndex(0))
	}, [id, dispatch])

	return (
		<div className={'space-y-2'}>
			<Steps current={selectedIndex} items={steps} />
			<div>{steps[selectedIndex].content}</div>
		</div>
	)
}

export default AddFlightToSeason
