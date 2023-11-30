import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// import components
import { TagRender } from './TagRender'
import { Button, Form, Radio, Select, Modal } from 'antd'

// import icon
import { DownOutlined, UpOutlined } from '@ant-design/icons'

// import action and reducers
import {
	getFlgithAndRoleList,
	saveFlightToDashboard,
	validateAssignCrew,
	getCockpitCrewFlights,
} from '../../services/actions/dashboardAction'
import {
	setFlightAndRoleData,
	setIsSaveFlightToDashboard,
	setViolatedRuels,
} from '../../services/reducers/dashboardReducer'

export default function CustomModal({ title, setIsModalOpen, isModalOpen, type }) {
	const [toggle, setToggle] = useState(true)

	const {
		selectedEmployeeInfo,
		selectedHeaderItem,
		isLoadingModal,
		flightAndRoleList,
		violatedRuels,
		isSaveFlightToDashboard,
		selectedDateAndCrewtype,
	} = useSelector((state) => state.dashboard)

	const [form] = Form.useForm()
	const dispatch = useDispatch()

	// save or submit hamdler
	const _onFinish = (values) => {
		// transform values
		const finalItems = values.flightNo.map((item) => ({
			assignedCockpitCrewId: null,
			dailyFlightPlanId: item,
			employeeId: selectedEmployeeInfo?.id,
			cockpitCrewFlightRoleType: values.role,
			cockpitCrewFlightCommandType: values.crewFlightCommandType ?? 'PIC',
		}))

		if (violatedRuels.length) {
			dispatch(saveFlightToDashboard(finalItems))
			dispatch(setFlightAndRoleData({}))
		} else {
			dispatch(validateAssignCrew(finalItems))
		}
	}

	// close modal
	const handleCancel = () => {
		setIsModalOpen(false)
		dispatch(setFlightAndRoleData({}))
		dispatch(setViolatedRuels([]))
	}

	const _flightAndRoleList = useMemo(() => {
		const _temp = { ...flightAndRoleList }
		const { availableFlightsDtoList } = _temp

		// check if, the desired array in not valid or empty
		if (!availableFlightsDtoList || availableFlightsDtoList.length === 0) {
			return []
		}

		return availableFlightsDtoList.map((item) => ({
			label:
				item?.flightNo +
				` ( ${item?.leg} ${item?.actualDepartureTime} To ${item?.actualArrivalTime} ) ${
					item?.cockpitCrewFlightRoleTypeSet?.map((item) => item?.charAt(0))?.join(' ') ??
					''
				}`,
			value: item?.flightId,
		}))
	}, [flightAndRoleList])

	useEffect(() => {
		if (isSaveFlightToDashboard) {
			setIsModalOpen(false)
			dispatch(getCockpitCrewFlights(selectedDateAndCrewtype))
			dispatch(setIsSaveFlightToDashboard(false))
		}
	}, [isSaveFlightToDashboard])

	useEffect(() => {
		dispatch(
			getFlgithAndRoleList({
				employeeId: selectedEmployeeInfo?.id,
				flightDate: selectedHeaderItem,
			})
		)
	}, [])

	return (
		<div>
			<Modal
				confirmLoading={isLoadingModal}
				maskClosable={false}
				title={title}
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
				width={'700px'}
			>
				<Form
					validateTrigger={'onChange'}
					form={form}
					onFinish={_onFinish}
					scrollToFirstError
					layout={'vertical'}
					autoComplete={'off'}
				>
					<div
						className={
							'grid h-[400px] p-4 pt-10 border shadow-gray-400 rounded-lg shadow-inner gap-5 mb-6 relative overflow-y-auto'
						}
					>
						<div className={'flex justify-between'}>
							<span className={'font-bold'}>{selectedEmployeeInfo?.name}</span>
							<span className={'font-bold'}>Date: {selectedHeaderItem}</span>
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
											<span
												className={
													'pl-2 text-zinc-500 font-semibold italic'
												}
											>
												{' '}
												--- {item?.description}{' '}
											</span>
										</div>
									))}
							</div>
						)}
						<div className={'sm:grid-cols-1 pb-0 mb-0'}>
							<Form.Item
								name='flightNo'
								label='Flight No'
								rules={[
									{
										type: 'select',
										message: 'The input is not valid',
									},
									{
										required: true,
										message: 'Flight no is required.',
									},
								]}
							>
								<Select
									showSearch
									mode='multiple'
									tagRender={TagRender}
									style={{
										width: '100%',
									}}
									placeholder='Plese select flight no'
									optionFilterProp='children'
									filterOption={(input, option) =>
										(option?.label ?? '')
											.toLowerCase()
											.includes(input.toLowerCase())
									}
									filterSort={(optionA, optionB) =>
										(optionA?.label ?? '')
											.toLowerCase()
											.localeCompare((optionB?.label ?? '').toLowerCase())
									}
									options={_flightAndRoleList ?? []}
								/>
							</Form.Item>
						</div>
						<div className={'sm:grid-cols-1 sm:pb-0'}>
							<Form.Item
								name='role'
								label='Flight Role'
								rules={[
									{
										type: 'select',
										message: 'The input is not valid',
									},
									{
										required: true,
										message: 'Role is required.',
									},
								]}
							>
								<Select placeholder={'Please select role'}>
									{flightAndRoleList?.cockpitCrewFlightRoleTypesList?.map(
										(item, id) => (
											<Select.Option value={item} key={id}>
												{item}
											</Select.Option>
										)
									)}
								</Select>
							</Form.Item>
						</div>
						<div className={'sm:grid-cols-1 sm:pb-0'}>
							<Form.Item label='Command Type' name='crewFlightCommandType'>
								<Radio.Group defaultValue={'PIC'}>
									<Radio value='PIC'> PIC </Radio>
									<Radio value='SIC'> SIC </Radio>
								</Radio.Group>
							</Form.Item>
						</div>
					</div>

					<Form.Item>
						<Button
							htmlType={'submit'}
							className={'mr-4'}
							loading={isLoadingModal}
							type={'primary'}
						>
							{violatedRuels.length ? 'Submit With Warning' : 'Submit'}
						</Button>
						<Button htmlType={'reset'} onClick={handleCancel}>
							{'Cancel'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
