// import components
import { ProtectedComponent } from '../routes'
import { User, Dashboard } from '../pages'
// import state values
// import actions

// create an array for route along with components, actions and state values
const routeComponents = [
    {
        id: 1,
        label: 'home',
        path: '/',
        element: <Dashboard />,
        child: []
    },
    {
        id: 2,
        label: 'user',
        path: '/user',
        element: <ProtectedComponent rootComponent={ <User /> } />,
        child: [
            {
                id: 2.1,
                label: 'user add',
                path: 'add',
                element: null,
                child: []
            },
            {
                id: 2.2,
                label: 'user update',
                path: 'update/:id',
                element: null,
                child: []
            },
        ]
    }
]

export default routeComponents