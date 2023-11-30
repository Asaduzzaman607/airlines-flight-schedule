import axios from 'axios'

// import api config
import { FLYINGTIME } from '../../../config'

// import actions and reducers
import {
	setIsLoading,
	setIsLoadingAddUser,
	setFlyingTimeList,
	setSuccess,
	setPagination,
    setIsLoadingDashboard,
    setFlyingDashboardData,
} from '../../reducers/CrewManagementReducers/flyingTimeReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform FlyingTime list
const transformItemList = (items) => {
	// check if FlyingTime is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get FlyingTime search list
const getFlyingTimeSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get FlyingTime
            const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}
			const { data } = await axios.post(FLYINGTIME.GET_FLYINGTIME + 'search' + PARAMS, PAYLOAD)

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
			dispatch(setFlyingTimeList(newList))

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

// add FlyingTime
const addFlyingTime = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add FlyingTime api call
			const { data } = await axios.post(FLYINGTIME.GET_FLYINGTIME, params)

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added !!')

			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
            console.error(err)
			const errMsg = getErrorMsg(err)

			// Set isLoading to false and show error msg
			dispatch(setIsLoadingAddUser(false))
			showAlert('error', errMsg)
		}
	}
}

// edit FlyingTime
const editFlyingTime = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit FlyingTime api call
			const { data } = await axios.put(FLYINGTIME.GET_FLYINGTIME + params.id, params)

            showAlert('success', data?.message ?? 'Successfully Updated !!')

			dispatch(setSuccess(true))
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
            console.error(err)
			const errMsg = getErrorMsg(err)

			// Set isLoading to false and show error msg
			dispatch(setIsLoadingAddUser(false))
			showAlert('error', errMsg)
		}
	}
}

// update FlyingTime status
const deleteFlyingTimeData = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete FlyingTime api call
			await axios.patch(FLYINGTIME.GET_FLYINGTIME + id + '?statusId=0')

			let pageWithSize = {
				page: pagination?.currentPage - 1,
				pageSize: pagination?.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getFlyingTimeSearchList(pageWithSize))
			dispatch(setIsLoadingAddUser(false))

			showAlert('success', 'Successfully Deleted !!')
		} catch (err) {
            console.error(err)
			const errMsg = getErrorMsg(err)

			// Set isLoading to false and show error msg
			dispatch(setIsLoadingAddUser(false))
			showAlert('error', errMsg)
		}
	}
}

// Get Flying Dashboard data
const getFlyingDashboardData = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoadingDashboard(true))

		try {
			// get FlyingTime
            const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}
			const { data } = await axios.post(FLYINGTIME.GET_FLYINGTIME_DASHBOARD + PARAMS, PAYLOAD)

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
			dispatch(setFlyingDashboardData(newList))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoadingDashboard(false))
		} catch (error) {
			console.error(error)
			dispatch(setSuccess(false))

			// get error msg
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg)

			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoadingDashboard(false))
		}
	}
}

// export actions
export {
	addFlyingTime,
	editFlyingTime,
	deleteFlyingTimeData,
	getFlyingTimeSearchList,
    getFlyingDashboardData
}
