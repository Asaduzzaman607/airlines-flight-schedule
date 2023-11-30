import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { Button, Form, Input } from 'antd'
import { CustomSelect } from '../../commonComponents'

// import actions
import {
	setFirstPhaseValues,
	setSelectedIndex,
} from '../../../services/reducers/FlightManagementReducers/flightScheduleReducer'
import { useFetch } from '../../../services/hooks'

// import flight api
import { FLIGHTSEASON } from '../../../config'

const { Item } = Form

const flightTypeOptions = [
	{
		id: 1,
		key: 1,
		value: 1,
		label: 'One way',
	},
	{
		id: 2,
		key: 2,
		value: 2,
		label: 'Return',
	},
]

const monthDates = [
	{
		id: 32,
		label: 'Everyday',
		value: 'everyday',
	},
	{ id: 1, label: '1', value: 1 },
	{ id: 2, label: '2', value: 2 },
	{ id: 3, label: '3', value: 3 },
	{ id: 4, label: '4', value: 4 },
	{ id: 5, label: '5', value: 5 },
	{ id: 6, label: '6', value: 6 },
	{ id: 7, label: '7', value: 7 },
	{ id: 8, label: '8', value: 8 },
	{ id: 9, label: '9', value: 9 },
	{ id: 10, label: '10', value: 10 },
	{ id: 11, label: '11', value: 11 },
	{ id: 12, label: '12', value: 12 },
	{ id: 13, label: '13', value: 13 },
	{ id: 14, label: '14', value: 14 },
	{ id: 15, label: '15', value: 15 },
	{ id: 16, label: '16', value: 16 },
	{ id: 17, label: '17', value: 17 },
	{ id: 18, label: '18', value: 18 },
	{ id: 19, label: '19', value: 19 },
	{ id: 20, label: '20', value: 20 },
	{ id: 21, label: '21', value: 21 },
	{ id: 22, label: '22', value: 22 },
	{ id: 23, label: '23', value: 23 },
	{ id: 24, label: '24', value: 24 },
	{ id: 25, label: '25', value: 25 },
	{ id: 26, label: '26', value: 26 },
	{ id: 27, label: '27', value: 27 },
	{ id: 28, label: '28', value: 28 },
	{ id: 29, label: '29', value: 29 },
	{ id: 30, label: '30', value: 30 },
	{ id: 31, label: '31', value: 31 },
]

const weekDays = [
	{
		id: 1,
		label: 'Everyday',
		value: 'everyday',
	},
	{
		id: 2,
		label: 'Saturday',
		value: 'SATURDAY',
	},
	{
		id: 3,
		label: 'Sunday',
		value: 'SUNDAY',
	},
	{
		id: 4,
		label: 'Monday',
		value: 'MONDAY',
	},
	{
		id: 5,
		label: 'Tuesday',
		value: 'TUESDAY',
	},
	{
		id: 6,
		label: 'Wednesday',
		value: 'WEDNESDAY',
	},
	{
		id: 7,
		label: 'Thursday',
		value: 'THURSDAY',
	},
	{
		id: 8,
		label: 'Friday',
		value: 'FRIDAY',
	},
]

const _dayOptionsObj = {
	dates: monthDates,
	days: weekDays,
}

const SelectSeason = () => {
	const [dayOptions, setDayOptions] = useState(weekDays)
	const [seasonOptions, setSeasonOptions] = useState([])
	const [form] = Form.useForm()
	const dispatch = useDispatch()

	const days = Form.useWatch(['selectedDayOrDate', 'days'], form)
	const selectedDayOrDateType = Form.useWatch(
		['selectedDayOrDate', 'selectedDayOrDateType'],
		form
	)

	const { firstPhaseValues } = useSelector((state) => state.flightSchedule)

	const { data: _seasonData, isLoading: isSeasonLoading } = useFetch(
		FLIGHTSEASON.GET_FLIGHT_SEASON_LIST,
		{ page: 0, size: 500 }
	)

	//
	useEffect(() => {
		form.setFieldsValue(firstPhaseValues)
	}, [form, firstPhaseValues])

	useEffect(() => {
		// check if model is not valid
		if (_seasonData?.model?.length) {
			const _transformSeasonOptions = _seasonData.model.map((item) => ({
				label: item?.name ?? 'N/A',
				value: item?.id ?? -1,
			}))
			setSeasonOptions(_transformSeasonOptions)
		}
	}, [_seasonData])

	// check if selectedDayOrDateType has updated
	useEffect(() => {
		setDayOptions(
			selectedDayOrDateType === 'dates'
				? monthDates
				: selectedDayOrDateType === 'days'
				? weekDays
				: []
		)
	}, [selectedDayOrDateType])

	// check if, days have updated
	useEffect(() => {
		const toggleDisable = (isDisabled) => {
			// check if days options is valid
			if (dayOptions?.length) {
				return dayOptions.map((item) => ({
					...item,
					disabled: item?.value === 'everyday' ? false : isDisabled,
				}))
			}
			return []
		}
		if (days?.length && days.some((item) => item === 'everyday')) {
			setDayOptions(() => toggleDisable(true))

			// remove other options from form value
			form.setFieldsValue({
				selectedDayOrDate: {
					days: ['everyday'],
				},
			})
		} else {
			setDayOptions(() => toggleDisable(false))
		}
		// eslint-disable-next-line
	}, [days])

	// handle next button
	const _continueToNextPhase = (values) => {
		const _updatedValues = {
			...values,
			season_details: seasonOptions?.find((item) => item?.value === values?.season),
			trip_type_details: flightTypeOptions?.find((item) => item?.value === values?.tripType),
			selected_days:
				values?.selectedDayOrDate?.days[0] === 'everyday'
					? _dayOptionsObj[selectedDayOrDateType]
							?.filter((item) => item?.value !== 'everyday')
							.map((item) => item?.value)
					: values?.selectedDayOrDate?.days,
		}

		dispatch(setSelectedIndex(1))
		dispatch(setFirstPhaseValues(_updatedValues))
	}

	// handle on field change
	const _handleOnFieldChange = (changedFields) => {
		const { value } = changedFields[0]

		// check if selectedDayOrDate has updated, then update dayOptions and set field values accordingly
		if (value === 'days' || value === 'dates') {
			setDayOptions(() => (value === 'days' ? weekDays : monthDates))

			// remove other options from form value
			form.setFieldsValue({
				selectedDayOrDate: {
					days: [],
				},
			})
		}
	}
	return (
		<div className={'bg-white shadow rounded p-2'}>
			<Form
				form={form}
				autoComplete={'off'}
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 16,
				}}
				initialValues={firstPhaseValues}
				onFinish={_continueToNextPhase}
				onFieldsChange={_handleOnFieldChange}
			>
				<Item
					name={'season'}
					label={'Season'}
					rules={[
						{
							required: true,
							message: 'Season is required',
						},
					]}
					initialValue={firstPhaseValues?.season}
				>
					<CustomSelect
						options={seasonOptions}
						placeholder={'Select Season'}
						showSearch={true}
						loading={isSeasonLoading}
					/>
				</Item>
				<Item
					name={'tripType'}
					label={'Trip type'}
					rules={[
						{
							required: true,
							message: 'Trip type is required',
						},
					]}
				>
					<CustomSelect
						options={flightTypeOptions}
						placeholder={'Select trip type'}
						showSearch={true}
					/>
				</Item>
				<Item
					label={'Select days'}
					requiredMark={true}
					name={'selectedDayOrDate'}
					rules={[
						{
							required: true,
						},
					]}
				>
					<Input.Group compact={true}>
						<Item name={['selectedDayOrDate', 'selectedDayOrDateType']} noStyle>
							<CustomSelect
								placeholder={'Select day/date'}
								width={140}
								options={[
									{
										id: 1,
										label: 'Days',
										value: 'days',
									},
									{
										id: 1,
										label: 'Dates',
										value: 'dates',
									},
								]}
							/>
						</Item>
						<Item
							name={['selectedDayOrDate', 'days']}
							noStyle={true}
							rules={[
								{
									required: true,
									message: `${
										selectedDayOrDateType
											? `Please select specific ${selectedDayOrDateType}`
											: 'This field is required'
									}`,
								},
							]}
						>
							<CustomSelect
								mode={'multiple'}
								showArrow={true}
								width={300}
								placeholder={'Select specific days'}
								options={_dayOptionsObj[selectedDayOrDateType]}
							/>
						</Item>
					</Input.Group>
				</Item>
				<Item label={' '} colon={false}>
					<Button type={'primary'} htmlType={'submit'}>
						{'Next'}
					</Button>
				</Item>
			</Form>
		</div>
	)
}

export default SelectSeason
