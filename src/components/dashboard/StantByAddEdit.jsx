import dayjs from 'dayjs'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DATE_FORMAT } from '../../config'

//components
import { Button, Form, Radio } from 'antd'

//actions
import { addCabinCrewStandBy } from '../../services/actions/dashboardAction'

function StantByAddEdit() {
	const { cabinCrewdetails, initialValuesStandBy, isLoading } = useSelector(
		(state) => state.dashboard
	)
	const [form] = Form.useForm()
	// initial dispatch
	const dispatch = useDispatch()
	const _onFinish = (values) => {
		const transformedValues = {
			...values,
			empIds: [cabinCrewdetails?.id],
			standByDate: dayjs(cabinCrewdetails?.flightDate)?.format(DATE_FORMAT),
		}
		dispatch(addCabinCrewStandBy(transformedValues))
	}
	//reset form data
	const _onReset = () => {
		form.resetFields()
	}

	// Role Type options render based on current employee designation
	const roleOptions = useCallback(() => {
		let options = [<Radio.Button value='GENERAL_CREW'>General Crew</Radio.Button>]

		if (cabinCrewdetails?.cabinCrewType === 'Purser') {
			options.unshift(
				<Radio.Button value='PURSER'>Purser</Radio.Button>,
				<Radio.Button value='JUNIOR_PURSER'>Junior Purser</Radio.Button>
			)
		} else if (cabinCrewdetails?.cabinCrewType === 'Junior Purser') {
			options.unshift(<Radio.Button value='JUNIOR_PURSER'>Junior Purser</Radio.Button>)
		}

		return <Radio.Group>{options}</Radio.Group>
	}, [])

	return (
		<div>
			<Form
				form={form}
				onFinish={_onFinish}
				scrollToFirstError
				layout={'vertical'}
				autoComplete={'off'}
				initialValues={initialValuesStandBy}
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
						<Radio.Button value='FULL_DAY'>Full Day</Radio.Button>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					label={'Select Cabin Crew Role Type'}
					name={'cabinCrewRoleType'}
					rules={[
						{
							type: 'select',
							message: 'Cabin Crew Role is not valid',
						},
						{
							required: true,
							message: 'Select Cabin Crew Role.',
						},
					]}
				>
					{roleOptions()}
				</Form.Item>
				<Form.Item>
					<Button
						htmlType={'submit'}
						type={'primary'}
						icon={<></>}
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

export default StantByAddEdit
