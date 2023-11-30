import axios from 'axios'

// import api config
import { FLIGHT_SCHEDULE } from '../../../config'

// import actions
import {
	setIsLoading,
	setFlightScheduleList,
	setFilterdFlightScheduleList,
	setFlightScheduleDetailsList,
	setSuccess,
	setPagination,
	setIsAircraftTypeListLoading,
	setAircraftTypeList,
	setAircraftList,
	setIsAircraftListLoading,
	setDynamicAircraftListOption,
	setFirstPhaseValues,
	setSecondPhaseValues,
} from '../../reducers/FlightManagementReducers/flightScheduleReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// check item list
const transformItemList = (items) => {
	// check if flight info is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get flight schedule list
const getFlightScheduleList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get flight schedule
			const { data } = await axios.get(
				FLIGHT_SCHEDULE.GET_FLIGHT_SCHEDULE_LIST +
					`?page=${page.page}&size=${page.pageSize}`
			)
			dispatch(setSuccess(false))

			// set user pagination
			dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
					currentPageSize: page.pageSize,
				})
			)
			// dispatch(setPagination({ currentPage: data?.currentPage, pageSize: data?.totalElements, totalPage: data?.totalPages, currentPageSize: searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize }))

			// set flight schedule to FlightSchedule List
			const FlightScheduleList = transformItemList(data?.model)
			dispatch(setFlightScheduleList(FlightScheduleList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false))
		} catch (error) {
			console.error(error)
			dispatch(setSuccess(false))

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

// get FlightSchedule search list
const getFlightScheduleSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get FlightSchedule
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
                    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
			}
			const { data } = await axios.post(
				FLIGHT_SCHEDULE.GET_FLIGHT_SCHEDULE_LIST + 'search' + PARAMS,
				PAYLOAD
			)

			dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
					currentPageSize:
						searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize,
				})
			)

			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setFlightScheduleList(newList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false))
		} catch (error) {
			console.error(error)
			dispatch(setSuccess(false))

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

// get flight schedule row details
const getFlightScheduleDetails = (id) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// get flight schedule list
			const { data } = await axios.get(FLIGHT_SCHEDULE.GET_FLIGHT_SCHEDULE_LIST + id)
			dispatch(setFlightScheduleDetailsList(data))
			dispatch(setIsLoading(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoading(false))
		}
	}
}

// add flight schedule
const addFlightSchedule = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add flight schedule api call
			const { data } = await axios.post(FLIGHT_SCHEDULE.ADD_FLIGHT_SCHEDULE, params)

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
			dispatch(setIsLoading(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error message
			showAlert('error', errMsg)
		}
	}
}

// get filtered schedule
const getFilteredFlightSchedule = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// filtered schedule api call
			const { data } = await axios.post(FLIGHT_SCHEDULE.GET_FILTERED_SCHEDULE, params)
			dispatch(setFilterdFlightScheduleList(data?.model))
			// show success message
			// showAlert('success', 'Successfully Added !!')
			dispatch(setIsLoading(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error message
			showAlert('error', errMsg)
		}
	}
}

// edit flight schedule
const editFlightScheduleList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit flight schedule api call
			const { data } = await axios.put(
				FLIGHT_SCHEDULE.ADD_FLIGHT_SCHEDULE + params.id,
				params
			)

			dispatch(setSuccess(true))
			dispatch(setIsLoading(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Updated.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			showAlert('error', errMsg)
		}
	}
}

// update flight schedule status
const deleteFlightSchedule = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// delete flight schedule api call
			const { data } = await axios.patch(
				FLIGHT_SCHEDULE.ADD_FLIGHT_SCHEDULE + id + '?statusId=0'
			)

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getFlightScheduleSearchList(pageWithSize))
			dispatch(setIsLoading(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Deleted.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// get aircraft type list
const getAircraftTypeList = () => {
	return async (dispatch) => {
		// start loading
		dispatch(setIsAircraftTypeListLoading(true))
		try {
			const {
				data: { model },
			} = await axios.get(FLIGHT_SCHEDULE.GET_AIRCRAFT_TYPE, {
				params: { page: 0, size: 500 },
			})

			// transform aircraft type list
			const _transformAircraftTypeList = (aircraftTypeList) => {
				// check if aircraft type list is invalid
				if (!aircraftTypeList || !aircraftTypeList.length) {
					return []
				}
				return aircraftTypeList.map((item) => ({
					id: item?.id ?? -1,
					label: item?.name ?? 'N/A',
					value: item?.id ?? -1,
				}))
			}

			const _aircraftTypeList = _transformAircraftTypeList(model)

			// set aircraft type list into redux
			dispatch(setAircraftTypeList(_aircraftTypeList))
		} catch (err) {
			console.error(err)

			// get error msg and show error alert
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		} finally {
			// stop loading
			dispatch(setIsAircraftTypeListLoading(false))
		}
	}
}

// get aircraft type list
const getAircraftByTypeId = (params) => {
	return async (dispatch) => {
		// start loading
		dispatch(setIsAircraftListLoading(true))
		try {
			const {
				data: { model },
			} = await axios.post(FLIGHT_SCHEDULE.GET_AIRCRAFT_LIST, params, {
				params: { page: 0, size: 500 },
			})

			// transform aircraft list
			const _transformAircraftList = (aircraftList) => {
				// check if aircraft type list is invalid
				if (!aircraftList || !aircraftList.length) {
					return []
				}
				return aircraftList.map((item) => ({
					...item,
					label: item?.leg ?? 'N/A',
					value: item?.id ?? -1,
					departureLeg: item?.leg && item.leg.split(' ')[0],
					arrivalLeg: item?.leg && item.leg.split(' ')[2],
				}))
			}

			const _aircraftList = _transformAircraftList(model)

			const dynamicAircraftObj = {
				restrictedArrLegIdList: {},
				aircraftList: _aircraftList,
			}

			// set aircraft list into redux
			dispatch(setAircraftList(_aircraftList))

			// set aircraft list for dynamic options
			dispatch(setDynamicAircraftListOption([dynamicAircraftObj]))
		} catch (err) {
			console.error(err)

			// get error msg and show error alert
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		} finally {
			// stop loading
			dispatch(setIsAircraftListLoading(false))
		}
	}
}

// Get flight details
const getFlightDetails = (id) => {
	return async (dispatch) => {
		try {
			const { data } = await axios.get(FLIGHT_SCHEDULE.GET_FLIGHT_DETAILS, { params: { id } })
			const { config, details } = data

			// check if config and details are value or else show error alert
			if (config && details) {
				const firstPhaseValues = {
					...config,
					selectedDayOrDate: {
						selectedDayOrDateType: config?.selectedDayOrDate?.selectedDayOrDateType,
						days:
							config?.selectedDayOrDate?.selectedDayOrDateType === 'days' &&
							config?.selectedDayOrDate?.days?.length === 7
								? ['everyday']
								: config?.selectedDayOrDate?.selectedDayOrDateType === 'dates' &&
								  config?.selectedDayOrDate?.dates?.length === 31
								? ['everyday']
								: config?.selectedDayOrDate?.[
										config?.selectedDayOrDate?.selectedDayOrDateType
								  ],
					},
				}

				// dispatch(setDynamicAircraftListOption(temp))
				dispatch(setFirstPhaseValues(firstPhaseValues))
				dispatch(
					setSecondPhaseValues({
						...details,
						aircraftTypeId: details?.aircraftType,
					})
				)
			} else {
				showAlert('error', 'Something went wrong.')
			}
		} catch (err) {
			console.log('entered in error block')
			console.error(err)

			// get error msg and show error alert
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		}
	}
}

// export actions
export {
	getFlightScheduleList,
	getFilteredFlightSchedule,
	addFlightSchedule,
	editFlightScheduleList,
	deleteFlightSchedule,
	getFlightScheduleDetails,
	getFlightScheduleSearchList,
	getAircraftTypeList,
	getAircraftByTypeId,
	getFlightDetails,
}
