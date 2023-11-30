import axios from 'axios'

// import api config
import { ROLE, ROLE_ASIGN } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setRoleList,
	setSuccess,
	setPagination,
	setRoleBasedUserList,
} from '../../reducers/RoleManagementReducers/roleReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform role list
const transformItemList = (items) => {
	// check if role is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get role list
const getRoleList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get role type
			const response = await axios.get(
				ROLE.GET_ROLE + `?page=${page.page}&size=${page.pageSize}`
			)
			const { data } = response
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

			// set role to roleList
			const RoleList = transformItemList(data?.model)
			dispatch(setRoleList(RoleList))

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

// get Role search list
const getRoleSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Role
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				query: searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}

			const { data } = await axios.post(ROLE.GET_ROLE + 'search' + PARAMS, PAYLOAD)
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
			dispatch(setRoleList(newList))

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

// add role
const addRole = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add role api call
			const { data } = await axios.post(ROLE.ADD_ROLE, params)

			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')

            // Return the successful result
            return { success: true, message: data?.message ?? 'Successfully Added.' };
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error message
			showAlert('error', errMsg)

            // Return the error result
            return { success: false, message: errMsg };
		}
	}
}

// assign role
const assignRole = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add role assign api call
			const { data } = await axios.post(ROLE_ASIGN.ADD_ROLE_ASIGN, params)

			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')

            // Return the successful result
            return { success: true, message: data?.message ?? 'Successfully Added.' };
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error message
			showAlert('error', errMsg)
		}
	}
}

// edit role function
const editRole = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit role api call
			const { data } = await axios.put(ROLE.ADD_ROLE + params.id, params)

			dispatch(setSuccess(true))
			dispatch(setIsLoadingAddUser(false))

			showAlert('success', data?.message ?? 'Successfully Updated.')

            // Return the successful result
            return { success: true, message: data?.message ?? 'Successfully Updated.' };
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			showAlert('error', errMsg)

            // Return the error result
            return { success: false, message: errMsg };
		}
	}
}

// update role status
const deleteRole = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// delete role api call
			const { data } = await axios.delete(ROLE.DELETE_ROLE + id)

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getRoleSearchList(pageWithSize))
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

// get Role Based UserList
const getRoleBasedUserList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Role Based UserList
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {}

			const { data } = await axios.post(ROLE.GET_ROLE_BASED_USER + PARAMS, PAYLOAD)
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

			// set List
			const DataList = transformItemList(data?.model)
			dispatch(setRoleBasedUserList(DataList))

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

// export actions
export {
	getRoleList,
	addRole,
	editRole,
	deleteRole,
	assignRole,
	getRoleSearchList,
	getRoleBasedUserList,
}
