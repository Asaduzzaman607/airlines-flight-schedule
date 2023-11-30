import axios from 'axios'

// import api config
import { FLIGHTLOCATION } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setFlightLocationList,
	setFlightLocationDetails,
	setSuccess,
	setPagination,
} from '../../reducers/FlightManagementReducers/flightLocationReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform flight location list
const transformItemList = (items) => {
	// check if flightLocation list is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get flight location list
const getFlightLocationList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get flight location list
			const { data } = await axios.get(
				FLIGHTLOCATION.GET_FLIGHTLOCATION_LIST + `?page=${page}`
			)
			dispatch(setSuccess(false))

			// set user pagination
			dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
				})
			)

			// set flightLocation to flightLocation List
			const flightLocationList = transformItemList(data?.model)
			dispatch(setFlightLocationList(flightLocationList))

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

// get flight location row details
const getFlightLocationDetails = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			dispatch(setFlightLocationDetails(params))
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
		}
	}
}

// add new flight location
const addFlightLocation = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add flight location api call
			await axios.post(FLIGHTLOCATION.ADD_FLIGHTLOCATION, params)

			// show success message
			showAlert('success', 'Successfully Added !!')
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

// edit flight location
const editFlightLocationList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit flight location api call
			await axios.put(FLIGHTLOCATION.ADD_FLIGHTLOCATION + params.id, params)

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

// update flight location status
const updateFlightLocationStatus = (id, currentPageNo) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete flight location api call
			await axios.patch(FLIGHTLOCATION.ADD_FLIGHTLOCATION + id + '?statusId=0')

			showAlert('success', 'Successfully Deleted !!')
			dispatch(getFlightLocationList(currentPageNo - 1))
			// dispatch(deleteData( id ))
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

// export actions
export {
	getFlightLocationList,
	addFlightLocation,
	editFlightLocationList,
	updateFlightLocationStatus,
	getFlightLocationDetails,
}
