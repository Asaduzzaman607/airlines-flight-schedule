import axios from 'axios'

// import api config
import { MENU, ROLE } from '../../../config'

// import actions
import {
	setIsLoading,
	setSuccess,
    setApprovalMenuList,
} from '../../reducers/RoleManagementReducers/approvalConfigReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// transform Module list
const transformItemList = (items) => {
	// check if Module is invalid or has an empty array, then return empty array
	if (!items || items.length <= 0) {
		return []
	}

	return items.map((item) => ({ ...item, key: item?.id }))
}

// get approval menu list
const getApprovalMenuList = () => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get Module
			
			const { data } = await axios.get(
				MENU.GET_MENU_LIST
			)
			dispatch(setSuccess(false))

			// set Transform List
			const newList = transformItemList(data)
			dispatch(setApprovalMenuList(newList))

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

// add approval menu
const submitApprovalConfig = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add role api call
			const { data } = await axios.post(ROLE.GET_APPROVAL_MENU_PAIR, params)

			dispatch(setIsLoading(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Updated.')
		} catch (err) {
            console.error(err)

            // Set isLoading to false and show error message
			const errMsg = getErrorMsg(err)
			dispatch(setIsLoading(false))
			showAlert('error', errMsg)
		}
	}
}

// export actions
export { getApprovalMenuList, submitApprovalConfig }
