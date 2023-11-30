import axios from 'axios'

// import api config
import { AIRPORT_PAIR } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setAirportPairList,
	setSuccess,
	setPagination,
} from '../../reducers/FlightManagementReducers/airportPairReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform AirportPair list
const transformList = (items) => {
	// check if AirportPairType is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get AirportPair list
const getAirportPairList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get AirportPair
			const { data } = await axios.get(
				AIRPORT_PAIR.GET_AIRPORT_PAIR_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set AirportPair to AirportPairList
			const AirportPairList = transformList(data?.model)
			dispatch(setAirportPairList(AirportPairList))

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

// get AirportPair search list
const getAirportPairSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			const AIRPORT_PAIR_PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const { data } = await axios.post(
				AIRPORT_PAIR.GET_AIRPORT_PAIR_LIST + 'search' + AIRPORT_PAIR_PARAMS,
				{
					[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
						searchValue?.value ??
						searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				}
			)
			dispatch(setSuccess(false))

			dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
					currentPageSize:
						searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize,
				})
			)

			// set Transform List
			const newList = transformList(data?.model)
			dispatch(setAirportPairList(newList))

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

// add AirportPair
const addAirportPair = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add AirportPair api call
			const { data } = await axios.post(AIRPORT_PAIR.GET_AIRPORT_PAIR_LIST, params)

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

// edit AirportPair
const editAirportPair = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit AirportPair api call
			const { data } = await axios.put(AIRPORT_PAIR.GET_AIRPORT_PAIR_LIST + params.id, params)

			// show success message
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

// update AirportPair status
const deleteAirportPair = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete AirportPair api call
			const { data } = await axios.patch(
				AIRPORT_PAIR.GET_AIRPORT_PAIR_LIST + id + '?statusId=0'
			)

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getAirportPairSearchList(pageWithSize))
			dispatch(setIsLoadingAddUser(false))

			// show success message
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
	getAirportPairList,
	addAirportPair,
	editAirportPair,
	deleteAirportPair,
	getAirportPairSearchList,
}
