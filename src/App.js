import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

// import components
import {
	DashboardV2,
	Login,
	PageNotFound,
	User,
	AircraftType,
	FlightGroup,
	FlightLocation,
	Airport,
	Aircraft,
	FlightInfo,
	Roles,
	RolesAssign,
	Recency,
	MenuAssign,
	RecencyAssign,
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
} from './pages'
import { ProtectedRoute, ProtectedComponent } from './routes'
import { FlightStatus } from './pages/FlightManagements'

// notificaton 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sliceTextWithEllipsis } from './components/commonComponents/CommonItems'

// import actions
import { validateToken } from './services/actions/authAction'
import { getCurrentPath } from './services/actions/menuAction'
import cookies from './services/actions/authHelpers/cookies'

// API CONFIG
import { NOTIFICATION_ENDPOINT } from './config';
// import { setNotifications } from './services/reducers/notificationReducer'

function App() {
	const { isAuthenticated } = useSelector((state) => state.auth)

	//import hooks
	const { pathname } = useLocation()
	const dispatch = useDispatch()

	// initial effect
	useEffect(() => {
		// get the token from storage
		// const token = localStorage.getItem('token')
		const token = cookies.getCookie('token')

		// check if token is available but user is unauthenticated, then validate the token
		if (token && !isAuthenticated) {
			dispatch(validateToken({ token }))
		}
        
        const eventSource = new EventSource(NOTIFICATION_ENDPOINT)
		if (token && isAuthenticated) {
			eventSource.onerror = () => {
				eventSource.close()
			}
			const handleEvent = (event) => {
                const data = JSON?.parse(event.data)
                const contentItem = <Link to={`/${data?.link}`} className={'text-black hover:text-blue-500'}>
                    {sliceTextWithEllipsis(data?.message, 45)}
                </Link>

                const currentDateTime = new Date();
                const notificationItem = {
                    containerId: data?.id,
                    content: data?.message,
                    link: data?.link,
                    createdAt: currentDateTime.getTime(),
                    data: {},
                    id: data?.id,
                    isLoading: '',
                    read: false,
                    status: 'added',
                    theme: 'light',
                    type: 'success'
                }
                /*dispatch(setNotifications({
                    containerId: data?.id,
                    content: contentItem,
                    createdAt: currentDateTime.getTime(),
                    data: {},
                    id: data?.id,
                    isLoading: '',
                    read: false,
                    status: 'added',
                    theme: 'light',
                    type: 'success'
                }))*/

                // Retrieve the array from localStorage
                let retrievedData = localStorage.getItem('notifications');
                if(retrievedData) {
                    let retrievedArray = JSON?.parse(retrievedData)
                    retrievedArray?.push(notificationItem);
                    localStorage?.setItem('notifications', JSON?.stringify(retrievedArray));

                    let unreadCount = parseInt(localStorage.getItem('unreadCount'));
                    localStorage.setItem('unreadCount', unreadCount + 1);
                } else {
                    localStorage?.setItem('notifications', JSON?.stringify([notificationItem]));
                    localStorage.setItem('unreadCount', 1);
                }

                toast(contentItem,
                    {
                        type: 'success',
                    }
                )
            }

            eventSource.addEventListener('message', handleEvent)

		}
        dispatch(getCurrentPath(pathname))

        return () => {
            eventSource.close()
        }
	}, [dispatch, isAuthenticated, pathname])

	return (
		<>
			<Routes>
				<Route element={<ProtectedRoute />}>
					{_routes.map((item) => (
						<Route path={item?.path} element={item?.element} key={item.id}>
							{item.child.map((i) => (
								<Route path={i.path} element={i.element} key={i.id} />
							))}
						</Route>
					))}
					<Route path={'*'} element={<PageNotFound />} />
				</Route>
				<Route path={'/login'} element={<Login />} />
				<Route path={'/reset-password'} element={<ResetPassword />} />
				<Route path={'/user-info'} element={<UserInfoResetPassForm />} />
			</Routes>
		</>
	)
}

const _routes = [
	{
		id: 1,
		label: 'home',
		path: '/',
		element: <DashboardV2 />,
		child: [],
	},
	{
		id: 2,
		label: 'user',
		path: 'user-management/user',
		element: <ProtectedComponent rootComponent={<User />} />,
		child: [
			{
				id: 2.1,
				label: 'user add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 2.2,
				label: 'user update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 3,
		label: 'aircraft type',
		path: '/configurations/aircraft-type',
		element: <ProtectedComponent rootComponent={<AircraftType />} />,
		child: [
			{
				id: 3.1,
				label: 'aircraft type add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 3.2,
				label: 'aircraft type update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 4,
		label: 'daily flight plan',
		path: '/flight-management/flight-info',
		element: <ProtectedComponent rootComponent={<FlightInfo />} />,
		child: [
			{
				id: 4.1,
				label: 'daily flight plan add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 4.2,
				label: 'daily flight plan update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 3.2,
		label: 'aircraft assign',
		path: '/flight-management/aircraft-assign',
		element: <ProtectedComponent rootComponent={<FlightAssignPage />} />,
		child: [],
	},
	{
		id: 5,
		label: 'flight location',
		path: '/flight-management/flight/flight-location',
		element: <ProtectedComponent rootComponent={<FlightLocation />} />,
		child: [
			{
				id: 5.1,
				label: 'flight location add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 5.2,
				label: 'flight location update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 6,
		label: 'flight group',
		path: '/flight-management/flight/flight-group',
		element: <ProtectedComponent rootComponent={<FlightGroup />} />,
		child: [
			{
				id: 6.1,
				label: 'flight group add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 6.2,
				label: 'flight group update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 7,
		label: 'airport',
		path: '/configurations/airport',
		element: <ProtectedComponent rootComponent={<Airport />} />,
		child: [
			{
				id: 7.1,
				label: 'airport add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 7.2,
				label: 'airport update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 8,
		label: 'aircraft',
		path: '/configurations/aircraft',
		element: <ProtectedComponent rootComponent={<Aircraft />} />,
		child: [
			{
				id: 8.1,
				label: 'aircraft add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 8.2,
				label: 'aircraft update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 9,
		label: 'role',
		path: '/role-management/roles',
		element: <ProtectedComponent rootComponent={<Roles />} />,
		child: [
			{
				id: 9.1,
				label: 'role add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 9.2,
				label: 'role update',
				path: 'update/:id',
				element: null,
				child: [],
			},
			// {
			//   id: 9.3,
			//   label: 'role assign',
			//   path: 'assign',
			//   element: <RoleAssign />,
			//   child: []
			// },
		],
	},
	{
		id: 10,
		label: 'recency',
		path: '/crew-recency/recency',
		element: <ProtectedComponent rootComponent={<Recency />} />,
		child: [
			{
				id: 10.1,
				label: 'recency add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 10.2,
				label: 'recency update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 11,
		label: 'recency assign',
		path: '/crew-recency/assign',
		element: <ProtectedComponent rootComponent={<RecencyAssign />} />,
		child: [
			{
				id: 11.1,
				label: 'recency assign add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 11.2,
				label: 'recency assign update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 12,
		label: 'menu assign',
		path: '/role-management/roles/menu-assign',
		element: <ProtectedComponent rootComponent={<MenuAssign />} />,
		child: [],
	},
	{
		id: 13,
		label: 'employee',
		path: '/crew-management/rated-crews',
		element: <ProtectedComponent rootComponent={<Employee />} />,
		child: [
			{
				id: 13.1,
				label: 'employee add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 13.2,
				label: 'employee update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 14,
		label: 'cockpit crew assign',
		path: '/crew-scheduling/cockpit-crew',
		element: <ProtectedComponent rootComponent={<CockpitCrew />} />,
		child: [],
	},
	{
		id: 15,
		label: 'cabin crew assign',
		path: '/crew-scheduling/cabin-crew',
		element: <ProtectedComponent rootComponent={<CabinCrew />} />,
		child: [],
	},
	{
		id: 16,
		label: 'driver',
		path: '/vehicle-management/driver',
		element: <ProtectedComponent rootComponent={<Driver />} />,
		child: [
			{
				id: 16.1,
				label: 'driver add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 16.2,
				label: 'driver update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 17,
		label: 'vehicle',
		path: '/vehicle-management/vehicle',
		element: <ProtectedComponent rootComponent={<Vehicle />} />,
		child: [
			{
				id: 17.1,
				label: 'vehicle add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 17.2,
				label: 'vehicle update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 18,
		label: 'route',
		path: '/vehicle-management/vehicle-route',
		element: <ProtectedComponent rootComponent={<VccRoute />} />,
		child: [
			{
				id: 18.1,
				label: 'route add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 18.2,
				label: 'route update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 19,
		label: 'role assign',
		path: '/role-management/roles/assign',
		element: <ProtectedComponent rootComponent={<RolesAssign />} />,
		child: [],
	},
	{
		id: 20,
		label: 'receive assign',
		path: '/vehicle-management/receive-assignment',
		element: <ProtectedComponent rootComponent={<ReceiveAssignment />} />,
		child: [
			{
				id: 20.1,
				label: 'receive assign add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 20.2,
				label: 'receive assign update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 21,
		label: 'drop assign',
		path: '/vehicle-management/drop-assignment',
		element: <ProtectedComponent rootComponent={<DropAssignment />} />,
		child: [
			{
				id: 21.1,
				label: 'drop assign add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 21.2,
				label: 'drop assign update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 22,
		label: 'airport pair',
		path: '/configurations/routes',
		element: <ProtectedComponent rootComponent={<AirportPair />} />,
		child: [
			{
				id: 22.1,
				label: 'airport pair add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 22.2,
				label: 'airport pair update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 23,
		label: 'user role details',
		path: '/role-management/roles/user-role-details',
		element: <ProtectedComponent rootComponent={<UserRoleDetails />} />,
		child: [],
	},
	{
		id: 24,
		label: 'flying time',
		path: '/crew-management/flying-time',
		element: <ProtectedComponent rootComponent={<FlyingTime />} />,
		child: [
			{
				id: 22.1,
				label: 'flying time add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 22.2,
				label: 'flying time update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 25,
		label: 'flight season',
		path: '/flight-management/seasons',
		element: <ProtectedComponent rootComponent={<FlightSeason />} />,
		child: [
			{
				id: 22.1,
				label: 'flight season add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 22.2,
				label: 'flight season update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 26,
		label: 'flight schedule',
		path: '/flight-management/schedule',
		element: <ProtectedComponent rootComponent={<FlightSchedule />} />,
		child: [
			{
				id: 26.1,
				label: 'flight schedule add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 26.2,
				label: 'flight schedule update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 27,
		label: 'recency dashboard',
		path: '/crew-recency/dashboard',
		element: <ProtectedComponent rootComponent={<RecencyDashboard />} />,
		child: [],
	},
	{
		id: 28,
		label: 'country',
		path: '/configurations/location/country',
		element: <ProtectedComponent rootComponent={<Country />} />,
		child: [
			{
				id: 28.1,
				label: 'country add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 28.2,
				label: 'country update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 29,
		label: 'area',
		path: '/configurations/location/area',
		element: <ProtectedComponent rootComponent={<Area />} />,
		child: [
			{
				id: 29.1,
				label: 'area add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 29.2,
				label: 'area update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 30,
		label: 'employee leave',
		path: '/crew-management/crew-leaves',
		element: <ProtectedComponent rootComponent={<EmployeeLeave />} />,
		child: [
			{
				id: 30.1,
				label: 'employee leave add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 30.2,
				label: 'employee leave update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 31,
		label: 'user type',
		path: 'user-management/user-type',
		element: <ProtectedComponent rootComponent={<UserType />} />,
		child: [
			{
				id: 31.1,
				label: 'user-type add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 31.2,
				label: 'user-type update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 32,
		label: 'journey log',
		path: 'flight-management/journey-log',
		element: <ProtectedComponent rootComponent={<JourneyLog />} />,
		child: [
			{
				id: 32.1,
				label: 'journey-log add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 32.2,
				label: 'journey-log update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 33,
		label: 'flight status',
		path: 'flight-management/flight-status',
		element: <ProtectedComponent rootComponent={<FlightStatus />} />,
		child: [
			{
				id: 33.1,
				label: 'flight-status add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 33.2,
				label: 'flight-status update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 34,
		label: 'City',
		path: 'configurations/location/city',
		element: <ProtectedComponent rootComponent={<SimTrainingCity />} />,
		child: [
			{
				id: 34.1,
				label: 'city add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 34.2,
				label: 'city update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 35,
		label: 'Sim module',
		path: 'configurations/sim-setup/sim-module',
		element: <ProtectedComponent rootComponent={<SimModule />} />,
		child: [
			{
				id: 35.1,
				label: 'sim module add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 35.2,
				label: 'sim module update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 35,
		label: 'Trainer',
		path: 'configurations/sim-setup/trainer',
		element: <ProtectedComponent rootComponent={<Trainer />} />,
		child: [
			{
				id: 35.1,
				label: 'Trainer add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 35.2,
				label: 'Trainer update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 36,
		label: 'Training Center',
		path: 'configurations/sim-setup/training-center',
		element: <ProtectedComponent rootComponent={<TrainingCenter />} />,
		child: [
			{
				id: 36.1,
				label: 'Training Center add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 36.2,
				label: 'Training Center update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 37,
		label: 'SIM Month History',
		path: 'simulation-training/sim-group',
		element: <ProtectedComponent rootComponent={<SimulationHistory />} />,
		child: [],
	},
	{
		id: 38,
		label: 'Licence Flight',
		path: 'licensing/entry',
		element: <ProtectedComponent rootComponent={<Licence />} />,
		child: [
			{
				id: 38.1,
				label: 'Licence Flight add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 38.2,
				label: 'Licence Flight update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 39,
		label: 'Sim Plan',
		path: 'simulation-training/plan',
		element: <ProtectedComponent rootComponent={<SimPlan />} />,
		child: [
			{
				id: 39.1,
				label: 'Sim Plan add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 39.2,
				label: 'Sim Plan update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 40,
		label: 'Validation',
		path: 'licensing/validation',
		element: <ProtectedComponent rootComponent={<Validation />} />,
		child: [
			{
				id: 40.1,
				label: 'Validation add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 40.2,
				label: 'Validation update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 41,
		label: 'CAAB Corresponding',
		path: 'licensing/caab',
		element: <ProtectedComponent rootComponent={<Caab />} />,
		child: [
			{
				id: 40.1,
				label: 'CAAB add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 40.2,
				label: 'CAAB update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 42,
		label: 'Sim Dashboard',
		path: 'simulation-training/dashboard',
		element: <ProtectedComponent rootComponent={<SimDashboard />} />,
		child: [],
	},
	{
		id: 43,
		label: 'Approval config',
		path: 'role-management/roles/approval-config',
		element: <ProtectedComponent rootComponent={<ApprovalConfigPage />} />,
		child: [],
	},
	{
		id: 44,
		label: 'Employee Group',
		path: 'configurations/sim-setup/employee-group',
		element: <ProtectedComponent rootComponent={<EmployeeGroup />} />,
		child: [
			{
				id: 44.1,
				label: 'Employee group add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 44.2,
				label: 'Employee group update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 45,
		label: 'Flying Dashboard',
		path: 'crew-management/flying-dashboard',
		element: <ProtectedComponent rootComponent={<FlyingDashboard />} />,
		child: [
            {
				id: 45.1,
				label: 'Employee leave details',
				path: 'details/:id',
				element: null,
				child: [],
			},
        ],
	},
	{
		id: 46,
		label: 'Leave Type',
		path: 'configurations/leave-type',
		element: <ProtectedComponent rootComponent={<LeaveType />} />,
		child: [
			{
				id: 46.1,
				label: 'Leave Type add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 46.2,
				label: 'Leave Type update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 48,
		label: 'Cabin crew',
		path: 'crew-management/cabin-crews',
		element: <ProtectedComponent rootComponent={<CabinCrewInfo />} />,
		child: [
			{
				id: 48.1,
				label: 'Cabin crew add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 48.2,
				label: 'Cabin crew update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
	{
		id: 47,
		label: 'Leave Config',
		path: 'configurations/leave-config',
		element: <ProtectedComponent rootComponent={<LeaveConfig />} />,
		child: [
			{
				id: 47.1,
				label: 'Leave Setup add',
				path: 'add',
				element: null,
				child: [],
			},
			{
				id: 47.2,
				label: 'Leave Setup update',
				path: 'update/:id',
				element: null,
				child: [],
			},
		],
	},
    {
		id: 48,
		label: 'Crew Leave Dashboard',
		path: 'crew-management/history',
		element: <ProtectedComponent rootComponent={<CrewsLeaveDashView />} />,
		child: [],
	},
]

export default App
