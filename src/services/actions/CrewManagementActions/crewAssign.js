import axios from 'axios'

// import api config
import { CREW_ASSIGN, DASHBOARD } from '../../../config'

// import actions
import {
	setIsLoading,
	setIsLoadingAddUser,
	setSuccess,
	setViolatedRuelsForCockpitCrew,
	setIsCrewAssignModalOpen,
} from '../../reducers/CrewManagementReducers/crewAssignReducer'
import { getErrorMsg, showAlert } from '../commonActions'

// get Cabin Crew Assign list
const getCrewAssignList = () => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get CrewAssign list
			// const {data} = await axios.get(CrewAssign.GET_CrewAssign_LIST)
			dispatch(setSuccess(false))

			// set CrewAssign to CrewAssign List
			// const CrewAssignList = transformItemList(data?.model)
			// dispatch(setCrewAssignList( CrewAssignList ))

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

// add Cabin Crew Assign
const addCabinCrewAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add CrewAssign api call
			const { data } = await axios.post(CREW_ASSIGN.ADD_CABIN_CREW, params)
			dispatch(setIsLoadingAddUser(false))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added !!')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// add Cockpit Crew Assign
const addCockpitCrewAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// add CrewAssign api call
			const { data } = await axios.post(CREW_ASSIGN.ADD_COCKPIT_CREW, params)
			dispatch(setIsLoadingAddUser(false))
			dispatch(setIsCrewAssignModalOpen(false))

			dispatch(setViolatedRuelsForCockpitCrew([]))

			// show success message
			showAlert('success', data?.message ?? 'Successfully Added !!')
		} catch (err) {
			const errMsg = getErrorMsg(err)
			// Set isLoading to false
			dispatch(setIsLoadingAddUser(false))
			dispatch(setViolatedRuelsForCockpitCrew([]))
			dispatch(setIsCrewAssignModalOpen(false))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// validate assign crew
const validateCockpitCrewAssign = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoadingAddUser(true))
		try {
			// api call
			const { data } = await axios.post(DASHBOARD.VALIDATE_ASSIGN_CREW, params)

			// check violated rules
			const isViolated = data?.length && data.some((item) => item.violatedRules?.length > 0)

			if (!isViolated) dispatch(addCockpitCrewAssign(params))
			else {
				dispatch(setViolatedRuelsForCockpitCrew(data))
				dispatch(setIsCrewAssignModalOpen(true))
				dispatch(setIsLoadingAddUser(false))
			}
		} catch (err) {
			const errMsg = getErrorMsg(err)

			// Set isLoading to false
			dispatch(setIsCrewAssignModalOpen(false))
			dispatch(setIsLoadingAddUser(false))
			dispatch(setViolatedRuelsForCockpitCrew([]))

			// show error msg
			showAlert('error', errMsg)
		}
	}
}

// export actions
export { addCabinCrewAssign, addCockpitCrewAssign, validateCockpitCrewAssign, getCrewAssignList }
