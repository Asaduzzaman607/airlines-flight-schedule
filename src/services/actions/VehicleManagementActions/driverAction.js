import axios from 'axios'

// import api config
import { VCC } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setDriverList,
	setSuccess,
	setPagination,
} from '../../reducers/VehicleManagementReducers/driverReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform Driver list
const transformItemList = (items) => {
	// check if Driver is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get Driver list
const getDriverList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Driver list
			const { data } = await axios.get(
				VCC.GET_DRIVER_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set Driver to Driver List
			const DriverList = transformItemList(data?.model)
			dispatch(setDriverList(DriverList))

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

// get Driver search list
const getDriverSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Driver
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
			}
			const { data } = await axios.post(VCC.GET_DRIVER_LIST + 'search' + PARAMS, PAYLOAD)

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
			dispatch(setDriverList(newList))

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

// add Driver
const addDriver = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add Driver api call
			const {data} = await axios.post(VCC.GET_DRIVER_LIST, params)

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
			dispatch(setIsLoadingAddUser(false))
		} catch (err) {
			console.error(err)

			// show error msg
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)

			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
		}
	}
}

// edit Driver
const editDriver = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit Driver api call
			const {data} = await axios.put(VCC.GET_DRIVER_LIST + params.id, params)

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

// update Driver status
const deleteDriverData = (id, pagination) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete Driver api call
			const { data } = await axios.patch(VCC.GET_DRIVER_LIST + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
			}
			dispatch(getDriverList(pageWithSize))
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
export { getDriverList, addDriver, editDriver, deleteDriverData, getDriverSearchList }
