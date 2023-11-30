import { createSlice } from '@reduxjs/toolkit'

// initialize auth state
const initialState = {
    isLoading: false,
    isAuthenticated: false,
    user: null,
    aircraftTypePermission: [],
    errorMsg: null,
    isAuthValidating: false,
    menuList: null,
    allmenuList: null,
    selectedMenuItemKey: null,
    routePermissions: {
        has_permission: false,
        actions: [],
        key: '',
        showPages: [],
        is_exact_path: false
    }
}

// create reducer actions
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload
        },
        setUser: (state, action) => {
            state.aircraftTypePermission = action.payload?.aircraftTypePermission?.map(item => item.id)
            state.user = action.payload
            state.menuList = action.payload?.accessRight?.[0]?.userModule ?? null
        },
        setMenuList: (state, action) => {
            state.allmenuList = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setIsAuthValidating: (state, action) => {
            state.isAuthValidating = action.payload
        },
        setSelectedMenuItemKey: (state, action) => {
            state.selectedMenuItemKey = action.payload
        },
        setRoutePermissions: (state, action) => {
            state.routePermissions = action.payload
        }
    }
})

// export actions
export const { setIsLoading, setIsAuthenticated, setUser, setErrorMsg, setIsAuthValidating, setSelectedMenuItemKey, setRoutePermissions, setMenuList } = authSlice.actions
export default authSlice.reducer