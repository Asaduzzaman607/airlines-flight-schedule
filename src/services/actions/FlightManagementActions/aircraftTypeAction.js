import axios from 'axios'

// import api config
import { AIRCRAFT_TYPE } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setAircraftTypeList,
	setAircraftTypeDetails,
	setSuccess,
	setPagination,
} from '../../reducers/FlightManagementReducers/aircraftTypeReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform aircraft type list
const transformUserList = (items) => {
	// check if aircraftType is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get aircraft type list
const getAircraftTypeList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get aircraft type
			const { data } = await axios.get(
				AIRCRAFT_TYPE.GET_AIRCRAFT_TYPE_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set aircraft type to aircraftTypeList
			const aircraftTypeList = transformUserList(data?.model)

			dispatch(setAircraftTypeList(aircraftTypeList))

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

// get aircraft type search list
const getAircraftTypeSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get aircraft type
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				query: searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}

			const { data } = await axios.post(
				AIRCRAFT_TYPE.GET_AIRCRAFT_TYPE_SEARCH + PARAMS,
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

			// set aircraft type to aircraftTypeList
			const aircraftTypeList = transformUserList(data?.model)
			dispatch(setAircraftTypeList(aircraftTypeList))

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

// get aircraft type row details
const getAircraftTypeDetails = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			dispatch(setAircraftTypeDetails(params))
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
		}
	}
}

// add aircraft type
const addAircraftType = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add aircraft type api call
			const { data } = await axios.post(AIRCRAFT_TYPE.ADD_AIRCRAFT_TYPE, params)
			// show success message
			dispatch(setIsLoadingAddUser(false))
			showAlert('success', data?.message ?? 'Successfully Added.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// edit aircraft type
const editAircraftType = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit aircraft type api call
			const { data } = await axios.put(AIRCRAFT_TYPE.ADD_AIRCRAFT_TYPE + params.id, params)

			dispatch(setSuccess(true))
			dispatch(setIsLoadingAddUser(false))

			showAlert('success', data?.message ?? 'Successfully Updated.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// update aircraft type status
const updateAircraftTypeStatus = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete aircraft type api call
			const { data } = await axios.patch(AIRCRAFT_TYPE.ADD_AIRCRAFT_TYPE + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getAircraftTypeSearchList(pageWithSize))
			dispatch(setIsLoadingAddUser(false))

			showAlert('success', data?.message ?? 'Successfully Deleted.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// export actions
export {
	getAircraftTypeList,
	addAircraftType,
	editAircraftType,
	updateAircraftTypeStatus,
	getAircraftTypeDetails,
	getAircraftTypeSearchList,
}
