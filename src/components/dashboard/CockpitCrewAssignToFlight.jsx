import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { Button, Form, Input, Radio, Select, Space, Tag } from 'antd'
import LeavesAddEditCockpitCrew from './LeavesAddEditCockpitCrew'
import StantByAddEditCockpitCrew from './StantByAddEditCockpitCrew'

// import icons
import { DownOutlined, UpOutlined } from '@ant-design/icons'

// import actions
import { showAlert } from '../../services/actions/commonActions'
import {
	getCockpitCrewFlights,
	saveFlightToDashboard,
	updateCrewRoleCommandInAFlight,
	validateAssignCrew,
} from '../../services/actions/dashboardAction'

// import reducer
import {
	setFlightAndRoleData,
	setInitialFormValuesForUpdateAction,
	setIsDashboardDrawerOpen,
	setIsSaveFlightToDashboard,
	setViolatedRuels,
} from '../../services/reducers/dashboardReducer'

const CockpitCrewAssignToFlight = () => {
	const [toggle, setToggle] = useState(true)
	const [selectedFlightType, setSelectedFlightType] = useState('regular')

	const {
		selectedActionKey,
		initialFormValuesForUpdateAction,
		selectedFlight,
		flightAndRoleList: { cockpitCrewFlightRoleTypesList, availableFlightsDtoList },
		violatedRuels,
		isSaveFlightToDashboard,
		selectedDateAndCrewtype,
	} = useSelector((state) => state.dashboard)

	const [form] = Form.useForm()

	const dispatch = useDispatch()

	const _flights = Form.useWatch('flights', form)
	const command_type = Form.useWatch('command_type', form)

	useEffect(() => {
		return () => {
			dispatch(setInitialFormValuesForUpdateAction(null))
            dispatch(setViolatedRuels([]))
			form.resetFields()
		}
	}, [dispatch, form])

	useEffect(() => {
		if (typeof _flights === 'number') {
			const selectFlightInfo =
				availableFlightsDtoList?.length > 0
					? availableFlightsDtoList.find((item) => item?.flightId === _flights)
					: null
			form.setFieldValue('layoverHours', selectFlightInfo?.layoverHours ?? null)
		}
	}, [_flights, availableFlightsDtoList, form])

	useEffect(() => {
		if (isSaveFlightToDashboard) {
			dispatch(setIsDashboardDrawerOpen(false))
			dispatch(getCockpitCrewFlights(selectedDateAndCrewtype))
			dispatch(setIsSaveFlightToDashboard(false))
		}
	}, [isSaveFlightToDashboard, dispatch, selectedDateAndCrewtype])

	const handleNewAssign = (values) => {
		const _values = {
			...values,
			flights: typeof values?.flights === 'number' ? [values?.flights] : values?.flights,
		}
		// transform values
		const finalItems = _values.flights.map((item) => ({
			assignedCockpitCrewId: null,
			dailyFlightPlanId: item,
			employeeId: selectedFlight?.empId,
			cockpitCrewFlightRoleType: values.role_type,
			cockpitCrewFlightCommandType: values.command_type,
			isLayover: typeof values?.flights === 'number' && values?.layoverHours > 0,
			layoverHours: typeof values?.flights === 'number' ? values?.layoverHours : null,
		}))

		if (violatedRuels.length) {
			dispatch(saveFlightToDashboard(finalItems))
			dispatch(setFlightAndRoleData({}))
		} else {
			dispatch(validateAssignCrew(finalItems))
		}
	}

	// handle crew update
	const _handleCrewUpdate = (values) => {
		const { role_type, command_type, layoverHours } = values

		// check if user has not updated anything
		if (
			layoverHours
				? role_type === selectedFlight?.role_type &&
				  command_type === selectedFlight?.command_type &&
				  layoverHours === selectedFlight?.layoverHours
				: role_type === selectedFlight?.role_type &&
				  command_type === selectedFlight?.command_type
		) {
			// show warning
			showAlert('warning', 'You have not updated anything.')
			return
		}

		dispatch(
			updateCrewRoleCommandInAFlight(
				{
					dailyFlightPlanId: selectedFlight?.id,
					employeeId: selectedFlight?.empId,
					cockpitCrewFlightRoleType: role_type,
					cockpitCrewFlightCommandType: command_type,
					isLayover: layoverHours > 0,
					layoverHours,
				},
				selectedFlight?.assignId,
				selectedDateAndCrewtype
			)
		)
	}

	// save or submit hamdler
	const _onFinish = (values) => {
		if (selectedActionKey === 'update_crew') {
			// check if the current data has changed or not
			_handleCrewUpdate(values)
		} else {
			handleNewAssign(values)
		}
	}

	// handle form on change
	const _handleFormOnChange = (selectedKey) => {
		const { name } = selectedKey[0]
		if (!name || command_type) {
			dispatch(setViolatedRuels([]))
		}
	}

	// handle selected flight on change
	const handleSelectedFlightTypeOnChange = (e) => {
		setSelectedFlightType(e.target.value)
		form.resetFields()
	}

	return (
		<div className={'space-y-4'}>
			<div className={'p-2 shadow rounded grid grid-cols-1 gap-2 bg-slate-50'}>
				<div>
					<span className='font-bold mr-2'>Flight Date:</span>
					<Tag color={'green'}>{selectedFlight?.flightDate ?? 'N/A'}</Tag>
				</div>
				{selectedActionKey === 'update_crew' && (
					<div>
						<span className='font-bold mr-2'>Flight no.:</span>
						{selectedFlight?.flightNo}
					</div>
				)}
				<div>
					<span className={'font-bold'}>Crew name:</span>
					{selectedFlight?.empName ?? 'N/A'}
				</div>
			</div>
			<div className={'p-2 shadow rounded grid grid-cols-1 gap-2 bg-slate-50'}>
				{selectedActionKey !== 'update_crew' && (
					<Radio.Group
						defaultValue={selectedFlightType}
						buttonStyle='solid'
						onChange={handleSelectedFlightTypeOnChange}
					>
						<Radio.Button value='regular'>{'Regular'}</Radio.Button>
						<Radio.Button value='lo'>{'Layover'}</Radio.Button>
						<Radio.Button value='stand_by'>{'Stand By'}</Radio.Button>
						<Radio.Button value='leaves'>{'Leaves'}</Radio.Button>
					</Radio.Group>
				)}

				{(selectedFlightType === 'regular' || selectedFlightType === 'lo') && (
					<Form
						layout={'horizontal'}
						validateTrigger={'onChange'}
						form={form}
						onFinish={_onFinish}
						onFieldsChange={_handleFormOnChange}
						scrollToFirstError
						autoComplete={'off'}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						initialValues={
							selectedActionKey === 'update_crew'
								? initialFormValuesForUpdateAction
								: null
						}
					>
						<Form.Item
							name={'command_type'}
							label={'Command type'}
							rules={[
								{
									required: true,
									message: 'Command type is required',
								},
							]}
						>
							<Radio.Group buttonStyle={'solid'}>
								<Radio.Button value={'PIC'}>{'PIC'}</Radio.Button>
								<Radio.Button value={'SIC'}>{'SIC'}</Radio.Button>
							</Radio.Group>
						</Form.Item>
						<Form.Item
							name={'role_type'}
							label={'Flight role'}
							rules={[
								{
									required: true,
									message: 'Flight role type is required',
								},
							]}
						>
							<Select
								style={{ width: '100%' }}
								options={
									cockpitCrewFlightRoleTypesList?.length &&
									cockpitCrewFlightRoleTypesList.map((item) => ({
										label: item,
										value: item,
									}))
								}
								placeholder={'Select flight role'}
							/>
						</Form.Item>
						{selectedActionKey === 'add_new_flight' && (
							<Form.Item
								name={'flights'}
								label={'Flights'}
								rules={[
									{
										required: true,
										message: 'This field is required',
									},
								]}
							>
								<Select
									style={{ width: '100%' }}
									options={
										availableFlightsDtoList?.length &&
										availableFlightsDtoList
											.filter(
												(item) =>
													(selectedFlightType === 'lo' &&
														item?.isLayover) ||
													(selectedFlightType === 'regular' &&
														!item?.isLayover)
											)
											.map((item) => ({
												value: item?.flightId,
												label: (
													<div>
														<div>{`${item?.flightNo} (${item?.leg})`}</div>
														<div
															className={'text-[12px] flex space-x-2'}
														>
															<div>{`${item?.actualDepartureTime} - ${item?.actualArrivalTime}`}</div>
															{item?.cockpitCrewFlightRoleTypeSet && (
																<Tag style={{ fontSize: '12px' }}>
																	{
																		item?.cockpitCrewFlightRoleTypeSet
																	}
																</Tag>
															)}
														</div>
													</div>
												),
											}))
									}
									showSearch
									filterOption={(input, option) => (option?.label?.props?.children[0]?.props?.children ?? '').toLowerCase().includes(input.toLowerCase())}
									placeholder={'Select flights'}
									mode={selectedFlightType === 'lo' ? null : 'multiple'}
									disabled={selectedActionKey === 'update_crew'}
								/>
							</Form.Item>
						)}
						{(selectedFlightType === 'lo' ||
							(selectedActionKey === 'update_crew' && selectedFlight?.isLayover)) && (
							<Form.Item
								name={'layoverHours'}
								label={'LO Hours'}
								rules={[
									{
										required: true,
										message: 'Layover hours field is required',
									},
									{
										validator: (_, value) => {
											if (value >= 0 || !value) {
												return Promise.resolve()
											}
											return Promise.reject(
												new Error('Layover hours must be a positive number')
											)
										},
									},
								]}
							>
								<Input type={'number'} />
							</Form.Item>
						)}
						<Form.Item noStyle>
							<div className={'flex justify-end'}>
								<Space>
									<Button htmlType={'reset'} danger>
										{'Reset'}
									</Button>
									<Button htmlType={'submit'} type={'primary'}>
										{selectedActionKey === 'update_crew'
											? 'Update'
											: violatedRuels.length
											? 'Submit With Warning'
											: 'Assign'}
									</Button>
								</Space>
							</div>
						</Form.Item>
					</Form>
				)}
				{selectedFlightType === 'stand_by' && <StantByAddEditCockpitCrew />}
				{selectedFlightType === 'leaves' && <LeavesAddEditCockpitCrew />}
			</div>

			{violatedRuels.length > 0 && (
				<div className={'bg-yellow-200 font-bold rounded-md p-2'}>
					<div
						onClick={() => setToggle(!toggle)}
						className={'flex cursor-pointer justify-between'}
					>
						<span className={'text-red-600'}>
							{violatedRuels.length} Warning Found ***
						</span>
						<span className={'text-gray-400'}>
							{' '}
							{toggle ? <UpOutlined /> : <DownOutlined />}
						</span>
					</div>
					{toggle &&
						violatedRuels?.map((item, id) => (
							<div key={id} className={'pl-4 pt-2'}>
								<span className={'text-black-400 '}>
									{' '}
									{id + 1 + ') '} {item?.rule}.{' '}
								</span>
								<span className={'pl-2 text-zinc-500 font-semibold italic'}>
									{' '}
									--- {item?.description}{' '}
								</span>
							</div>
						))}
				</div>
			)}
		</div>
	)
}

export default CockpitCrewAssignToFlight
