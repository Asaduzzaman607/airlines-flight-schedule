import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import axios from 'axios'
import comapreWithLodash from 'lodash'

// import components
import { CustomDatePicker, CustomInput } from '../../commonComponents'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'
import { Button, DatePicker, Form } from 'antd'

// import action
import {
	editFlightSeason,
	addFlightSeason,
} from '../../../services/actions/FlightManagementActions/flightSeasonAction'

// flight season api config
import { FLIGHTSEASON } from '../../../config'

// Add edit form function
function AddEditForm() {
	const [rowdata, setRowdata] = useState({})

	const { routePermissions } = useSelector((state) => state.auth)
	const { success, isLoadingAddUser } = useSelector((state) => state.flightSeason)

	// destructure parent path name
	const { parent } = routePermissions

	const { id } = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [form] = Form.useForm()

	// save or submit handler
	const _onFinish = (values) => {
		const transformedValues = {
			...values,
			startDate: values?.startDate?.format('YYYY-MM-DD'),
			endDate: values?.endDate?.format('YYYY-MM-DD'),
			year: values?.year?.format('YYYY'),
		}

		// dispatch to add and edit action
		if (id) {
			transformedValues.id = Number(id)
			if (comapreWithLodash.isEqual(transformedValues, rowdata)) {
				// show success message
				showAlert('success', 'Successfully Updated.')
				return navigate(parent)
			}

			dispatch(editFlightSeason(transformedValues))
		} else {
			dispatch(addFlightSeason(transformedValues))
		}
	}

	//reset form data
	const _onReset = () => {
		form.resetFields()
	}

	// input field structure
	const addEditInfoFeilds = [
		{
			id: 1,
			name: 'name',
			label: 'Seasons Name',
			type: 'text',
			rules: [
				{
					type: 'text',
					message: 'The input is not valid',
				},
				{
					required: true,
					message: 'Please input season name.',
				},
			],
		},
		{
			id: 2,
			name: 'startDate',
			label: 'Start Date',
			type: 'date',
			rules: [
				{
					type: 'date',
					message: 'The input is not valid',
				},
				{
					required: true,
					message: 'Please select start date.',
				},
			],
		},
		{
			id: 3,
			name: 'endDate',
			label: 'End Date',
			type: 'date',
			rules: [
				{
					type: 'date',
					message: 'The input is not valid',
				},
				{
					required: true,
					message: 'Please select end date.',
				},
			],
		},
		{
			id: 4,
			name: 'year',
			label: 'Year',
			type: 'year',
			rules: [
				() => ({
					validator(_, value) {
						const currentYear = dayjs().year()
						const selectedYear = dayjs(value).year()
						if (selectedYear >= currentYear) {
							return Promise.resolve()
						}
						return Promise.reject('Please select a valid year')
					},
				}),
			],
		},
	]

	const inputField = ({ type, label }) => {
		const _components = {
			text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
			date: <CustomDatePicker showTime={false} placeholder={`Select ${label}`} />,
			year: (
				<DatePicker.YearPicker
					picker='year'
					disabledDate={(current) => current && current.year() < dayjs().year()}
				/>
			),
		}

		return _components[type] || null
	}

	useEffect(() => {
		const _fetchFlightSeasonData = async () => {
			try {
				const { data } = await axios.get(FLIGHTSEASON.GET_FLIGHT_SEASON_LIST + id)
				setRowdata(data)
				let newvalues = {
					...data,
					startDate: data?.startDate && dayjs(data.startDate),
					endDate: data?.endDate && dayjs(data.endDate),
					year: data?.year && dayjs(data.year, 'YYYY'),
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
			_fetchFlightSeasonData()
		}
	}, [])

	useEffect(() => {
		if (id) {
			// For edit form , If api response has successfully done then re-direct to parent path
			success && navigate(parent)
		}
	}, [success])

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

export default AddEditForm
