import axios from 'axios'
// import api config
import { VCC } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setDropAssignList,
	setSuccess,
	setPagination,
} from '../../reducers/VehicleManagementReducers/dropAssignReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform DropAssign list
const transformItemList = (items) => {
	// check if DropAssign is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get DropAssign list
const getDropAssignList = (params) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))		
		try {
			// get DropAssign list
			const { data } = await axios.get(VCC.GET_DROP_ASSIGN_LIST, { params })
			dispatch(setSuccess(false))

			// set DropAssign to DropAssign List
			const DropAssignList = transformItemList(data?.model)
			dispatch(setDropAssignList(DropAssignList))

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

// get DropAssign search list
const getDropAssignSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get DropAssign
			const { data } = await axios.post(VCC.GET_DROP_ASSIGN_LIST , {
				[searchValue.columnName]: searchValue.value,
			})
			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setDropAssignList(newList))

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

// add DropAssign
const addDropAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add DropAssign api call
			const {data} =await axios.post(VCC.GET_DROP_ASSIGN, params)

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

// edit DropAssign
const editDropAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit DropAssign api call
			const {data} = await axios.put(VCC.GET_DROP_ASSIGN_LIST + params.id, params)

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

// update DropAssign status
const deleteDropAssignData = (id, pagination) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete DropAssign api call
			const {data} = await axios.patch(VCC.GET_DROP_ASSIGN_LIST + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
			}
			dispatch(getDropAssignList(pageWithSize))
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
	getDropAssignList,
	addDropAssign,
	editDropAssign,
	deleteDropAssignData,
	getDropAssignSearchList,
}
