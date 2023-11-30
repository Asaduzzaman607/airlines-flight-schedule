import axios from 'axios'

// import api config
import { FLIGHTINFO } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setFlightInfoList,
	setFlightInfoDetailsList,
	setSuccess,
	setPagination,
} from '../../reducers/FlightManagementReducers/flightInfoReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform flight info list
const transformItemList = (items) => {
	// check if flight info is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get flight info list
const getFlightInfoList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get flight info
			const { data } = await axios.get(
				FLIGHTINFO.GET_FLIGHTINFO_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set flight info to flightInfo List
			const flightInfoList = transformItemList(data?.model)
			dispatch(setFlightInfoList(flightInfoList))

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

// get FlightInfo search list
const getFlightInfoSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		const { page, pageSize, payload } = searchValue
		try {
			// get FlightInfo
			const PARAMS = `?page=${page}&size=${pageSize}`
			const PAYLOAD = {
				...payload
			}
			const { data } = await axios.post(
				FLIGHTINFO.GET_FLIGHTINFO_LIST + 'search' + PARAMS,
				PAYLOAD
			)

			dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
					currentPageSize:
						searchValue?.pageSize,
				})
			)
			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setFlightInfoList(newList))

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

// get flight info row details
const getFlightInfoDetails = (id) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// get flight info list
			const { data } = await axios.get(FLIGHTINFO.GET_FLIGHTINFO_LIST + id)
			dispatch(setFlightInfoDetailsList(data))
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
		}
	}
}

// add flight info
const addFlightInfo = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add flight info api call
			const { data } = await axios.post(FLIGHTINFO.ADD_FLIGHTINFO, params)

			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error message
			showAlert('error', errMsg)
		}
	}
}

// edit flight info
const editFlightInfoList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit flight info api call
			const { data } = await axios.put(FLIGHTINFO.ADD_FLIGHTINFO + params.id, params)

			dispatch(setSuccess(true))
			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Updated.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			showAlert('error', errMsg)
		}
	}
}

// update flight info status
const deleteFlightInfo = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete flight info api call
			const { data } = await axios.patch(FLIGHTINFO.ADD_FLIGHTINFO + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getFlightInfoSearchList(pageWithSize))
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
	getFlightInfoList,
	addFlightInfo,
	editFlightInfoList,
	deleteFlightInfo,
	getFlightInfoDetails,
	getFlightInfoSearchList,
}
