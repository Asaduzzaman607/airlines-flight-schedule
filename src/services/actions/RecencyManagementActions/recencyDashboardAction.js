import axios from 'axios'

// import api config
import { RECENCY } from '../../../config'

// import actions
import {
	setIsLoading,
	setRecencyDashboardData,
	setSuccess,
} from '../../reducers/RecencyManagementReducers/recencyDashboardReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// get RecencyDashboard data
const getRecencyDashboardData = (userType) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get RecencyDashboard data
			const { data } = await axios.post(RECENCY.RECENCY_DASHBOARD, userType)
			dispatch(setSuccess(false))

			// set RecencyDashboard to RecencyDashboard List
			dispatch(setRecencyDashboardData(data))

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

// get RecencyDashboard search list
const getRecencyDashboardSearchData = (searchValue) => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get RecencyDashboard
			const { data } = await axios.post(RECENCY.RECENCY_DASHBOARD, {
				[searchValue.columnName]: searchValue.value,
				crewType: searchValue.crewType,
				aircraftTypeId: [searchValue.aircraftType],
			})
			dispatch(setSuccess(false))

			// set Transform List
			dispatch(setRecencyDashboardData(data))
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
export { getRecencyDashboardData, getRecencyDashboardSearchData }
