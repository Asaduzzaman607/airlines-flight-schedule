import axios from 'axios'

// import api config
import { VCC } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setReceiveAssignList,
	setSuccess,
	setPagination,
} from '../../reducers/VehicleManagementReducers/receiveAssignReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform ReceiveAssign list
const transformItemList = (items) => {
	// check if ReceiveAssign is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get ReceiveAssign list
const getReceiveAssignList = (params) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))		
		try {
			// get DropAssign list
			const { data } = await axios.get(VCC.GET_RECEIVE_ASSIGN_LIST, { params })
	
			dispatch(setSuccess(false))

			// set DropAssign to DropAssign List
			const RecAssignList = transformItemList(data?.model)
			dispatch(setReceiveAssignList(RecAssignList))

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

// get ReceiveAssign search list
const getReceiveAssignSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get ReceiveAssign
			const { data } = await axios.post(VCC.GET_RECEIVE_ASSIGN_LIST + 'search', {
				[searchValue.columnName]: searchValue.value,
			})
			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data?.model)
			dispatch(setReceiveAssignList(newList))

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

// add ReceiveAssign
const addReceiveAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add ReceiveAssign api call
			const {data} = await axios.post(VCC.GET_RECEIVE_ASSIGN, params)

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

// edit ReceiveAssign
const editReceiveAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit ReceiveAssign api call
			const { data } = await axios.put(VCC.GET_RECEIVE_ASSIGN_LIST + params.id, params)
			showAlert('success', data?.message ?? 'Successfully Update.')
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

// update ReceiveAssign status
const deleteReceiveAssignData = (id, pagination) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete ReceiveAssign api call
			const {data} = await axios.patch(VCC.GET_RECEIVE_ASSIGN_LIST + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
			}
			dispatch(getReceiveAssignList(pageWithSize))
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
	getReceiveAssignList,
	addReceiveAssign,
	editReceiveAssign,
	deleteReceiveAssignData,
	getReceiveAssignSearchList,
}
