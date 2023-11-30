import axios from 'axios'

// import api config
import { AIRCRAFT } from '../../../config'

// import actions and reducers
import {
	setIsLoading,
	setIsLoadingAddUser,
	setAircraftList,
	setAircraftDetails,
	setSuccess,
	setPagination,
} from '../../reducers/FlightManagementReducers/aircraftReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform aircraft list
const transformList = (items) => {
	// check if aircraftType is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get aircraft list
const getAircraftList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get aircraft
			const { data } = await axios.get(
				AIRCRAFT.GET_AIRCRAFT_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set aircraft to aircraftList
			const aircraftList = transformList(data?.model)
			dispatch(setAircraftList(aircraftList))

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

// get aircraft search list
const getAircraftSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get aircraft
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
                    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
			}
			const { data } = await axios.post(
				AIRCRAFT.GET_AIRCRAFT_LIST + '/search' + PARAMS,
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
			const newList = transformList(data?.model)
			dispatch(setAircraftList(newList))

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

// get aircraft row details
const getAircraftDetails = (id) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			const { data } = await axios.get(AIRCRAFT.GET_AIRCRAFT_LIST + '/' + id)
			dispatch(setAircraftDetails(data))
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
		}
	}
}

// add aircraft
const addAircraft = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add aircraft api call
			const { data } = await axios.post(AIRCRAFT.ADD_AIRCRAFT, params)

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// edit aircraft
const editAircraft = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit aircraft api call
			const { data } = await axios.put(AIRCRAFT.ADD_AIRCRAFT + '/' + params.id, params)

			showAlert('success', data?.message ?? 'Successfully Updated.')
			dispatch(setSuccess(true))
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// update aircraft status
const deleteAircraft = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete aircraft api call
			const { data } = await axios.patch(AIRCRAFT.ADD_AIRCRAFT + '/' + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getAircraftSearchList(pageWithSize))
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
	getAircraftList,
	addAircraft,
	editAircraft,
	deleteAircraft,
	getAircraftDetails,
	getAircraftSearchList,
}
