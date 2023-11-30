import axios from 'axios'

// import api config
import { SIM_DASHBOARD } from '../../../config'

// import actions
import {
	setIsLoading,
	setSuccess,
	setPagination,
	setDashboardData,
} from '../../reducers/SimTrainingManagementReducers/simDashboardReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// get Sim dashboard search list
const getSimDashboardData = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get UserType
			const PARAMS = `?page=${
				searchValue?.page ?? searchValue?.stored_SearchBlock_Value?.page
			}&size=${searchValue?.pageSize ?? searchValue?.stored_SearchBlock_Value?.pageSize}`
			const PAYLOAD = {
				[searchValue?.columnName ?? searchValue?.stored_SearchBlock_Value?.columnName]:
					searchValue?.value ?? searchValue?.stored_SearchBlock_Value?.inputFieldValue ??
                    searchValue?.stored_SearchBlock_Value?.typeSearchValue,
			}

			const { data } = await axios.post(
				SIM_DASHBOARD.GET_SIM_DASHBOARD_DATA + PARAMS,
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

			// set List
			dispatch(setDashboardData(data?.model ?? {}))

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
export { getSimDashboardData }
