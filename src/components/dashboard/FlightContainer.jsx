import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { Button, Dropdown, Modal } from 'antd'

// import icons
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md'
import { AiOutlineNumber } from 'react-icons/ai'
import { ImLocation } from 'react-icons/im'
import {
	EllipsisOutlined,
	EditOutlined,
	DeleteOutlined,
	PlusSquareOutlined,
} from '@ant-design/icons'

// import actions
import {
	setIsDashboardDrawerOpen,
	setSelectedActionKey,
	setInitialFormValuesForUpdateAction,
	setSelectedFlight,
} from '../../services/reducers/dashboardReducer'
import {
	getFlgithAndRoleList,
	removeCockpitCrewFromFlight,
} from '../../services/actions/dashboardAction'

const FlightContainer = ({ flight }) => {
	const { selectedDatesAndCrewType } = useSelector((state) => state.dashboard)
	const [modal, contextHolder] = Modal.useModal()
	const dispatch = useDispatch()

	// check if the flight is invalid
	if (!flight) return false

	// get value from flight
	const {
		flightNo,
		flightStatus,
		actualDepartureTime,
		actualArrivalTime,
		flightLeg,
		empId,
		flightDate,
		command_type,
		role_type,
		assignId,
		isLayover,
		layoverHours,
	} = flight

	// handle actions
	const _hanldeActions = ({ key }) => {
		// check if this is for remove crew
		if (key === 'remove_crew') {
			// open delete confirmation
			modal.confirm({
				title: `Are you sure to remove this crew from "${flightNo}" flight?`,
				okText: 'Confirm',
				cancelText: 'Cancel',
				onOk: () =>
					dispatch(removeCockpitCrewFromFlight(assignId, selectedDatesAndCrewType)),
			})
			return
		}
		if (key === 'update_crew') {
			dispatch(
				setInitialFormValuesForUpdateAction({
					command_type,
					role_type,
					isLayover,
					layoverHours,
				})
			)
		}

		// check if employee id is available and then get flight list and role list of that employee
		if (empId && flightDate) {
			dispatch(
				getFlgithAndRoleList({
					employeeId: empId,
					flightDate: flightDate,
				})
			)
		}

		dispatch(setSelectedFlight(flight))

		dispatch(setSelectedActionKey(key ?? null))
		dispatch(setIsDashboardDrawerOpen(true))
	}

	return (
		<div
			className={`w-full h-full relative rounded grid grid-cols-2 content-evenly border border-solid px-1 ${statusColorOptions[flightStatus]}`}
		>
			<Container type={'flightNo'} text={flightNo} />
			<Container type={'flightLeg'} text={flightLeg} />
			<Container type={'departureTime'} text={actualDepartureTime} />
			<Container type={'arrivalTime'} text={actualArrivalTime} />
			<div className={'absolute -right-1 bottom-1'}>
				<Dropdown size={'small'} menu={{ items, onClick: _hanldeActions }}>
					<Button
						icon={<EllipsisOutlined />}
						size={'small'}
						type={'text'}
						className={'rotate-90'}
					/>
				</Dropdown>
			</div>
			{contextHolder}
		</div>
	)
}

const items = [
	{
		label: 'Update Flight',
		key: 'update_crew',
		icon: <EditOutlined />,
	},
	{
		label: 'Remove Flight',
		key: 'remove_crew',
		danger: true,
		icon: <DeleteOutlined />,
	},
	{
		label: 'Add New Flight',
		key: 'add_new_flight',
		icon: <PlusSquareOutlined />,
	},
]

const statusColorOptions = {
	PENDING: 'bg-gray-50 border-gray-700',
	COMPLETED: 'bg-green-100 border-green-700',
	DELAYED: 'bg-yellow-200 border-yellow-700',
	CANCELLED: 'bg-red-200 border-red-700',
}

const Container = ({ type, text }) => {
	const iconOptions = {
		arrivalTime: <MdFlightLand />,
		departureTime: <MdFlightTakeoff />,
		flightNo: <AiOutlineNumber />,
		flightLeg: <ImLocation />,
	}
	return (
		<div className={'text-start text-xs flex space-x-1'}>
			<div>{iconOptions[type]}</div>
			<div>{text}</div>
		</div>
	)
}

export default memo(FlightContainer)
