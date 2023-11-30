import axios from 'axios'

// import api config
import { FLIGHTGROUP } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setFlightGroupList,
	setFlightGroupDetails,
	setSuccess,
	setPagination,
} from '../../reducers/FlightManagementReducers/flightGroupReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform flight group list
const transformItemList = (items) => {
	// check if flight group is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get flight group list
const getFlightGroupList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get flight group
			const { data } = await axios.get(
				FLIGHTGROUP.GET_FLIGHTGROUP_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set flight group to flight group List
			const flightGroupList = transformItemList(data?.model)
			dispatch(setFlightGroupList(flightGroupList))

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

// get FlightGroup search list
const getFlightGroupSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get FlightGroup
			const { data } = await axios.post(FLIGHTGROUP.GET_FLIGHTGROUP_LIST + 'search', {
				query: searchValue.value,
			})
			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setFlightGroupList(newList))

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

// get flight group row details
const getFlightGroupDetails = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			dispatch(setFlightGroupDetails(params))
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
		}
	}
}

// add flight group
const addFlightGroup = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add flight group api call
			await axios.post(FLIGHTGROUP.ADD_FLIGHTGROUP, params)

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

// edit flight group
const editFlightGroupList = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit flight group api call
			await axios.put(FLIGHTGROUP.ADD_FLIGHTGROUP + params.id, params)

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

// update flight group status
const updateFlightGroupStatus = (id, pagination) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete flight group api call
			await axios.patch(FLIGHTGROUP.ADD_FLIGHTGROUP + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
			}
			// console.log({pageWithSize},'from delete action',pagination)
			dispatch(getFlightGroupList(pageWithSize))
			dispatch(setIsLoadingAddUser(false))

			showAlert('success', 'Successfully Deleted !!')
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
	getFlightGroupList,
	addFlightGroup,
	editFlightGroupList,
	updateFlightGroupStatus,
	getFlightGroupDetails,
	getFlightGroupSearchList,
}
