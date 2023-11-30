import axios from 'axios'

// import api config
import { CREWS_LEAVE } from '../../../config'

// import actions and reducers
import {
	setIsLoading,
	setPagination,
    setCrewsLeaveDashDataList,
} from '../../reducers/CrewManagementReducers/crewsLeaveDashReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// Get Crew Leave Dashboard Data
const getCrewsLeaveDashDataList = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// eGt Crew Leave Dashboard Data
            const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
				    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
			}
			const { data } = await axios.post(CREWS_LEAVE.GET_CREWS_LEAVE_DASH + PARAMS, PAYLOAD)

            dispatch(
				setPagination({
					currentPage: data?.currentPage,
					pageSize: data?.totalElements,
					totalPage: data?.totalPages,
					currentPageSize:
						searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize,
				})
			)

			dispatch(setCrewsLeaveDashDataList(data?.model))

			// set isLoading to false since data fetching has done.
			dispatch(setIsLoading(false))
		} catch (error) {
			console.error(error)

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
    getCrewsLeaveDashDataList
}
