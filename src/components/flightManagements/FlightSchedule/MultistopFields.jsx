import { useSelector } from 'react-redux'

// import components
import { Button, Form, Input, Radio, TimePicker } from 'antd'
import { CloseSquareFilled, PlusOutlined } from '@ant-design/icons'
import { CustomSelect } from '../../commonComponents'

// Item from Form
const { Item } = Form

const MultistopFields = ({ legType, handleOnRemoveLeg, handleLegOnChange }) => {
	const { dynamicAircraftListOption } = useSelector((state) => state.flightSchedule)

	return (
		<div className={'w-full'}>
			<Item
				label={'Leg type'}
				name={'legType'}
				rules={[
					{
						required: true,
						message: 'This field is required',
					},
				]}
			>
				<Radio.Group>
					<Radio.Button value={'regular'}>Regular</Radio.Button>
					<Radio.Button value={'multileg'}>Multi-leg</Radio.Button>
				</Radio.Group>
			</Item>
			<Form.List name={'legDepArr'}>
				{(fields, { add, remove }) => (
					<>
						{fields.map(({ key, name, ...restField }, index) => (
							<div key={key}>
								<Item
									key={key + 'legField'}
									label={'Leg'}
									rules={[
										{
											required: true,
											message: 'This field is required',
										},
									]}
									name={[name, 'legField']}
								>
									<Input.Group compact={true}>
										<Item
											{...restField}
											name={[name, 'legField', 'leg']}
											label={'test'}
											noStyle
											rules={[
												{
													required: true,
													message: 'Leg is required.',
												},
											]}
										>
											<CustomSelect
												width={120}
												options={
													dynamicAircraftListOption[index]
														?.aircraftList ?? []
												}
												placeholder={'Select leg'}
												onChange={(value, option) =>
													handleLegOnChange(value, option, index)
												}
												showSearch={true}
											/>
										</Item>
										<Item
											{...restField}
											name={[name, 'legField', 'depTime']}
											noStyle={true}
											label={'temp'}
											rules={[
												{
													required: true,
													message: 'Departure time is required.',
												},
											]}
										>
											<TimePicker
												allowClear={false}
												format={'HHmm'}
												placeholder={'Departure time'}
												showNow={false}
											/>
										</Item>
										<Item
											{...restField}
											name={[name, 'legField', 'arrTime']}
											noStyle={true}
											label={'temp'}
											rules={[
												{
													required: true,
													message: 'Arrival time is required.',
												},
											]}
										>
											<TimePicker
												allowClear={false}
												format={'HHmm'}
												placeholder={'Arrival time'}
												showNow={false}
											/>
										</Item>
										{fields.length > 1 && (
											<Item noStyle>
												<CloseSquareFilled
													style={{
														color: 'red',
														fontSize: 16,
														marginLeft: 8,
													}}
													onClick={() =>
														handleOnRemoveLeg(remove, name, index)
													}
												/>
											</Item>
										)}
									</Input.Group>
								</Item>
							</div>
						))}
						{legType && (
							<div>
								<Form.Item label={' '} colon={false}>
									<Button
										type={'dashed'}
										icon={<PlusOutlined />}
										onClick={() => {
											add()
										}}
										disabled={false}
									>
										Add More Leg
									</Button>
								</Form.Item>
							</div>
						)}
					</>
				)}
			</Form.List>
		</div>
	)
}

export default MultistopFields
