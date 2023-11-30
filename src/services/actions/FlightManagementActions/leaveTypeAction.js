import axios from 'axios'

// import api config
import { LEAVE_TYPE } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setSuccess,
	setPagination,
	setLeaveTypeList,
	setPeriodList
} from '../../reducers/FlightManagementReducers/leaveTypeReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform Leave Type list
const transformItemList = (items) => {
	// check if Leave Type is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get Leave Type list
const getLeaveTypeList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Leave Type list
			const { data } = await axios.get(
				LEAVE_TYPE.GET_LEAVE_TYPE + `?page=${page.page}&size=${page.pageSize}`
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

			// set Leave Type to Leave Type List
			const LeaveTypeList = transformItemList(data?.model)
			dispatch(setLeaveTypeList(LeaveTypeList))

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

// get Leave Type list
const getLeavePeriodList = () => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Leave Type list
			const { data } = await axios.get(
				LEAVE_TYPE.GET_LEAVE_TYPE + 'period'
			)
		
			dispatch(setSuccess(false))

			// set Leave Type to Leave Type List
			const LeaveTypeList = transformItemList(data)
	
			dispatch(setPeriodList(LeaveTypeList))
			
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


// get Leave Type search list
const getLeaveTypeSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Leave Type
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
			}
			const { data } = await axios.post(LEAVE_TYPE.GET_LEAVE_TYPE + 'search' + PARAMS, PAYLOAD)
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
			dispatch(setLeaveTypeList(newList))

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

// add Leave Type
const addLeaveType = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add Leave Type api call
			const {data} = await axios.post(LEAVE_TYPE.GET_LEAVE_TYPE, params)

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

// edit Leave Type
const editLeaveType = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit Leave Type api call
			const {data} = await axios.put(LEAVE_TYPE.GET_LEAVE_TYPE + params.id, params)
			console.log({data})
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

// update Leave Type status
const deleteLeaveType = (id, pagination, stored_SearchBlock_Value,) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete Leave Type api call
			const { data } = await axios.patch(LEAVE_TYPE.GET_LEAVE_TYPE + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
                stored_SearchBlock_Value,
			}
			dispatch(getLeaveTypeSearchList(pageWithSize))
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
export { getLeaveTypeList, addLeaveType, editLeaveType, deleteLeaveType, getLeaveTypeSearchList, getLeavePeriodList }
