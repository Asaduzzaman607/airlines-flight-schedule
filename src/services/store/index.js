import { configureStore } from '@reduxjs/toolkit'

// import reducers
import {
	aircraftReducer,
	areaReducer,
	airportPairReducer,
	aircraftTypeReducer,
	authReducer,
	userReducer,
	flightGroupReducer,
	flightLocationReducer,
	flightInfoReducer,
	airportReducer,
	roleReducer,
	recencyReducer,
	recencyAssignReducer,
	employeeReducer,
	crewAssignReducer,
	driverReducer,
	vehicleReducer,
	routeReducer,
	receiveAssignReducer,
	dropAssignReducer,
	flyingTimeReducer,
	flightSeasonReducer,
	flightScheduleReducer,
	dashboardReducer,
	recencyDashboardReducer,
	aircraftAssignReducer,
	countryReducer,
	employeeLeaveReducer,
	userTypeReducer,
	journeyLogReducer,
	flightStatusReducer,
	cityReducer,
	simModuleReducer,
	trainerReducer,
	trainingCenterReducer,
	simulationHistoryReducer,
	licenceReducer,
	simPlanReducer,
	validationReducer,
	caabReducer,
	simDashboardReducer,
	cabinCrewDashboardReducer,
	approvalConfigReducer,
	employeeGroupReducer,
	leaveTypeReducer,
	leaveConfigReducer,
    cabinCrewListReducer,
    notificationReducer,
    crewsLeaveDashReducer
} from '../reducers'

// confugure store
const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		aircraft: aircraftReducer,
		aircrafttype: aircraftTypeReducer,
		flightgroup: flightGroupReducer,
		flightlocation: flightLocationReducer,
		flightinfo: flightInfoReducer,
		airport: airportReducer,
		role: roleReducer,
		recency: recencyReducer,
		recencyassign: recencyAssignReducer,
		employee: employeeReducer,
		crewassign: crewAssignReducer,
		driver: driverReducer,
		vehicle: vehicleReducer,
		route: routeReducer,
		receiveassign: receiveAssignReducer,
		dropassign: dropAssignReducer,
		airportpair: airportPairReducer,
		dashboard: dashboardReducer,
		flyingTime: flyingTimeReducer,
		flightSeason: flightSeasonReducer,
		flightSchedule: flightScheduleReducer,
		recencyDashboard: recencyDashboardReducer,
		country: countryReducer,
		area: areaReducer,
		employeeLeave: employeeLeaveReducer,
		userType: userTypeReducer,
		aircraftAssign: aircraftAssignReducer,
		journeyLog: journeyLogReducer,
		flightStatus: flightStatusReducer,
		city: cityReducer,
		simModule: simModuleReducer,
		trainer: trainerReducer,
		trainingCenter: trainingCenterReducer,
		simulationHistory: simulationHistoryReducer,
		licence: licenceReducer,
		simPlan: simPlanReducer,
		validation: validationReducer,
		caab: caabReducer,
		simDashboard: simDashboardReducer,
		approvalConfig: approvalConfigReducer,
		employeeGroup: employeeGroupReducer,
		leaveType: leaveTypeReducer,
		leaveConfig: leaveConfigReducer,
		cabinCrewDashboard: cabinCrewDashboardReducer,
        cabinCrews: cabinCrewListReducer,
        notification: notificationReducer,
        crewsLeaveDash: crewsLeaveDashReducer
	},
})

export default store