import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// import Components
import { Tag, Select, Divider, Segmented } from 'antd'
import { AdvanceTable, TableTitle } from '../../commonComponents'

// import actions
import { getRecencyDashboardData } from '../../../services/actions/RecencyManagementActions/recencyDashboardAction'

const TableView = () => {
	const [_customHeader, setCustomHeader] = useState([])
	const [_crewType, setCrewType] = useState('CABIN_CREW')

	// get Recency state values from redux
	const { isLoading, recency_dashboard_data } = useSelector((state) => state.recencyDashboard)
	const { user } = useSelector((state) => state.auth)
	const [_aircraftType, setAircraftType] = useState(user?.aircraftTypePermission?.[0]?.id)
	const [tableTitle, setTableTile] = useState('')
	const _setColor = {
		0: '#6554AF',
		1: '#2E8A99',
		2: '#F29727',
		3: '#66347F',
		4: '#884A39',
		5: '#5C8984',
		6: '#8D7B68',
		7: '#1B9C85',
		8: '#643843',
		9: '#B71375',
		10: '#557153',
		11: '#576CBC',
		12: '#002B5B',
		13: '#DF7857',
	}

	useEffect(() => {
		const { header } = recency_dashboard_data

		const _createChildren = (headerItem) => {
			if (!headerItem || headerItem?.length === 0) {
				return []
			}
			const _children = headerItem?.map((item) => {
				if (item?.key === 'daysLeft') {
					return {
						header: item?.title,
						accessorKey: item?.dataIndex,
						enableColumnFilter: false,
						Cell: ({ row, column }) => (
							<RenderDaysLeft
								text={
									row?.original?.[column?.parent?.id]?.[item?.dataIndex] ?? 'N/A'
								}
							/>
						),
					}
				} else if (item?.key === 'expired') {
					return {
						header: item?.title,
						accessorKey: item?.dataIndex,
						enableColumnFilter: false,
						Cell: ({ row, column }) =>
							row?.original?.[column?.parent?.id]?.[item?.dataIndex] ?? 'N/A',
					}
				} else if (item?.key === 'renewed') {
					return {
						header: item?.title,
						accessorKey: item?.dataIndex,
						enableColumnFilter: false,
						Cell: ({ row, column }) =>
							row?.original?.[column?.parent?.id]?.[item?.dataIndex] ?? 'N/A',
					}
				} else {
					return {
						header: item?.title,
						accessorKey: item?.dataIndex,
						enableColumnFilter: false,
					}
				}
			})
			return _children
		}

		if (header?.length > 0) {
			const _customHeader = header?.map((_header, index) => {
				if (_header?.children.length > 0) {
					if (index === 0) {
						setTableTile(_header?.title)
					}
					return {
						muiTableHeadCellProps: {
							sx: {
								backgroundColor: _setColor[index] ?? '#70ad47',
								padding: '12px',
								fontWeight: 'bold',
								color: 'white',
							},
						},
						header: index === 0 ? 'Generale Information' : _header?.title,
						columns: _createChildren(_header?.children),
					}
				}
			})
			setCustomHeader(_customHeader)
		}
	}, [recency_dashboard_data])

	const RenderDaysLeft = ({ text }) => {
		const _setStatusColor = (days) => {
			if (days <= 0) {
				return '#DC143C'
			}
			if (days <= 15) {
				return '#FF5733'
			}
			if (days <= 30) {
				return '#0047AB'
			}
			if (days <= 60) {
				return '#FFBF00'
			}
			return ''
		}
		return <Tag color={_setStatusColor(text)}>{text}</Tag>
	}

	// initialize dispatch func.
	const dispatch = useDispatch()

	// user type onchange handler
	const _selectUserTypeHandler = (value) => {
		dispatch(getRecencyDashboardData({ crewType: value, aircraftTypeId: _aircraftType }))
		setCrewType(value)
	}

	// user type onchange handler
	const _selectAircraftTypeHandler = (value) => {
		dispatch(getRecencyDashboardData({ aircraftTypeId: value, crewType: _crewType }))
		setAircraftType(value)
	}

	useEffect(() => {
		dispatch(
			getRecencyDashboardData({
				crewType: _crewType,
				aircraftTypeId: _aircraftType,
			})
		)
	}, [])

	return (
		<>
			<div className={'flex justify-between'}>
				<div className={'flex gap-2'}>
					<div>
						<Segmented
							options={[
								{ label: 'CABIN CREW', value: 'CABIN_CREW' },
								{ label: 'COCKPIT CREW', value: 'COCKPIT_CREW' },
							]}
							defaultValue={'CABIN_CREW'}
							onChange={_selectUserTypeHandler}
							className={'bg-blue-50 drop-shadow'}
						/>
					</div>
					<div className={'pr-2'}>
						<Select
							style={{ width: '100%', minWidth: '200px' }}
							placeholder={'Select aircraft type'}
							onChange={_selectAircraftTypeHandler}
							defaultValue={user?.aircraftTypePermission?.[0]?.aircraftTypeName}
						>
							{user?.aircraftTypePermission?.length > 0 &&
								user?.aircraftTypePermission?.map((item) => (
									<Select.Option value={item.id} key={item.id}>
										{item?.aircraftTypeName ?? 'N/A'}
									</Select.Option>
								))}
						</Select>
					</div>
				</div>
			</div>
			<AdvanceTable
				leftRenderToolbar={<TableTitle title={tableTitle} />}
				columns={_customHeader}
				data={recency_dashboard_data.data}
				isLoading={isLoading}
				enableFilter={false}
				enablePagination={false}
				enableRowNumbers={false}
				enableGroupColumns={true}
				enableGlobalFilter={true}
			/>
		</>
	)
}

export default TableView
