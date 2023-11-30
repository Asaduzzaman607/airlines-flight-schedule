import axios from 'axios'

// import api config
import { FLIGHTSEASON } from '../../../config'

// import actions
import {
	setIsLoading,
	setFlightSeasonList,
	setSuccess,
	setPagination,
} from '../../reducers/FlightManagementReducers/flightSeasonReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform FlightSeason list
const transformItemList = (items) => {
	// check if FlightSeason is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get FlightSeason list
const getFlightSeasonList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get FlightSeason list
			const { data } = await axios.get(
				FLIGHTSEASON.GET_FLIGHT_SEASON_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set FlightSeason to FlightSeason List
			const FlightSeasonList = transformItemList(data?.model)
			dispatch(setFlightSeasonList(FlightSeasonList))

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

// get FlightSeason search list
const getFlightSeasonSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get FlightSeason
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ??
					searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
					searchValue?.stored_SearchBlock_Value?.dataSearchValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}
			const { data } = await axios.post(
				FLIGHTSEASON.GET_FLIGHT_SEASON_LIST + 'search' + PARAMS,
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
			dispatch(setFlightSeasonList(newList))

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

// add FlightSeason
const addFlightSeason = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add FlightSeason api call
			const { data } = await axios.post(FLIGHTSEASON.GET_FLIGHT_SEASON_LIST, params)

			dispatch(setIsLoading(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// edit FlightSeason
const editFlightSeason = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// edit FlightSeason api call
			const { data } = await axios.put(
				FLIGHTSEASON.GET_FLIGHT_SEASON_LIST + params.id,
				params
			)

			dispatch(setSuccess(true))
			dispatch(setIsLoading(false))

			// show success msg
			showAlert('success', data?.message ?? 'Successfully Updated.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoading(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// update FlightSeason status
const deleteFlightSeasonData = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// delete FlightSeason api call
			const { data } = await axios.patch(
				FLIGHTSEASON.GET_FLIGHT_SEASON_LIST + id + '?statusId=0'
			)

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getFlightSeasonSearchList(pageWithSize))
			dispatch(setIsLoading(false))

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

// export actions
export {
	getFlightSeasonList,
	addFlightSeason,
	editFlightSeason,
	deleteFlightSeasonData,
	getFlightSeasonSearchList,
}
