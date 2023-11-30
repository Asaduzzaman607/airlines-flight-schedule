import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { Breadcrumb, Button } from 'antd'

// import icons
import { ArrowDownOutlined, HomeFilled } from '@ant-design/icons'
import { Link, useLocation, useParams } from 'react-router-dom'
import EmployeeProfileCard from './EmployeeProfileCard'
import EmployeeDetailsSecondLayer from './employeeDetailsComponents/EmployeeDetailsSecondLayer'

const PageHeaderBlockWithDownload = ({ Component, title, Action: DownloadAction, PAYLOAD }) => {
	const [HeaderItem, setHeaderItem] = useState([])
	const { routePermissions } = useSelector((state) => state.auth)
	const { is_exact_path, parent, actions } = routePermissions

	const dispatch = useDispatch()
	const { pathname } = useLocation()
	const { id } = useParams()

	// console.log({is_exact_path, parent, id, pathname, actions}, (`${parent + '/' + id}`), pathname)

	useEffect(() => {
		let newTitle = [title]
		if (newTitle?.length === 1 && pathname.toString()?.includes('details')) {
			newTitle.push('Details')
		}
		setHeaderItem(newTitle)
	}, [pathname, title])

	// Add and Back button action handler
	const OnClickHandler = (buttonTitle) => {
		if (buttonTitle === 'Add') {
			const newValue = HeaderItem
			newValue?.length < 2 && newValue.push('Add')
			setHeaderItem(newValue)
		} else if (buttonTitle === 'Back') {
			const newValue = HeaderItem
			newValue?.length > 1 && newValue.pop()
			setHeaderItem(newValue)
		}
	}

	// for remove route item from header route list
	const HeaderItemHandler = (item) => {
		if (item !== 'Details') {
			const newValue = HeaderItem
			newValue?.length > 1 && newValue.pop()
			setHeaderItem([...newValue])
		}
	}

	return (
		<section className={'p-4 space-y-4 mt-1'}>
			{
				<div className={'flex justify-between items-center'}>
					<Breadcrumb>
						<span className={'font-bold'}>
							<Link to={'/'}>
								<HomeFilled />
							</Link>
							<span className='mx-1'>/</span>
						</span>
						{HeaderItem?.map((item, index) => (
							<Breadcrumb.Item key={index}>
								<Link
									to={item !== 'Details' && `${parent}`}
									onClick={() => HeaderItemHandler(item)}
								>
									<span className='font-bold'>{item}</span>
								</Link>
							</Breadcrumb.Item>
						))}
					</Breadcrumb>
					{is_exact_path && PAYLOAD?.TableData && (
						<Button
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								background: '#1677ff',
								color: 'white',
								fontWeight: 'bold',
								minWidth: '85px',
							}}
							icon={<ArrowDownOutlined />}
							type={'default'}
							size={'middle'}
							onClick={() => dispatch(DownloadAction(PAYLOAD))}
						>
							Download
						</Button>
					)}
				</div>
			}

			{is_exact_path && <Component />}
			{!is_exact_path && <EmployeeDetailsSecondLayer />}
		</section>
	)
}

export default PageHeaderBlockWithDownload
