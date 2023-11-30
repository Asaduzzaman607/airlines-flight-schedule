import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import { Input, Form, Button, Space } from 'antd'
import { CustomSelect } from '../../commonComponents'
import { MultistopFields } from './index'

// import actions
import {
	getAircraftTypeList,
	getAircraftByTypeId,
} from '../../../services/actions/FlightManagementActions/flightScheduleAction'
import {
	setDynamicAircraftListOption,
	setSelectedIndex,
	setSecondPhaseValues,
} from '../../../services/reducers/FlightManagementReducers/flightScheduleReducer'

const FlightDetailsForm = () => {
	const [flightNo, setFlightNo] = useState('')
	const [form] = Form.useForm()
	const aircraftTypeId = Form.useWatch('aircraftTypeId', form)
	const legType = Form.useWatch('legType', form)

	// get value from redux
	const {
		aircraftTypeList,
		isAircraftTypeListLoading,
		dynamicAircraftListOption,
		aircraftList,
		secondPhaseValues,
	} = useSelector((state) => state.flightSchedule)

	const dispatch = useDispatch()

	// get aircraft list
	useEffect(() => {
		// get aircraft list
		dispatch(getAircraftTypeList())
	}, [dispatch])

	useEffect(() => {
		const _secondPhaseValues = {
			...secondPhaseValues,
			legDepArr:
				secondPhaseValues?.legDepArr?.length > 0 &&
				secondPhaseValues?.legDepArr.map((item) => ({
					legField: {
						id: item?.legField?.id ?? null,
						leg: item?.legField?.leg,
						depTime: item?.legField?.depTime && dayjs(item?.legField?.depTime, 'HHmm'),
						arrTime: item?.legField?.arrTime && dayjs(item?.legField?.arrTime, 'HHmm'),
					},
				})),
		}
		form.setFieldsValue(_secondPhaseValues)
	}, [form, secondPhaseValues, dispatch])

	// check if aircraft got updated
	useEffect(() => {
		if (aircraftTypeId && dynamicAircraftListOption?.length > 0) {
			dispatch(getAircraftByTypeId({ aircraftTypeId }))
		}
	}, [aircraftTypeId, dispatch])

	// check if aircraft list has updated
	useEffect(() => {
		const temp = [...dynamicAircraftListOption]

		if (secondPhaseValues?.legDepArr?.length > 0) {
			secondPhaseValues?.legDepArr.forEach((flightItem, index) => {
				const selectedAircraftDetails = aircraftList.find(
					(i) => flightItem?.legField?.leg === i?.id
				)
				if (selectedAircraftDetails) {
					const { fromAirportId: selectedDepId, toAirportId: selectedArrId } =
						selectedAircraftDetails

					// add next restrictedArrLegIdList
					temp[index + 1] = {
						...temp[index + 1],
						restrictedArrLegIdList: {
							...temp[index]?.restrictedArrLegIdList,
							[selectedDepId]: selectedDepId,
						},
					}

					// filter out from aircraft list
					const _nextAircraftList = aircraftList.filter((item) => {
						return (
							selectedDepId !== item?.fromAirportId &&
							selectedDepId !== item?.toAirportId &&
							selectedArrId !== item?.toAirportId &&
							selectedArrId === item?.fromAirportId &&
							temp[index + 1]?.restrictedArrLegIdList[item?.toAirportId] !==
								item?.toAirportId
						)
					})

					// add next restrictedArrLegIdList
					temp[index + 1] = {
						...temp[index + 1],
						aircraftList: _nextAircraftList,
					}
				}
			})
		}
		dispatch(setDynamicAircraftListOption(temp))
	}, [aircraftList])

	function isNextDay(depTime, arrTime) {
		// check if dep time and arr time available
		const departure = dayjs(depTime, 'HH:mm')
		const arrival = dayjs(arrTime, 'HH:mm')

		// Check if arrival is before departure to handle cases where arrTime is on the next day
		if (arrival.isBefore(departure)) {
			return true
		}

		return false
	}

	// handle on field change
	const _handleOnFieldChange = (changedFields) => {
		const { name } = changedFields[0]

		if (name[0] === 'legType') {
			_updateMultiLegFields()
		}
	}

	// update leg options when multi leg is selected
	const _updateMultiLegFields = () => {
		// get legDepArr from FORM
		const legDepArr = form.getFieldValue('legDepArr')
		form.setFieldsValue({ legDepArr: [legDepArr[0]] })
	}

	// calculate duration between start time and end time
	const calculateDuration = (startTime, endTime) => {
		if (!startTime || !endTime) {
			return 'N/A'
		}
		const start = dayjs(startTime, 'HH:mm')
		const end = dayjs(endTime, 'HH:mm')
		let duration = end.diff(start, 'minute')

		if (duration < 0) {
			duration = 24 * 60 + duration
		}

		const hours = Math.floor(duration / 60)
		const minutes = duration % 60

		let result = ''
		if (hours > 0) {
			result += `${hours}h `
		}
		if (minutes > 0) {
			result += `${minutes}m`
		}

		return result.trim()
	}

	// handle on finish
	const _handleOnFinish = (values) => {
		const _updatedValues = {
			...values,
			aircraft_type: aircraftTypeList?.find((item) => item?.value === values?.aircraftTypeId),
			legDepArr: values?.legDepArr.map((item) => {
				const {
					legField: { arrTime, depTime, leg },
				} = item

				return {
					legField: {
						arrTime: arrTime && arrTime.format('HH:mm'),
						depTime: depTime && depTime.format('HH:mm'),
						leg_details: dynamicAircraftListOption[0]?.aircraftList?.find(
							(item) => item?.value === leg
						),
						leg,
						duration: calculateDuration(depTime, arrTime),
						flightNo: 'BS ' + values?.flightNo,
						isNextDay: isNextDay(depTime, arrTime),
					},
				}
			}),
		}
		dispatch(setSecondPhaseValues(_updatedValues))
		dispatch(setSelectedIndex(2))
	}

	// handle leg on change
	const handleLegOnChange = (value, option, index) => {
		const { fromAirportId: selectedDepId, toAirportId: selectedArrId } = option

		// remove next index values if there any
		let temp = [...dynamicAircraftListOption]

		// add next restrictedArrLegIdList
		temp[index + 1] = {
			...temp[index + 1],
			restrictedArrLegIdList: {
				...temp[index]?.restrictedArrLegIdList,
				[selectedDepId]: selectedDepId,
			},
		}

		// filter out from aircraft list
		const _nextAircraftList = aircraftList.filter((item) => {
			return (
				selectedDepId !== item?.fromAirportId &&
				selectedDepId !== item?.toAirportId &&
				selectedArrId !== item?.toAirportId &&
				selectedArrId === item?.fromAirportId &&
				temp[index + 1]?.restrictedArrLegIdList[item?.toAirportId] !== item?.toAirportId
			)
		})

		// add next restrictedArrLegIdList
		temp[index + 1] = {
			...temp[index + 1],
			aircraftList: _nextAircraftList,
		}

		dispatch(setDynamicAircraftListOption(temp))
	}

	// handle on remove leg
	const handleOnRemoveLeg = (remove, name, removedIndex) => {
		// remove leg
		remove(name)

		// remove array values from this index to end, then set updated array list to redux
		const _updatedAircraftList = dynamicAircraftListOption.filter(
			(_, index) => index <= removedIndex
		)
		dispatch(setDynamicAircraftListOption(_updatedAircraftList))

		// remove values from form
		const legDepArr = form.getFieldValue('legDepArr')
		const updatedFormLegs = legDepArr.map((item, index) => {
			if (index < removedIndex) {
				return item
			}

			return null
		})
		form.setFieldsValue({ legDepArr: updatedFormLegs })
	}

	// handle previous button action
	const _handlePrevButtonAction = () => {
		// get current form data from FORM
		const formData = form.getFieldsValue()
		const _transformedFormData = {
			...formData,
			legDepArr:
				formData?.legDepArr?.length > 0 &&
				formData?.legDepArr.map((item) => ({
					legField: {
						leg: item?.legField?.leg,
						depTime: item?.legField?.depTime && item?.legField?.depTime.format('HH:mm'),
						arrTime: item?.legField?.arrTime && item?.legField?.arrTime.format('HH:mm'),
					},
				})),
		}

		// get back to previous form and set current form data to secont phase data
		dispatch(setSelectedIndex(0))
		dispatch(setSecondPhaseValues(_transformedFormData))
	}

	return (
		<div className={'bg-white shadow rounded p-2'}>
			<Form
				form={form}
				autoComplete={'off'}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={{
					...secondPhaseValues,
					legDepArr:
						secondPhaseValues?.legDepArr?.length > 0 &&
						secondPhaseValues?.legDepArr.map((item) => ({
							legField: {
								leg: item?.legField?.leg,
								depTime:
									item?.legField?.depTime &&
									dayjs(item?.legField?.depTime, 'HHmm'),
								arrTime:
									item?.legField?.arrTime &&
									dayjs(item?.legField?.arrTime, 'HHmm'),
							},
						})),
				}}
				onFieldsChange={_handleOnFieldChange}
				onFinish={_handleOnFinish}
			>
				<Form.Item
					name={'flightNo'}
					label={'Flight No'}
					rules={[
						{
							required: true,
							message: 'Flight no. is required.',
						},
						{
							len: 3,
							message: 'Flight no. must be 3 digit numbers',
						},
						{
							// eslint-disable-next-line
							pattern: '^(?!d).+$',
							message: 'Flight no. must contain numbers only',
						},
						{
							validator: (_, value) => {
								if (value >= 0 || !value) {
									return Promise.resolve()
								}
								return Promise.reject(new Error('Invalid Flight no.'))
							},
						},
					]}
				>
					<Input
						style={{ width: 200 }}
						addonBefore={'BS'}
						value={flightNo}
						onChange={(e) => setFlightNo(e.target.value)}
					/>
				</Form.Item>
				<Form.Item
					name={'aircraftTypeId'}
					label={'Aircraft type'}
					rules={[
						{
							required: true,
							message: 'Aircraft type is required',
						},
					]}
				>
					<CustomSelect
						options={aircraftTypeList}
						placeholder={'Select aircraft type.'}
						loading={isAircraftTypeListLoading}
					/>
				</Form.Item>
				<MultistopFields
					legType={legType === 'multileg'}
					handleLegOnChange={handleLegOnChange}
					handleOnRemoveLeg={handleOnRemoveLeg}
				/>
				<Form.Item label={' '} colon={false}>
					<Space>
						<Button htmlType={'submit'} type={'primary'}>
							{'Preview'}
						</Button>
						<Button type={'default'} onClick={_handlePrevButtonAction}>
							{'Previous'}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</div>
	)
}

export default FlightDetailsForm
