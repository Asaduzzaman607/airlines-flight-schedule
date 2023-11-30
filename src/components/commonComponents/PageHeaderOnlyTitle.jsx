import { useSelector } from 'react-redux'

// import components
import { Breadcrumb } from 'antd'
import { HomeFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const PageHeaderOnlyTitle = ({ title, Component }) => {
	const { routePermissions } = useSelector((state) => state.auth)
	const { path, key } = routePermissions

	return (
		<section className={'p-4 space-y-4 mt-1'}>
			<div>
				<div className={'flex justify-between items-center'}>
					<Breadcrumb>
						<span className={'font-bold'}>
							<Link to={'/'}>
								<HomeFilled />
							</Link>
							<span className='mx-1'>/</span>
						</span>
						<Breadcrumb.Item className={'font-bold'}>
							<Link>{title}</Link>
						</Breadcrumb.Item>
					</Breadcrumb>
				</div>
			</div>
			{path === key && <Component />}
		</section>
	)
}

export default PageHeaderOnlyTitle
