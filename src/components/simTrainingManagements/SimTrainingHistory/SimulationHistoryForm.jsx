import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'

// import componets
import { Button, Form, Select, DatePicker, Checkbox, Alert } from 'antd'

// import action
import {
	addEmployessToSim,
	getEmployeeListOfSim,
	getEmployeeOfSimHistory,
	updateEmployeeOfSimHistory,
} from '../../../services/actions/SimTrainingManagementActions/simulationHistoryAction'

function SimulationHistoryForm() {
	const [initialFromValues, setInitialFromValues] = useState([])

	const { success, isLoading } = useSelector((state) => state.simulationHistory)

	const { routePermissions } = useSelector((state) => state.auth)
	// get initial datas from simplan state
	const { simPlanRowData, simPlanHistoryRowData } = useSelector((state) => state.simPlan)
	// destructure parent path name
	const { parent } = routePermissions
	//destructure current pathname
	const { pathname } = useLocation()

	const { id } = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [form] = Form.useForm()

	//check the actions
	const isUpdate = pathname?.includes('update')
	const isAdd = pathname?.includes('add')

	// save or submit handler
	const _onFinish = (values) => {
		// dispatch to add and edit action
		const employees = values?.employees
			?.filter((item) => item?.isChecked)
			?.map((item) => {
				const { simPlanId, simulationDate, employeeId } = item
				return {
					simPlanId,
					simulationDate: dayjs(simulationDate).format('YYYY-MM-DD'),
					employeeId,
				}
			})
		if (employees.length && isAdd) dispatch(addEmployessToSim(id, employees))
		if (employees.length && isUpdate) dispatch(updateEmployeeOfSimHistory(id, employees[0]))
	}

	//reset form data
	const _onReset = () => {
		form.resetFields()
	}

	useEffect(() => {
		if (id) {
			// For add, edit form , If api response has successfully done then re-direct to parent path
			success && navigate(parent)
		}
	}, [success])

	useEffect(() => {
		if (isAdd) dispatch(getEmployeeListOfSim(id))
		if (isUpdate) dispatch(getEmployeeOfSimHistory(id))
	}, [])

	useEffect(() => {
		if (isAdd)
			setInitialFromValues({
				employees: simPlanRowData?.map((item) => ({
					isChecked: true,
					simPlanId: id,
					employeeId: item?.id,
					simulationDate: item?.simulationDate ? dayjs(item?.simulationDate) : '',
				})),
			})
		else if (isUpdate)
			setInitialFromValues({
				employees: simPlanHistoryRowData?.map((item) => ({
					isChecked: true,
					simPlanId: id,
					employeeId: item?.employeeId,
					simulationDate: item?.simulationDate ? dayjs(item?.simulationDate) : '',
				})),
			})
	}, [simPlanRowData, simPlanHistoryRowData])

	// if initial value empty then reset form values
	useEffect(() => {
		if (!initialFromValues.length) form.resetFields()
	}, [initialFromValues])
	// check employees is available or not
	if (!initialFromValues?.employees?.length) {
		return (
			<div className={'bg-white p-3 rounded-md'}>
				<Alert message='Sim Plan Not Avaiable' type='error' closable />
			</div>
		)
	}
	return (
		<div className={'bg-white py-3 rounded-md'}>
			<Form
				form={form}
				onFinish={_onFinish}
				scrollToFirstError
				layout={'vertical'}
				autoComplete={'off'}
				initialValues={initialFromValues}
			>
				<Form.List name='employees'>
					{(fields, { add, remove }) => (
						<div className={'grid gap-2 p-5'}>
							{fields.map((field, index) => (
								<div
									key={field.key}
									className={'flex flex-col sm:flex-row sm:gap-3 sm:items-center'}
								>
									<Form.Item
										name={[field.name, 'isChecked']}
										valuePropName='checked'
									>
										<Checkbox style={{ width: '100%' }} disabled={isUpdate} />
									</Form.Item>
									<Form.Item name={[field.name, 'employeeId']}>
										<Select
											style={{ width: '220px' }}
											showSearch
											placeholder='Select employee'
											options={
												isAdd
													? simPlanRowData?.map((item) => ({
															value: item?.id,
															label: <div>{item?.name}</div>,
															disabled: true,
													  }))
													: isUpdate
													? simPlanHistoryRowData?.map((item) => ({
															value: item?.employeeId,
															label: <div>{item?.employeeName}</div>,
															disabled: true,
													  }))
													: []
											}
										/>
									</Form.Item>
									<Form.Item
										name={[field.name, 'simulationDate']}
										rules={[
											({ getFieldValue }) => ({
												required: getFieldValue([
													'employees',
													index,
													'isChecked',
												]),
												message: 'Simulation Date is required',
											}),
										]}
									>
										<DatePicker
											placeholder='Simulation Date'
											style={{ width: '220px' }}
										/>
									</Form.Item>
								</div>
							))}
						</div>
					)}
				</Form.List>
				<Form.Item style={{ marginLeft: '17px' }}>
					<Button
						htmlType={'submit'}
						type={'primary'}
						loading={isLoading}
						style={{ margin: '5px' }}
					>
						{isUpdate ? 'Update' : isAdd ? 'Submit' : ''}
					</Button>
					{isAdd && (
						<Button htmlType={'reset'} onClick={() => _onReset}>
							{'Reset'}
						</Button>
					)}
				</Form.Item>
			</Form>
		</div>
	)
}

export default SimulationHistoryForm
