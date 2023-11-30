// import components
import { Drawer } from 'antd'

const CustomDrawer = ({
	title,
	width,
	open,
	onClose,
	extra,
	cleanUpFunc,
	children,
	...restProps
}) => {
	return (
		<Drawer
			{...restProps}
			title={title}
			width={width ?? 420}
			onClose={onClose}
			open={open}
			bodyStyle={{
				paddingBottom: 80,
			}}
			headerStyle={{
				padding: '14px',
			}}
			extra={extra}
		>
			{children}
		</Drawer>
	)
}

export default CustomDrawer
