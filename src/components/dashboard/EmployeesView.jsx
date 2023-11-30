import { Suspense, lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { Button, Table } from 'antd'
import { CustomDrawer, CustomModal } from '../commonComponents'
import CockpitCrewAssignToFlight from './CockpitCrewAssignToFlight'

// import icons
import { CloseOutlined } from '@ant-design/icons'

// import actions
import { getFlgithAndRoleList } from '../../services/actions/dashboardAction'
import {
	setInitialFormValuesForUpdateAction,
	setIsDashboardDrawerOpen,
	setSelectedActionKey,
	setSelectedFlight,
} from '../../services/reducers/dashboardReducer'

const EmployeeContainer = lazy(() => import('./EmployeeContainer'))
const DashboardTableFooter = lazy(() => import('./DashboardTableFooter'))
const DashboardTableHeader = lazy(() => import('./DashboardTableHeader'))
const EmployeeCellContainer = lazy(() => import('./EmployeeCellContainer'))

const EmployeesView = () => {
	const [columns, setColumns] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)

	const {
		employeeWithFlights,
		employeeTableColumns,
		isLoading,
		isDashboardDrawerOpen,
		selectedActionKey,
	} = useSelector((state) => state.dashboard)

	const dispatch = useDispatch()

	// init lifecycle hook
	useEffect(() => {
		const _transformedColumns = employeeTableColumns.map((item) => {
			if (item.dataIndex === 'emp') {
				item = {
					...item,
					key: item?.dataIndex,
					fixed: 'left',
					onCell: (obj) => {
						if (obj.rowSpan) {
							return {
								rowSpan: Number(obj.rowSpan),
								onClick: () => {
									return null
								},
							}
						}
						return {}
					},
					align: 'left',
					render: (text, record) => {
						return {
							children: (
								<Suspense fallback={<h1>LOADING..</h1>}>
									<EmployeeContainer employee={text} />
								</Suspense>
							),
						}
					},
					width: 240,
				}
			} else {
				item = {
					...item,
					key: item?.dataIndex,
					render: (text, record) => {
						if (!text) {
							return null
						}
						return (
							<Suspense fallback={<div>loading..</div>}>
								<EmployeeCellContainer cellInfo={text} />
							</Suspense>
						)
					},
					onCell: (cell) => {
						const { emp } = cell
						const { dataIndex: header } = item
						const selectedCellData = cell[header]
						return {
							onClick: () => {
								// check if its not flight
								if (
									selectedCellData?.type === 'leave' ||
									selectedCellData?.type === 'flight'
								) {
									return
								}

								// check if employee id is available and then get flight list and role list of that employee
								if (emp?.id && header) {
									dispatch(setSelectedActionKey('add_new_flight'))
									dispatch(
										setSelectedFlight({
											empName: emp?.name ?? 'N/A',
											flightDate: header,
											empId: emp?.id,
											isForeign: emp?.isForeign,
										})
									)

									dispatch(
										getFlgithAndRoleList({
											employeeId: emp?.id,
											flightDate: header,
										})
									)
								}
							},
						}
					},
					width: 172,
					className: '!p-0 !m-0 relative h-[48px]',
					align: 'center',
					title: (
						<Suspense fallback={'title loading..'}>
							<DashboardTableHeader title={item?.title} />
						</Suspense>
					),
				}
			}
			return item
		})

		setColumns(_transformedColumns)
	}, [employeeWithFlights, employeeTableColumns, dispatch])

	// handle drawer on clonse
	const handleDrawerOnClose = () => {
		// close drawer and set initial value to null
		dispatch(setInitialFormValuesForUpdateAction(null))
		dispatch(setSelectedActionKey(null))
		dispatch(setIsDashboardDrawerOpen(false))
	}
	return (
		<div>
			<Suspense fallback={<div>progressing..</div>}>
				<Table
					rowKey={'employee'}
					columns={isLoading ? [] : [...columns]}
					dataSource={isLoading ? [] : [...employeeWithFlights]}
					pagination={false}
					scroll={{
						y: 'calc(100vh - 214px)',
						x: 'calc(100wh - 340px)',
					}}
					bordered={true}
					size={'small'}
					loading={isLoading}
					footer={() => <DashboardTableFooter />}
					onHeaderRow={(columns, index) => {
						return {
							onClick: () => null,
						}
					}}
				/>
				{isModalOpen && (
					<CustomModal
						title='Flight Assign to Employee Dashboard'
						setIsModalOpen={setIsModalOpen}
						isModalOpen={isModalOpen}
						type={null}
					/>
				)}
				<CustomDrawer
					open={isDashboardDrawerOpen}
					title={selectedActionKey === 'update_crew' ? 'Update Crew' : 'Add New Flight'}
					onClose={handleDrawerOnClose}
					closable={false}
					destroyOnClose={true}
					extra={
						<Button
							type={'primary'}
							size={'small'}
							icon={<CloseOutlined />}
							danger
							onClick={handleDrawerOnClose}
						/>
					}
				>
					<CockpitCrewAssignToFlight />
				</CustomDrawer>
			</Suspense>
		</div>
	)
}

export default EmployeesView
