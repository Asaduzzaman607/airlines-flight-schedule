import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//import components
import { Alert, Button, Checkbox, Form, Popconfirm, Space } from 'antd'
import { CustomTag } from '../commonComponents/CommonItems'

//import icons
import { CloseOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

//import actions
import { showAlert } from '../../services/actions/commonActions'
import { saveAssignCabinCrewFlights } from '../../services/actions/dashboardAction'
import { CustomInputNumber, CustomSelectBox, CustomSelectWithSearch } from '../commonComponents'

const FlightsAddEdit = () => {
	// global states
	const {
		assigndCabinCrewList,
		selectedCabinCrewFlights,
		initialFormValuesForUpdateCabinCrew,
		isSaveAssignCabinCrewFlightsLoading,
		selectedCabinCrewActionKey,
	} = useSelector((state) => state.dashboard)

	//local states
	const [availableFlights, setAvailableFlights] = useState([])
	const [cabinCrewRoles, setCabinCrewRoles] = useState([])
	const [selectedFlights, setSelectedFlights] = useState([])
	const [isConfirmMsgOpen, setIsConfirmMsgOpen] = useState(false)

	// initial dispatch
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const onFinish = (values) => {
		let flights =
			values?.regular?.map((item) => ({
				...item,
				isLayover: false,
			})) ?? []

		if (values?.layover?.dailyFlightPlanId && values?.layover?.cabinCrewFlightRoleType) {
			if (
				values?.layover?.layoverHours === null ||
				values?.layover?.layoverHours === undefined ||
				typeof values?.layover?.layoverHours === 'string'
			) {
				return showAlert('warning', 'Please select layover hour!')
			}
			flights = [
				...flights,
				{ ...values?.layover, isLayover: values?.layover?.layoverHours ? true : false },
			]
		}

		const params = {
			...selectedCabinCrewFlights,
			flights,
		}

		// check if flights have selected
		if (flights?.length) {
			dispatch(saveAssignCabinCrewFlights(params))
		}

		// check if action key is update
		else if (selectedCabinCrewActionKey === 'update_cabin_crew_flight') {
			setIsConfirmMsgOpen(true)
		} else {
			if (!values?.layover?.dailyFlightPlanId) {
				showAlert('warning', 'Please select flights!')
			} else if (!values?.layover?.cabinCrewFlightRoleType) {
				showAlert('warning', 'Please select layover role!')
			}
		}
	}

	//modal confirm for remove all flights
	const handleOnConfirm = () => {
		const params = {
			...selectedCabinCrewFlights,
			flights: [],
		}
		dispatch(saveAssignCabinCrewFlights(params))
	}

	// update the list of flights and cabin crew role
	useEffect(() => {
		setAvailableFlights(assigndCabinCrewList?.availableFlightsDtoList)
		setCabinCrewRoles(assigndCabinCrewList?.cabinCrewTypes)
	}, [assigndCabinCrewList])
	return (
		<Form
			form={form}
			name='dynamic_form_nest_item'
			onFinish={onFinish}
			style={{
				maxWidth: 600,
			}}
			autoComplete='off'
			initialValues={initialFormValuesForUpdateCabinCrew}
			onValuesChange={(_, allvalues) => {
				if (allvalues?.regular?.length) {
					setSelectedFlights(allvalues?.regular)
				}
			}}
		>
			<div className={'font-bold mb-2'}>Regular Flights:</div>
			<Form.List name='regular'>
				{(fields, { add, remove }) => (
					<>
						{fields.map(({ key, name, ...restField }, index) => (
							<Form.Item key={key}>
								<Space
									style={{
										display: 'flex',
										alignItems: 'center',
										marginBottom: 0,
									}}
									align='baseline'
								>
									<div className={'grid gap-2 shadow p-2 rounded'}>
										<Space.Compact
											style={{
												width: '350px',
											}}
										>
											<Form.Item
												{...restField}
												name={[name, 'dailyFlightPlanId']}
												noStyle
												rules={[
													{
														required: true,
														message: 'Flight is required',
													},
												]}
											>
												<CustomSelectBox
													placeholder='Select flight'
													mode={'single'}
													tagRender={null}
													allowClear={false}
													label={'label'}
													dataIndex={'value'}
													showSearch
													filterOption={(input, option) => (option?.children?.props?.children[0]?.props?.children ?? '').toLowerCase().includes(input.toLowerCase())}
													itemList={availableFlights
														?.filter((item) => !item?.isLayover)
														?.map((item) => ({
															value: item?.flightId,
															label: (
																<div>
																	<div>
																		{item?.flightNo +
																			' ' +
																			item?.leg}
																	</div>
																	<div
																		className={
																			'text-[12px] flex space-x-2'
																		}
																	>
																		<div>
																			{item?.actualDepartureTime +
																				'-' +
																				item?.actualArrivalTime}
																		</div>
																	</div>
																</div>
															),
															disabled: selectedFlights?.some(
																(flight) =>
																	flight?.dailyFlightPlanId ===
																	item?.flightId
															),
														}))}
												/>
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, 'cabinCrewFlightRoleType']}
												noStyle
												rules={[
													{ required: true, message: 'Role is required' },
												]}
											>
												<CustomSelectWithSearch
													mode={'single'}
													tagRender={null}
													allowClear={false}
													placeholder='Select role'
													label={'label'}
													dataIndex={'value'}
													itemList={cabinCrewRoles?.map((item) => ({
														label: item,
														value: item,
													}))}
												/>
											</Form.Item>
										</Space.Compact>
										<Space
											style={{
												width: '350px',
											}}
										>
											<Form.Item
												{...restField}
												name={[name, 'training']}
												noStyle
											>
												<CustomSelectWithSearch
													placeholder='Select training'
													mode={'single'}
													tagRender={null}
													allowClear={false}
													label={'label'}
													dataIndex={'value'}
													itemList={[
														{
															label: 'OJT',
															value: 'OJT',
														},
														{
															label: 'Check',
															value: 'CHECK',
														},
													]}
												/>
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, 'addFlyingTime']}
												noStyle
												initialValue={true}
												valuePropName='checked'
												normalize={(value) => (value ? value : false)}
											>
												<Checkbox defaultChecked>Add flying time</Checkbox>
											</Form.Item>
										</Space>
									</div>
									<MinusCircleOutlined onClick={() => remove(name)} />
								</Space>
							</Form.Item>
						))}
						{/* check flights available or not */}
						{!availableFlights?.filter((item) => !item?.isLayover)?.length && (
							<div className='mb-2'>
								<Alert
									message='No regular flights available for this crew'
									type='warning'
									showIcon
									closable
								/>
							</div>
						)}
						<Form.Item>
							<Button
								type={'dashed'}
								onClick={() => add()}
								icon={<PlusOutlined />}
								disabled={
									fields?.length >=
									availableFlights?.filter((item) => !item?.isLayover)?.length
								}
							>
								Add Regular Flights
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
			<Form.List>
				{(fields, { add, remove }) => (
					<>
						{availableFlights?.filter((item) => item?.isLayover)?.length ? (
							<div className={'shadow rounded p-2 mb-3'}>
								<div className={'flex justify-between items-center mb-2'}>
									<div className={'font-bold mb-2'}>Layover Flight:</div>
									<Button
										type={'primary'}
										size={'small'}
										style={{ display: 'flex', alignItems: 'center' }}
										danger
										onClick={() => {
											form.setFieldsValue({
												layover: {
													dailyFlightPlanId: null,
													cabinCrewFlightRoleType: null,
													layoverHours: null,
													addFlyingTime: true,
													training: null,
												},
											})
										}}
									>
										Clear <CloseOutlined />
									</Button>
								</div>
								<Form.Item>
									<Space.Compact
										style={{
											display: 'flex',
											marginBottom: 8,
										}}
										align='baseline'
									>
										<Form.Item name={['layover', 'dailyFlightPlanId']} noStyle>
											<CustomSelectBox
												placeholder='Select flight'
												mode={'single'}
												tagRender={null}
												allowClear={false}
												label={'label'}
												dataIndex={'value'}
												showSearch
												filterOption={(input, option) => (option?.children?.props?.children[0]?.props?.children ?? '').toLowerCase().includes(input.toLowerCase())}
												itemList={
													availableFlights
														?.filter((item) => item?.isLayover)
														?.map((item) => ({
															value: item?.flightId,
															label: (
																<div>
																	<div>
																		{item?.flightNo +
																			' ' +
																			item?.leg}
																	</div>
																	<div
																		className={
																			'text-[12px] flex space-x-2'
																		}
																	>
																		<div>
																			{item?.actualDepartureTime +
																				'-' +
																				item?.actualArrivalTime}
																		</div>
																	</div>
																</div>
															),
														})) ?? []
												}
												onChange={(value) => {
													let defaultValueOfLayover =
														availableFlights?.find(
															(item) => item?.flightId === value
														)?.layoverHours
													form.setFieldsValue({
														layover: {
															layoverHours: defaultValueOfLayover,
														},
													})
												}}
											/>
										</Form.Item>
										<Form.Item
											name={['layover', 'cabinCrewFlightRoleType']}
											noStyle
										>
											<CustomSelectWithSearch
												mode={'single'}
												tagRender={null}
												allowClear={false}
												placeholder='Select role'
												label={'label'}
												dataIndex={'value'}
												itemList={cabinCrewRoles?.map((item) => ({
													label: item,
													value: item,
												}))}
											/>
										</Form.Item>
									</Space.Compact>
									<Space
										style={{
											width: '350px',
										}}
									>
										<Form.Item name={['layover', 'training']} noStyle>
											<CustomSelectWithSearch
												placeholder='Select training'
												mode={'single'}
												tagRender={null}
												allowClear={false}
												label={'label'}
												dataIndex={'value'}
												itemList={[
													{
														label: 'OJT',
														value: 'OJT',
													},
													{
														label: 'Check',
														value: 'CHECK',
													},
												]}
											/>
										</Form.Item>
										<Form.Item
											name={['layover', 'addFlyingTime']}
											noStyle
											initialValue={true}
											valuePropName='checked'
											normalize={(value) => (value ? value : false)}
										>
											<Checkbox defaultChecked>Add flying time</Checkbox>
										</Form.Item>
									</Space>
									<div className={'font-bold mb-2'}>Layover Hour:</div>
									<Form.Item
										name={['layover', 'layoverHours']}
										noStyle
										rules={[
											{
												validator: (_, value) => {
													if (value >= 0 || !value) {
														return Promise.resolve()
													}
													return Promise.reject(
														new Error(
															'Layover hours must be a positive number'
														)
													)
												},
											},
										]}
									>
										<CustomInputNumber
											type={'number'}
											style={{ height: '32px', width: '110px' }}
											placeholder={'Layover hour'}
										/>
									</Form.Item>
								</Form.Item>
							</div>
						) : (
							<div className='mb-2'>
								<Alert
									message='No layover flight available for this crew'
									type='warning'
									showIcon
								/>
							</div>
						)}
					</>
				)}
			</Form.List>

			<Form.Item noStyle>
				<div className={'flex justify-end'}>
					<Popconfirm
						placement={'topRight'}
						title={'Do you want to remove this crew from all assigned flights.'}
						open={isConfirmMsgOpen}
						okText={'Confirm'}
						cancelText={'Cancel'}
						onCancel={() => setIsConfirmMsgOpen(false)}
						onConfirm={handleOnConfirm}
						okButtonProps={{
							icon: <></>,
							loading: isSaveAssignCabinCrewFlightsLoading,
						}}
					>
						<Button
							type='primary'
							htmlType='submit'
							icon={<></>}
							loading={!isConfirmMsgOpen && isSaveAssignCabinCrewFlightsLoading}
						>
							{selectedCabinCrewActionKey === 'update_cabin_crew_flight'
								? 'Update'
								: 'Assign'}
						</Button>
					</Popconfirm>
				</div>
			</Form.Item>
		</Form>
	)
}

export default FlightsAddEdit
