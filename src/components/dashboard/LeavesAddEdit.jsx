import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import dayjs from 'dayjs'
import comapreWithLodash from 'lodash'

// import components
import { Button, DatePicker, Form, Radio } from 'antd'
import { CustomSelectBox, CustomTextArea } from '../commonComponents'

//import actions
import {
	addEmployeeLeave,
	editEmployeeLeaveList,
} from '../../services/actions/CrewManagementActions/employeeLeaveAction'
import { getLeaveTypeList } from '../../services/actions/FlightManagementActions/leaveConfigAction'
import { getErrorMsg, showAlert } from '../../services/actions/commonActions'

//import config
import { DATE_FORMAT, EMPLOYEE } from '../../config'

function LeavesAddEdit() {
	//local state
	const [rowdata, setRowdata] = useState({})

	//global state
	const { cabinCrewdetails, initialValuesLeave } = useSelector((state) => state.dashboard)
	const { routePermissions } = useSelector((state) => state.auth)
	const { success, isLoading } = useSelector((state) => state.employeeLeave)
	const { leaveTypeList } = useSelector((state) => state.leaveConfig)

	// destructure parent path name
	const { parent } = routePermissions

	// destructure params id
	const { id } = useParams()

	//initial navigate
	const navigate = useNavigate()

	//initial action
	const dispatch = useDispatch()

	//form hook
	const [form] = Form.useForm()

	const _onFinish = (values) => {
		const transformedValues = {
			leaveTypeId: values?.leaveTypeId,
			note: values?.note,
			isEmergency: values?.isEmergency ?? false,
			employeeId: cabinCrewdetails?.id,
			fromDate: values?.date?.[0]?.$d && dayjs(values?.date?.[0]?.$d).format(DATE_FORMAT),
			toDate: values?.date?.[1]?.$d && dayjs(values?.date?.[1]?.$d).format(DATE_FORMAT),
		}

		// dispatch to add and edit action
		if (id) {
			transformedValues.id = Number(id)
			const { employeeCode, employeeName, ...finalData } = rowdata
			if (comapreWithLodash.isEqual(transformedValues, finalData)) {
				// show success message
				showAlert('success', 'Successfully Updated.')
				return navigate(parent)
			}

			dispatch(editEmployeeLeaveList(transformedValues))
		} else {
			dispatch(addEmployeeLeave(transformedValues))
		}
	}

	//reset form data
	const _onReset = () => {
		form.resetFields()
	}

	const inputField = ({ type, label, name }) => {
		const _components = {
			text: (
				<CustomTextArea type={'textarea'} placeholder={`Enter ${label}`} maxLength={200} />
			),
			date: (
				<DatePicker.RangePicker
					disabled={[true, false]}
					showTime={false}
					placeholder={`Select ${label}`}
				/>
			),
			leaveType: (
				<CustomSelectBox
					itemList={leaveTypeList}
					label={'name'}
					dataIndex={'id'}
					placeholder={`Select ${label}`}
				/>
			),
			isEmergency: (
				<Radio.Group defaultValue={false} buttonStyle='solid'>
					<Radio.Button value={true}>YES</Radio.Button>
					<Radio.Button value={false}>NO</Radio.Button>
				</Radio.Group>
			),
		}

		return _components[type] || null
	}
	useEffect(() => {
		dispatch(getLeaveTypeList(cabinCrewdetails?.id))
		const _fetchEmployeeLeaveData = async () => {
			try {
				const { data } = await axios.get(EMPLOYEE.GET_EMPLOYEE_LEAVE_LIST + id)
				setRowdata(data)
				let newvalues = {
					...data,
					fromDate: data?.fromDate && dayjs(data?.fromDate),
					toDate: data?.toDate && dayjs(data?.toDate),
				}
				form.setFieldsValue(newvalues)
			} catch (err) {
				console.error(err)
				const errMsg = getErrorMsg(err)

				// show error msg
				showAlert('error', errMsg)
			}
		}

		if (id) {
			_fetchEmployeeLeaveData()
		}
	}, [])

	useEffect(() => {
		if (id) {
			// For edit form , If api response has successfully done then re-direct to parent path
			success && navigate(parent)
		}
	}, [success])

	const validateDatePicker = (_, value) => {
		const [start, end] = value

		if (!start || !end) {
			return Promise.reject('Both start and end dates are required')
		}
		if (!end) {
			return Promise.reject('End dates are required')
		}

		return Promise.resolve()
	}
	// input field structure
	const addEditInfoFeilds = [
		{
			id: 1,
			name: 'leaveTypeId',
			label: 'Leave Type',
			type: 'leaveType',
			rules: [
				{
					type: 'select',
					message: 'Leave Type is not valid',
				},
				{
					required: true,
					message: 'Select Leave Type.',
				},
			],
		},
		{
			id: 2,
			name: 'isEmergency',
			label: 'Emergency Leave',
			type: 'isEmergency',
		},
		{
			id: 3,
			name: 'date',
			label: 'Leave Dates',
			type: 'date',
			rules: [
				{
					required: true,
					validator: validateDatePicker,
				},
			],
		},
		{
			id: 4,
			name: 'note',
			label: 'Remarks',
			type: 'text',
		},
	]

	return (
		<Form
			validateTrigger={'onChange'}
			form={form}
			onFinish={_onFinish}
			scrollToFirstError
			layout={'vertical'}
			autoComplete={'off'}
			initialValues={
				initialValuesLeave ?? {
					date: [
						cabinCrewdetails?.flightDate
							? dayjs(cabinCrewdetails?.flightDate, DATE_FORMAT)
							: null,
						null,
					],
				}
			}
		>
			<div className={'grid sm:grid-cols-2 gap-3 sm:p-5'}>
				{addEditInfoFeilds?.map((field) => {
					return (
						<div className={field.id > 2 ? 'col-span-2' : ''}>
							<Form.Item
								key={field.id}
								name={field.name}
								label={field.label}
								rules={field.rules}
								dependencies={field.dependencies ?? []}
								disabled
							>
								{inputField(field)}
							</Form.Item>
						</div>
					)
				})}
			</div>
			<Form.Item className={'flex justify-end'}>
				{!id && (
					<Button htmlType={'reset'} danger onClick={() => _onReset}>
						{'Reset'}
					</Button>
				)}
				<Button
					htmlType={'submit'}
					type={'primary'}
					loading={isLoading}
					style={{ margin: '5px' }}
				>
					{id ? 'Update' : 'Submit'}
				</Button>
			</Form.Item>
		</Form>
	)
}

export default LeavesAddEdit
