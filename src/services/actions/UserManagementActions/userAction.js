import axios from 'axios'

// import reducers
import { setUser } from '../../reducers/authReducer'

// import api config
import { USER } from '../../../config'

// import actions
import {
	setIsLoading,
	setUserList,
	setIsLoadingAddUser,
	setSelectedUser,
	setIsLoadingUser,
	setSuccess,
	setPagination,
	setIsResetPassword,
} from '../../reducers/UserManagementReduers/userReducer'
import { getErrorMsg, showAlert } from '../commonActions'
import cookies from '../authHelpers/cookies'

// get user list
const getUserList = (page = 0) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get userA
			const response = await axios.get(
				USER.GET_USER_LIST + `?page=${page.page}&size=${page.pageSize}`
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

			// set users to userList
			const users = transformUserList(data?.model)
			dispatch(setUserList(users))

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

// get user search list
const getUserSearchList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get user
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue,
				aircraftTypeId: searchValue?.aircraftTypePermission,
			}

			const { data } = await axios.post(USER.GET_USER_SEARCH + PARAMS, PAYLOAD)

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

			// set users to userList
			const users = transformUserList(data?.model)
			dispatch(setUserList(users))

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

// user registration/add fuction
const addUser = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add user api call
			const { data } = await axios.post(USER.ADD_USER, params)

			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added.')

            // Return the successful result
            return { success: true, message: data?.message ?? 'Successfully Added.' };
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error msg
			showAlert('error', errMsg)

            // Return the error result
            return { success: false, message: errMsg };
		}
	}
}

// edit user
const EditUser = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// edit user api call
			const { data } = await axios.put(USER.ADD_USER + params.id, params)
			dispatch(setSuccess(true))
			dispatch(setIsLoadingAddUser(false))

			showAlert('success', data?.message ?? 'Successfully Updated.')

            // Return the successful result
            return { success: true, message: data?.message ?? 'Successfully Updated.' };
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
            
			// show error msg
			showAlert('error', errMsg)

            // Return the error result
            return { success: false, message: errMsg };
		}
	}
}

// transform user list
const transformUserList = (users) => {
	// check if users is invalid or has an empty array, then return empty array
	if (!users || users.length <= 0) {
		return []
	}

	return users.map((user) => ({ ...user, key: user?.id }))
}

// get user info by id
const getUser = (user_id) => {
	return async (dispatch) => {
		// set loading to true
		dispatch(setIsLoadingUser(true))

		try {
			const { data } = await axios.get(USER.ADD_USER + user_id)

			// set data to selected user for update
			dispatch(setSelectedUser(data ?? null))

			// set loading to false
			dispatch(setIsLoadingUser(false))
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

// update user status
const deleteUser = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingUser(true))
		try {
			// delete user api call
			const { data } = await axios.patch(USER.GET_USER_LIST + id + '?statusId=0')

			let pageWithSize = {
				page: pagination.currentPage - 1,
				pageSize: pagination.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getUserSearchList(pageWithSize))
			dispatch(setIsLoadingUser(false))

			showAlert('success', data?.message ?? 'Successfully Deleted.')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingUser(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// FORGET PASSWORD API
const ResetPassRequested = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// forget pass api call
			const { data } = await axios.post(USER.RESET_PASS_REQ, params)

			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Requested.')

			// set status redirect to login page
			dispatch(setIsResetPassword(true))
		} catch (err) {
			dispatch(setIsResetPassword(false))
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// RESET PASSWORD API
const ResetPassword = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// forget pass api call
			const { data } = await axios.put(USER.CHANGE_PASSWORD, params)

			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Password Reset.')

			// redirect to dashboard
			const { token } = data
			axios.defaults.headers.common.Authorization = `Bearer ${token}`
			// localStorage.setItem('token', token)
            // set token to cookies
			cookies.setCookie('token', token, 0)

			dispatch(setUser(data))
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// RESET DEFAULT USER PASSWORD  API
const resetUserPassword = (id, pagination, stored_SearchBlock_Value) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// user reset pass api call
			const { data } = await axios.post(USER.RESET_USER_PASS, null, { params: { id } })
			dispatch(setIsLoadingAddUser(false))

			let pageWithSize = {
				page: pagination?.currentPage - 1,
				pageSize: pagination?.currentPageSize,
				stored_SearchBlock_Value,
			}
			dispatch(getUserSearchList(pageWithSize))

			// show success message
			showAlert('success', data?.message ?? 'Password Reseted.')
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
	getUserList,
	addUser,
	EditUser,
	getUser,
	deleteUser,
	getUserSearchList,
	ResetPassRequested,
	ResetPassword,
	resetUserPassword,
}
