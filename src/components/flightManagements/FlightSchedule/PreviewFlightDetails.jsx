import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

// import components
import { Button, Space } from 'antd'
import PreviewFlightInfo from './PreviewFlightInfo'

// import icons
import { FiSun } from 'react-icons/fi'
import { GiDirectionSigns, GiPlaneWing } from 'react-icons/gi'
import { BsCalendarDate, BsCalendarDay, BsArrowLeftRight, BsArrowRight } from 'react-icons/bs'

// import actions, reducers, hooks
import {
	setFirstPhaseValues,
	setSelectedIndex,
} from '../../../services/reducers/FlightManagementReducers/flightScheduleReducer'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'
import useAxiosPost from '../../../services/hooks/useAxiosPost'

// import config
import { FLIGHT_SCHEDULE } from '../../../config'

const PreviewFlightDetails = () => {
	return (
		<div className={'space-y-4'}>
			<BasicInfo />
			<PreviewFlightInfo />
			<Footer />
		</div>
	)
}

const BasicInfo = () => {
	const { firstPhaseValues, secondPhaseValues } = useSelector((state) => state.flightSchedule)
	const _selectedDayOrDate = useMemo(() => {
		const {
			selectedDayOrDate: { days, selectedDayOrDateType },
		} = firstPhaseValues

		let arrayToString = ''
		if (days?.length === 1 && days[0] === 'everyday') {
			arrayToString = 'Everyday'
		}

		if (days?.length > 0 && days[0] !== 'everyday' && typeof days[0] === 'string') {
			arrayToString = days
				.map((item) => {
					const firstLetter = item.charAt(0).toUpperCase()
					const restOfWord = item.slice(1)
					return firstLetter + restOfWord
				})
				.join(', ')
		}

		if (days?.length > 0 && days[0] !== 'everyday' && typeof days[0] === 'number') {
			arrayToString = days.join(', ')
		}

		return {
			dayOrDate: selectedDayOrDateType === 'days' ? 'Selected  Days' : 'Selected Dates',
			selectedDayOrDateType,
			arrayToString,
		}
	}, [firstPhaseValues])
	return (
		<div className={'pt-2'}>
			<Space>
				<TitleTag
					type={'season'}
					typeLabel={'Season'}
					label={firstPhaseValues?.season_details?.label ?? 'N/A'}
					colors={'bg-gradient-to-b from-cyan-300 via-sky-400 to-sky-600'}
				/>
				<TitleTag
					type={'aircraftType'}
					typeLabel={'Aircraft type'}
					label={secondPhaseValues?.aircraft_type?.label ?? 'N/A'}
					colors={'bg-gradient-to-b from-indigo-300 via-indigo-400 to-purple-600'}
				/>
				<TitleTag
					type={'return'}
					typeLabel={'Trip type'}
					label={firstPhaseValues?.trip_type_details?.label ?? 'N/A'}
					colors={'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700'}
				/>
				<TitleTag
					type={_selectedDayOrDate?.selectedDayOrDateType}
					typeLabel={_selectedDayOrDate?.dayOrDate}
					label={_selectedDayOrDate?.arrayToString}
					colors={'bg-gradient-to-b from-teal-400 via-teal-500 to-teal-700'}
				/>
			</Space>
		</div>
	)
}

const TitleTag = ({ type, typeLabel, label, colors }) => (
	<div className={`px-4 py-2 inline-block rounded shadow-md ${colors}`}>
		<Space>
			{iconComponents[type]}
			<div>
				<div className={'font-bold text-[16px] text-white/90'}>{label}</div>
				<div className={'text-white/70 text-[10px]'}>{typeLabel}</div>
			</div>
		</Space>
	</div>
)

const Footer = () => {
	const [isUpdateLoading, setIsUpdateLoading] = useState(false)
	const { firstPhaseValues, secondPhaseValues, dynamicAircraftListOption } = useSelector(
		(state) => state.flightSchedule
	)

	const { isLoading, doPost } = useAxiosPost()
	const navigate = useNavigate()

	const dispatch = useDispatch()
	const { id } = useParams()
	const goPrevious = () => dispatch(setSelectedIndex(1))

	const handleButtonClick = async () => {
		// setIsLoading(true)
		const _flights = createFlightParams(
			secondPhaseValues?.legDepArr,
			dynamicAircraftListOption[0]?.aircraftList
		)

		const params = {
			seasonId: firstPhaseValues?.season,
			days:
				firstPhaseValues?.selectedDayOrDate?.selectedDayOrDateType === 'days'
					? firstPhaseValues?.selected_days
					: [],
			dates:
				firstPhaseValues?.selectedDayOrDate?.selectedDayOrDateType === 'dates'
					? firstPhaseValues?.selected_days
					: [],
			aircraftTypeId: secondPhaseValues?.aircraftTypeId,
			multiLeg: secondPhaseValues?.legDepArr?.length > 1 ?? false,
			..._flights,
		}

		try {
			if (id) {
				setIsUpdateLoading(true)
				const { data } = await axios.put(
					FLIGHT_SCHEDULE.UPDATE_MULTI_FLIGHT_SCHEDULE,
					params,
					{
						params: { id: id },
					}
				)

				// show success alert
				showAlert('success', data?.message ?? 'Updated successfully.')
			} else {
				const response = await doPost(FLIGHT_SCHEDULE.ADD_MULTI_FLIGHT_SCHEDULE, params)

				// show success alert
				showAlert('success', response?.message ?? 'Added successfully.')
			}

			// redirect to parent
			navigate('/flight-management/schedule')

			// clear redux
			dispatch(setSelectedIndex(0))
			dispatch(
				setFirstPhaseValues({
					selectedDayOrDate: {
						selectedDayOrDateType: 'days',
					},
				})
			)
			dispatch(
				setFirstPhaseValues({
					legType: 'regular',
					legDepArr: [{ legField: { leg: null } }],
				})
			)
		} catch (error) {
			console.error(error)

			// get error msg and show alert
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)
		} finally {
			setIsUpdateLoading(false)
		}
	}
	return (
		<div className={'w-full py-2 flex justify-end space-x-1'}>
			<Button type={'default'} onClick={goPrevious}>
				{'Previous'}
			</Button>
			<Button
				type={'primary'}
				onClick={handleButtonClick}
				loading={id ? isUpdateLoading : isLoading}
			>
				{id ? 'Update' : 'Create'}
			</Button>
		</div>
	)
}

const createFlightParams = (flights, legList) => ({
	flightNextDay: flights.some((item) => item?.legField?.isNextDay),
	multiLeg: flights?.length > 1 ?? false,
	flightInfo: flights?.map((item, index) => ({
		order: index,
		flightNo: item?.legField?.flightNo,
		legId: item?.legField?.leg,
		departureTime: item?.legField?.depTime,
		arrivalTime: item?.legField?.arrTime,
	})),
	connectingFlight: {
		order: 0,
		flightNo: flights[0]?.legField?.flightNo,
		legId: legList.find(
			(item) =>
				item?.departureLeg === flights[0]?.legField?.leg_details?.departureLeg &&
				item?.arrivalLeg === flights[flights.length - 1]?.legField?.leg_details?.arrivalLeg
		)?.id,
		departureTime: flights[0]?.legField?.depTime,
		arrivalTime: flights[flights.length - 1]?.legField?.arrTime,
	},
})

const iconComponents = {
	season: <FiSun className={'text-white text-[24px]'} />,
	aircraftType: <GiPlaneWing className={'text-white text-[24px] rotate-45'} />,
	tripType: <GiDirectionSigns className={'text-white text-[24px]'} />,
	dates: <BsCalendarDate className={'text-white text-[24px]'} />,
	days: <BsCalendarDay className={'text-white text-[24px]'} />,
	oneway: <BsArrowRight className={'text-white text-[24px]'} />,
	return: <BsArrowLeftRight className={'text-white text-[24px]'} />,
}

export default PreviewFlightDetails
