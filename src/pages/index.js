// import components
import Dashboard from './Dashboard'
import Login from './Login'
import PageNotFound from './NotFoundPage'
import DashboardV2 from './DashboardV2'
import FlightAssignPage from './FlightAssignPage'

// import other components
import MenuAssign from './MenuAssign'
import { User, UserType, ResetPassword, UserInfoResetPassForm} from './UserManagements'
import { Recency, RecencyAssign, RecencyDashboard } from './RecencyManagements'
import { 
    Area, 
    Country, 
    Employee, 
    EmployeeLeave, 
    FlyingTime, 
    CockpitCrew, 
    CabinCrew, 
    FlyingDashboard,
    CabinCrewInfo,
    CrewsLeaveDashView 
} from './CrewManagements'
import { Driver, Vehicle, VccRoute, ReceiveAssignment, DropAssignment } from './VehicleManagements'
import { Aircraft, AircraftType, Airport, FlightGroup, FlightInfo, FlightLocation, FlightSchedule, FlightSeason, AirportPair, JourneyLog, LeaveType, LeaveConfig } from './FlightManagements'
import { Roles, RolesAssign, UserRoleDetails, ApprovalConfigPage } from './RoleManagements'
import { 
    SimTrainingCity, 
    SimModule, 
    Trainer, 
    TrainingCenter, 
    SimulationHistory, 
    SimPlan, 
    Licence,
    Validation ,
    Caab,
    SimDashboard,
    EmployeeGroup, 
} from './SimTrainingManagements'


// export components
export { 
    Login, 
    Dashboard,
    DashboardV2,
    User,
    PageNotFound, 
    Aircraft, 
    AircraftType, 
    FlightGroup, 
    FlightLocation, 
    FlightInfo, 
    Airport, 
    Roles, 
    RolesAssign, 
    Recency, 
    RecencyAssign, 
    MenuAssign, 
    Employee, 
    CockpitCrew, 
    CabinCrew,
    Driver,
    Vehicle,
    VccRoute,
    ReceiveAssignment,
    DropAssignment,
    AirportPair,
    UserRoleDetails,
    FlyingTime,
    FlightSeason,
    FlightSchedule,
    RecencyDashboard,
    Country,
    Area,
    EmployeeLeave,
    FlightAssignPage,
    UserType,
    JourneyLog,
    SimTrainingCity,
    SimModule,
    Trainer,
    TrainingCenter,
    SimulationHistory,
    Licence,
    SimPlan,
    Validation,
    Caab,
    SimDashboard,
    ResetPassword,
    UserInfoResetPassForm,
    ApprovalConfigPage,
    EmployeeGroup,
    FlyingDashboard,
    LeaveType,
    CabinCrewInfo,
    LeaveConfig,
    CrewsLeaveDashView
}

