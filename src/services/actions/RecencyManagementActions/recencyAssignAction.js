import axios from 'axios'

// import api config
import { RECENCY } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setRecencyAssignList,
	setSuccess,
	setPagination,
} from '../../reducers/RecencyManagementReducers/recencyAssignReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform Recency list
const transformItemList = (items) => {
	// check if Recency is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get Recency Assign list
const getRecencyAssignList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Recency Assign list
			const { data } = await axios.get(
				RECENCY.RECENCY_ASSIGNMENT + `?page=${page.page}&size=${page.pageSize}`
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

			// set Recency Assign to Recency Assign List
			const Recency_AssignList = transformItemList(data?.model)
			dispatch(setRecencyAssignList(Recency_AssignList))

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

// get RecencyAssign search list
const getRecencyAssignSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get RecencyAssign
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ??
					searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
					searchValue?.stored_SearchBlock_Value?.dataSearchValue,
			}
			const { data } = await axios.post(
				RECENCY.RECENCY_ASSIGNMENT + 'search' + PARAMS,
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
			dispatch(setRecencyAssignList(newList))

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

// add Recency Assign
const addRecencyAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add Recency Assign api call
			const { data } = await axios.post(RECENCY.RECENCY_ASSIGNMENT, params)

			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// edit Recency Assign
const editRecencyAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit Recency Assign api call
			const { data } = await axios.put(RECENCY.RECENCY_ASSIGNMENT + params.id, params)

			dispatch(setSuccess(true))
			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Updated.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// update Recency Assign status
const deleteRecencyAssign = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete Recency Assign api call
			const { data } = await axios.patch(RECENCY.RECENCY_ASSIGNMENT + id, null, {
				params: { statusId: 0 },
			})

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getRecencyAssignSearchList(pageWithSize))
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
	getRecencyAssignList,
	addRecencyAssign,
	editRecencyAssign,
	deleteRecencyAssign,
	getRecencyAssignSearchList,
}
