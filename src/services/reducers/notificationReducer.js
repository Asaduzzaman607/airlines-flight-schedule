import { createSlice } from '@reduxjs/toolkit'

// initial state
const initialState = {
	isLoading: false,
    notifications: [],
    unreadCount: 0,
}

const notificationReducer = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		setIsLoading: (state, action) => {
			state.isLoading = action.payload
		},
        setNotifications: (state, action) => {
            state.notifications.push(action.payload)
            const unreadMsgCount = state.notifications?.length && state.notifications.filter(item => !item.read).length;
            state.unreadCount = unreadMsgCount;
        },
        setClearNotification: (state, action) => {
            state.notifications = action.payload
            // state.unreadCount = state.notifications.filter(item => !item.read).length;
            state.unreadCount = 0;
        },
        setRemoveSingleItem: (state, action) => {
            const findIndex = state.notifications.findIndex(item => item.id === action.payload)
            if(!state.notifications[findIndex].read) {
                state.unreadCount > 0 && state.unreadCount--;
            }
            state.notifications.splice(findIndex, 1);
        },
        setMarkAsReadSingleItem: (state, action) => {
            state.notifications = action.payload
            state.unreadCount > 0 && state.unreadCount--;
        },

	},
})

export const { setIsLoading, setNotifications, setClearNotification, setRemoveSingleItem, setMarkAsReadSingleItem } = notificationReducer.actions
export default notificationReducer.reducer
