import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form } from 'antd'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
//import components
import { CustomSelectBox } from '../../commonComponents'
import axios from 'axios'
// import action
import {
	addLeaveConfig,
	editLeaveConfig,
	getEmployeeTypeList,
	getLeaveTypeList,
	getLeaveTypeListForConfig,
} from '../../../services/actions/FlightManagementActions/leaveConfigAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import role config
import { LEAVE_CONFIG } from '../../../config'

function LeaveConfigForm() {
	const { success, isLoadingAddUser, leaveTypeList, employeeTypeList } = useSelector(
		(state) => state.leaveConfig
	)
	const { routePermissions } = useSelector((state) => state.auth)

	const { id } = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [form] = Form.useForm()

	// destructure parent path name
	const { parent } = routePermissions

	const _onFinish = (values) => {
		// dispatch to add and edit action
		if (id) {
			values.id = Number(id)
			dispatch(editLeaveConfig(values))
		} else {
			dispatch(addLeaveConfig(values))
		}
	}

	//reset form data
	const _onReset = () => {
		form.resetFields()
	}

	// Handle input field
	const inputField = ({ type, label }) => {
		const _components = {
			selectEmpType: (
				<CustomSelectBox
					itemList={employeeTypeList}
					label={'name'}
					dataIndex={'id'}
					placeholder={`Select ${label}`}
				/>
			),
			select: (
				<CustomSelectBox
					itemList={leaveTypeList}
					label={'name'}
					dataIndex={'id'}
					placeholder={`Select ${label}`}
				/>
			),
		}
		return _components[type] || null
	}

	const addEditInfoFeilds = [
		{
			id: 1,
			name: 'employeeTypeId',
			label: 'Employee Type',
			type: 'selectEmpType',
			rules: [
				{
					type: 'text',
					message: 'Employee Type is not valid',
				},
				{
					required: true,
					message: 'Employee Type is required.',
				},
			],
		},
		{
			id: 2,
			name: 'leaveTypeId',
			label: 'Leave Type',
			type: 'select',
			rules: [
				{
					type: 'select',
					message: 'Leave Type is not valid',
				},
				{
					required: true,
					message: 'Leave Type is required.',
				},
			],
		},
	]

	useEffect(() => {
		if (id) {
			// For edit form , If api response has successfully done then re-direct to parent path
			success && navigate(parent)
		}
	}, [success])

	useEffect(() => {
		dispatch(getEmployeeTypeList())
		dispatch(getLeaveTypeListForConfig())

		const _fetchData = async () => {
			try {
				const { data } = await axios.get(LEAVE_CONFIG.GET_LEAVE_CONFIG + id)

				form.setFieldsValue(data)
			} catch (error) {
				console.error(error)
				const errMsg = getErrorMsg(error)

				// show error msg
				showAlert('error', errMsg)
			}
		}

		if (id) {
			_fetchData()
		}
	}, [id])

	return (
		<div className={'bg-white py-3 rounded-md'}>
			<Form
				validateTrigger={'onChange'}
				form={form}
				onFinish={_onFinish}
				scrollToFirstError
				layout={'vertical'}
				autoComplete={'off'}
			>
				<div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
					{addEditInfoFeilds?.map((field) => {
						return (
							<Form.Item
								key={field.id}
								name={field.name}
								label={field.label}
								rules={field.rules}
								dependencies={field.dependencies ?? []}
							>
								{inputField(field)}
							</Form.Item>
						)
					})}
				</div>
				<Form.Item style={{ marginLeft: '17px' }}>
					<Button
						htmlType={'submit'}
						type={'primary'}
						loading={isLoadingAddUser}
						style={{ margin: '5px' }}
					>
						{id ? 'Update' : 'Submit'}
					</Button>
					{!id && (
						<Button htmlType={'reset'} onClick={() => _onReset}>
							{'Reset'}
						</Button>
					)}
				</Form.Item>
			</Form>
		</div>
	)
}

export default LeaveConfigForm
