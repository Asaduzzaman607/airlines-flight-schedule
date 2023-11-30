import dayjs from 'dayjs'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DATE_FORMAT } from '../../config'

//components
import { Button, Form, Radio } from 'antd'

//actions
import { addCockpitCrewStandBy } from '../../services/actions/dashboardAction'

function StantByAddEditCockpitCrew() {
	const { selectedFlight } = useSelector((state) => state.dashboard)
	const { isLoading } = useSelector((state) => state.employeeLeave)
	const [form] = Form.useForm()
	// initial dispatch
	const dispatch = useDispatch()
	const _onFinish = (values) => {
		const transformedValues = {
			...values,
			empIds: [selectedFlight?.empId],
			standByDate: selectedFlight?.flightDate
				? dayjs(selectedFlight?.flightDate)?.format(DATE_FORMAT)
				: null,
		}
		dispatch(addCockpitCrewStandBy(transformedValues))
	}
	//reset form data
	const _onReset = () => {
		form.resetFields()
	}

	return (
		<div>
			<Form
				form={form}
				onFinish={_onFinish}
				scrollToFirstError
				layout={'vertical'}
				autoComplete={'off'}
				// initialValues={initialValuesStandBy}
			>
				<Form.Item
					label={'Select Stand By Shift'}
					name={'shift'}
					rules={[
						{
							type: 'select',
							message: 'Stand By Shift is not valid',
						},
						{
							required: true,
							message: 'Select Stand By Shift.',
						},
					]}
				>
					<Radio.Group>
						<Radio.Button value='MORNING'>Morning</Radio.Button>
						<Radio.Button value='EVENING'>Evening</Radio.Button>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					label={'Select Cockpit Crew Role Type'}
					name={'cockpitCrewFlightRoleType'}
					rules={[
						{
							type: 'select',
							message: 'Cockpit Crew Role is not valid',
						},
						{
							required: true,
							message: 'Select Cockpit Crew Role.',
						},
					]}
				>
					<Radio.Group>
						<Radio.Button value='FIRST_OFFICER'>FIRST OFFICER</Radio.Button>,
						<Radio.Button value='CAPTAIN'>CAPTAIN</Radio.Button>
					</Radio.Group>
				</Form.Item>
				<Form.Item>
					<Button
						htmlType={'submit'}
						type={'primary'}
						loading={isLoading}
						style={{ margin: '5px' }}
					>
						Submit
					</Button>
					<Button htmlType={'reset'} onClick={() => _onReset}>
						{'Reset'}
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default StantByAddEditCockpitCrew
