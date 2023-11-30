import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// import components
import { Layout, Menu } from 'antd'

// import icons
import { LeftOutlined } from '@ant-design/icons'

// import action
import { tranformIntoMenuList } from '../services/actions/menuAction'
import { setSelectedMenuItemKey } from '../services/reducers/authReducer'

// import release version
import { RELEASE_VERSION } from '../config'

// component
const CustomDrawer = () => {
	// drawer state
	const [collapsed, setCollapsed] = useState(false)
	const [items, setItems] = useState([])
	const [openKeys, setOpenKeys] = useState([])
	const [rootSubmenuKeys, setRootSubmenuKeys] = useState([])

	// distruct menuList from auth redux toolkit
	const { menuList, selectedMenuItemKey } = useSelector((state) => state.auth)

	//navigate hook
	const navigate = useNavigate()
	const dispatch = useDispatch()

	// init life cycle, set root sub menu keys
	useEffect(() => {
		// format the menuList
		const _items = tranformIntoMenuList(menuList)
		setItems(_items)

		const _rootSubmenuKeys = _items?.length > 0 && _items.map((item) => item?.key)

		setRootSubmenuKeys(_rootSubmenuKeys)
	}, [menuList])

	// function for navigate
	const _onSelect = ({ key, selectedKeys }) => {
		// set selected item key to redux
		dispatch(setSelectedMenuItemKey(selectedKeys))

		// navigate keypath
		navigate(key)
	}

	// handle on open change
	const _onOpenChange = (keys) => {
		const latestOpenKey = keys?.length && keys.find((key) => openKeys?.indexOf(key) === -1)

		if (rootSubmenuKeys && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			setOpenKeys(keys)
		} else {
			setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
		}
	}

	return (
		<Layout.Sider
			breakpoint={'xl'}
			onBreakpoint={(isOnBreakpoint) => setCollapsed(isOnBreakpoint)}
			collapsible
			collapsed={collapsed}
			onCollapse={(value) => setCollapsed(value)}
			width={240}
			style={{
				height: 'calc(100vh - 96px)',
				position: 'sticky',
				top: 48,
				overflow: 'auto',
				background: 'white',
			}}
			className={'shadow'}
			trigger={
				RELEASE_VERSION && (
					<div className={'px-2 relative flex justify-start items-center'}>
						<div>{RELEASE_VERSION}</div>
						<div
							className={`absolute top-0.5 ${
								collapsed ? 'right-2' : 'left-1/2 bottom-1'
							}`}
						>
							<LeftOutlined
								className={collapsed && 'rotate-180 transition-all duration-400'}
							/>
						</div>
					</div>
				)
			}
		>
			<Menu
				theme={'light'}
				selectedKeys={selectedMenuItemKey}
				mode={'inline'}
				items={items}
				triggerSubMenuAction={'click'}
				onSelect={_onSelect}
				openKeys={openKeys}
				onOpenChange={_onOpenChange}
			/>
		</Layout.Sider>
	)
}

export default CustomDrawer
