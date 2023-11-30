import axios from 'axios'

// import icons
import { CgUserList } from 'react-icons/cg'
import { HiUserGroup } from 'react-icons/hi'
import { GiPlaneWing } from 'react-icons/gi'
import { RxDashboard } from 'react-icons/rx'
import { SlUserFemale } from 'react-icons/sl'
import { IoLocationSharp } from 'react-icons/io5'
import { HiDocumentAdd } from 'react-icons/hi'
import { MdDraw } from 'react-icons/md'
import { TbMapPins, TbPlaneInflight } from 'react-icons/tb'
import {
	GrMapLocation,
	GrLocationPin,
	GrUserManager,
	GrCertificate,
	GrWorkshop,
} from 'react-icons/gr'
import { AiOutlineFieldTime, AiOutlineUsergroupDelete, AiOutlineUsergroupAdd } from 'react-icons/ai'
import {
	RiShieldUserFill,
	RiMenuAddFill,
	RiRoadMapFill,
	RiPlaneLine,
	RiFileList3Fill,
	RiPassValidFill,
} from 'react-icons/ri'
import {
	BsFillCalendarRangeFill,
	BsFillFileLock2Fill,
	BsFileEarmarkLock2,
	BsPersonBoundingBox,
	BsClipboard2CheckFill,
} from 'react-icons/bs'
import {
	FaCalendarAlt,
	FaListAlt,
	FaUserTag,
	FaUsers,
	FaUserAstronaut,
	FaCalendarTimes,
	FaRoute,
	FaCarSide,
	FaUsersCog,
	FaUserCheck,
	FaUserShield,
	FaMap,
	FaCalendarCheck,
	FaClipboard,
	FaUserClock,
} from 'react-icons/fa'

import { PiAlignCenterHorizontalFill, PiCertificateLight } from 'react-icons/pi'
import { LuMailPlus } from 'react-icons/lu'

// import reducer actions
import {
	setSelectedMenuItemKey,
	setRoutePermissions,
	setMenuList,
	setIsLoading,
} from '../reducers/authReducer'

// import api config
import { MENU } from '../../config'

// import actions
import { getErrorMsg, showAlert } from './commonActions'

// get current path from location
const getCurrentPath = (pathname) => {
	return (dispatch, getState) => {
		// get menuList from authReducer
		const { menuList } = getState().auth

		// check if pathname is not valid
		if (!pathname || pathname === '/' || !menuList || menuList?.length === 0) {
			dispatch(setSelectedMenuItemKey(''))
		}

		dispatch(setSelectedMenuItemKey(pathname))

		dispatch(_checkPermission(pathname, menuList))
	}
}

// icon list as per menu key
const icons = {
	default: <RxDashboard />,
	'/user-management': <FaUsersCog />,
	'/user-management/user': <CgUserList />,
	'/user-management/user-type': <FaUserCheck />,

	'/role-management': <RiShieldUserFill />,
	'/role-management/roles': <HiUserGroup />,
	'/role-management/roles/assign': <FaUserShield />,
	'/role-management/roles/menu-assign': <RiMenuAddFill />,
	'/role-management/roles/user-role-details': <FaUserShield />,

	'/flight-management': <TbPlaneInflight />,

	'/flight-management/airport-aircraft': <FaMap />,
	'/configurations/airport': <RiRoadMapFill />,
	'/configurations/routes': <TbMapPins />,
	'/configurations/aircraft-type': <GiPlaneWing />,
	'/configurations/aircraft': <RiPlaneLine />,
	'/configurations/sim-setup/training-center': <PiAlignCenterHorizontalFill />,
	'/configurations/sim-setup/trainer': <GrUserManager />,

	'/flight-management/flight': <TbPlaneInflight />,
	'/flight-management/seasons': <FaCalendarAlt />,
	'/flight-management/schedule': <BsFillCalendarRangeFill />,
	'/flight-management/flight-info': <FaListAlt />,
	'/flight-management/aircraft-assign': <FaCalendarCheck />,
	'/flight-management/journey-log': <RiFileList3Fill />,

	'/crew-management': <FaUserTag />,
	'/crew-management/rated-crews': <FaUsers />,
	'/crew-scheduling/cockpit-crew': <FaUserAstronaut />,
	'/crew-scheduling/cabin-crew': <SlUserFemale />,
	'/crew-management/flying-time': <AiOutlineFieldTime />,
	'/crew-management/crew-leaves': <FaCalendarTimes />,
	'/crew-management/location': <IoLocationSharp />,
	'/crew-management/location/country': <GrMapLocation />,
	'/crew-management/location/area': <GrLocationPin />,

	'/recency-management': <BsFillFileLock2Fill />,
	'/crew-recency/recency': <BsFileEarmarkLock2 />,
	'/crew-recency/assign': <HiDocumentAdd />,
	'/crew-recency/dashboard': <RxDashboard />,

	'/vehicle-management': <FaCarSide />,
	'/vehicle-management/driver': <BsPersonBoundingBox />,
	'/vehicle-management/vehicle-assign': <MdDraw />,
	'/vehicle-management/vehicle': <FaCarSide />,
	'/vehicle-management/receive-assignment': <AiOutlineUsergroupAdd />,
	'/vehicle-management/drop-assignment': <AiOutlineUsergroupDelete />,
	'/vehicle-management/vehicle-route': <FaRoute />,

	'/simulation-training': <GrWorkshop />,
	'/simulation-training/plan': <FaClipboard />,
	'/simulation-training/history': <FaUserClock />,
	'/simulation-training/dashboard': <BsClipboard2CheckFill />,

	'/licensing': <GrCertificate />,
	'/licensing/entry': <PiCertificateLight />,
	'/licensing/validation': <RiPassValidFill />,
	'/licensing/caab': <LuMailPlus />,
}

// function for tranform a menuList as antd format
const tranformIntoMenuList = (menus, disablecheck) => {
	// check if menu is invalid or empty
	if (!menus || menus?.length === 0) {
		return false
	}

	// transform individual item object and validate children
	const _transformItem = (menu, child) => {
		let item = {
			label: menu?.label,
			key: menu?.key,
			is_sidebar: menu?.is_sidebar ? 1 : 0,
			module_id: menu?.module_id ?? menu?.menu_id,
			menu_id: menu?.menu_id ?? menu?.module_id,
			title: menu?.label,
			disableCheckbox: disablecheck ?? null,
			icon: (menu?.key && icons[menu.key]) ?? icons['default'],
		}

		if (child) {
			item.children = child
		}
		return item
	}

	// filter out is_sidebar and go through every menu items
	const temp = menus
		.filter((i) => i.is_sidebar)
		.map((_tempMenu) => {
			// check if menu has children
			if (_tempMenu?.sub_menu && _tempMenu?.sub_menu?.length > 0 && _tempMenu?.is_sidebar) {
				let children = tranformIntoMenuList(_tempMenu.sub_menu, disablecheck)
				return _transformItem(_tempMenu, children)
			}

			// check if menus is not valid
			if (!_tempMenu?.sub_menu || _tempMenu?.sub_menu?.length === 0) {
				return _transformItem(_tempMenu)
			}
			return false
		})
	return temp?.length > 0 && temp
}

// check permission
const _checkPermission = (path, menus) => {
	return (dispatch) => {
		const _extractedPath = path.split('/')

		// check if extract path has minimum length of 2
		if (_extractedPath?.length > 1) {
			_extractedPath.shift()

			// check for module permission
			const _hasModulePermission =
				menus && menus.filter((menu) => menu?.key === '/' + _extractedPath[0])?.[0]

			// when module path available
			if (_hasModulePermission) {
				let matched_path = { key: '' }
				_hasModulePermission?.route_permission?.length > 0 &&
					_hasModulePermission?.route_permission.forEach((item) => {
						if (
							path.includes(item?.key) &&
							matched_path?.key.length < item?.key.length
						) {
							matched_path = {
								...item,
								parent: item?.key,
							}
						}
					})

				// set selecte key; used for menu item selection
				dispatch(setSelectedMenuItemKey(matched_path?.key))

				// check if, exact path found and has view page
				if (matched_path?.parent === path) {
					dispatch(
						setRoutePermissions({
							...matched_path,
							has_permission: true,
							is_exact_path: true,
							path,
							_sub_menu:
								_hasModulePermission?.sub_menu?.find((item) => item?.key === path)
									?.sub_menu ?? null,
							_menu_id:
								_hasModulePermission?.sub_menu?.find((item) => item?.key === path)
									?.menu_id ?? null,
							_module_id: _hasModulePermission?.module_id,
						})
					)
				}

				// check if path is not exact and has child pages
				if (matched_path?.parent !== path && matched_path?.show_pages?.length > 0) {
					// check if the path has child page
					const _hasPage = matched_path.show_pages.find((item) => path.includes(item))

					// check if, the path itself a sub menu item, then change selected menu key item
					const _isMenuItem = _hasModulePermission?.sub_menu?.some(
						(sm) => sm?.key === path && sm?.is_sidebar === true
					)
					// set selecte key; used for menu item selection
					dispatch(setSelectedMenuItemKey(_isMenuItem ? path : matched_path?.key))

					dispatch(
						setRoutePermissions({
							...matched_path,
							has_permission:
								_hasPage && matched_path?.actions?.length > 0 ? true : false,
							is_exact_path: false,
							key: _isMenuItem ? path : matched_path?.key,
							path,
							_sub_menu:
								_hasModulePermission?.sub_menu?.find((item) => item?.key === path)
									?.sub_menu ?? null,
							_menu_id:
								_hasModulePermission?.sub_menu?.find((item) => item?.key === path)
									?.menu_id ?? null,
							_module_id: _hasModulePermission?.module_id,
						})
					)
				}

				// when path has no children
				if (matched_path?.parent !== path && matched_path?.show_pages?.length === 0) {
					dispatch(
						setRoutePermissions({
							...matched_path,
							has_permission: false,
							is_exact_path: false,
							path,
							_sub_menu:
								_hasModulePermission?.sub_menu?.find((item) => item?.key === path)
									?.sub_menu ?? null,
							_menu_id:
								_hasModulePermission?.sub_menu?.find((item) => item?.key === path)
									?.menu_id ?? null,
							_module_id: _hasModulePermission?.module_id,
						})
					)
				}
			}

			// when module route not found
			if (!_hasModulePermission) {
				dispatch(
					setRoutePermissions({
						has_permission: false,
						key: '/',
						show_pages: [],
						actions: [],
						is_exact_path: false,
						path,
						parent: '/',
					})
				)
			}
		}
	}
}

// get menu list
const getMenuList = () => {
	return async (dispatch) => {
		// set isLoading to true while fetching user data
		dispatch(setIsLoading(true))

		try {
			// get menu type
			const { data } = await axios.get(MENU.GET_MODULE)

			// set menu to menuList
			dispatch(setMenuList(data))
		} catch (error) {
			console.error(error)

			// get error msg, then show error alert
			const errMsg = getErrorMsg(error)
			showAlert('error', errMsg ?? 'Something went wrong.')
		} finally {
			// set isLoading to false since data fetching has an error.
			dispatch(setIsLoading(false))
		}
	}
}

// add menu
const addMenu = (params) => {
	return async (dispatch) => {
		// Set isLoading to true
		dispatch(setIsLoading(true))
		try {
			// add role api call
			const { data } = await axios.post(MENU.ADD_MODULE, params)

			// show success message
			showAlert('success', data?.message ?? 'Created successfully.')

			// reload the page
			window.location.reload()
		} catch (err) {
			const errMsg = getErrorMsg(err)

			// show error message
			showAlert('error', errMsg)
		} finally {
			// Set isLoading to false
			dispatch(setIsLoading(false))
		}
	}
}

// export func
export { getCurrentPath, tranformIntoMenuList, getMenuList, addMenu }
