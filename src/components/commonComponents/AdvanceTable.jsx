import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { utils, writeFileXLSX } from 'xlsx'

// import components
import { Button, Checkbox, Divider, Dropdown, Input, Menu, Tooltip } from 'antd'
import { MaterialReactTable } from 'material-react-table'

// import icons
import { AiOutlineSearch } from 'react-icons/ai'
import { BsDownload, BsFilter, BsLayoutThreeColumns } from 'react-icons/bs'
import { HiOutlineMenu, HiOutlineMenuAlt4 } from 'react-icons/hi'
import { ImMenu } from 'react-icons/im'
import { RiFullscreenExitFill, RiFullscreenFill, RiSettings5Line } from 'react-icons/ri'

const AdvanceTable = ({
	columns,
	data,
	isLoading,
	action,
	pagination,
	enableCheckbox,
	enableFilter = true,
	enableGroupColumns,
	enablePagination,
	enableGlobalFilter,
	leftRenderToolbar,
	rightRenderToolbar,
	enableRowNumbers,
	excelFormatedDataFunc,
	...restProps
}) => {
	// column & data
	const [_columns, _setColumns] = useState([])
	const [_data, _setData] = useState([])

	// boolean states
	const [isFullScreen, setIsFullScreen] = useState(false)
	const [isColumnsFilterShow, setIsColumnsFilterShow] = useState(false)

	// table column density tracking state
	const [densityIndex, setDensityIndex] = useState(1)

	// options visibility checkbox
	const [selectedOptionList, setSelectedOptionList] = useState(['Sort'])

	// setting options
	const [options, setOptions] = useState({
		resize: false,
		order: false,
		setting: false,
		sort: true,
	})

	// api filtering
	const [columnFilters, setColumnFilters] = useState([])

	//pagination
	const [_pagination, _setPagination] = useState({
		pageIndex: 0,
		pageSize: pagination?.defaultPageSize ?? 20,
	})
	const [_rowCount, _setRowCount] = useState(0)
	const [_pageCount, _setPageCount] = useState(0)
	const [isResetPageIndex, setIsResetPageIndex] = useState(false)
	//global filter
	const [globalFilter, setGlobalFilter] = useState()

	//column pining
	const [columnPinning, setColumnPinning] = useState({
		left: [],
		right: [],
	})
	// column filtering
	const [plainColumnsList, setPlainColumnsList] = useState([])
	const [selectedColumnList, setselectedColumnList] = useState([])
	const [indeterminate, setIndeterminate] = useState(false)
	const [checkAll, setCheckAll] = useState(true)

	//filter value of column
	const filterValues = useMemo(
		() =>
			columnFilters?.reduce((obj, item) => {
				return { ...obj, [item?.id]: item?.value }
			}, {}),
		[columnFilters]
	)

	const handleExport = useCallback(
		(dataSource) => {
			const data = dataSource?.map((item) =>
				_columns.reduce((newData, col) => {
					if (item[col?.accessorKey]) {
						newData[col?.accessorKey] = item[col?.accessorKey]
					}
					return newData
				}, {})
			)
			const wb = utils.book_new()
			const ws = utils.json_to_sheet(
				excelFormatedDataFunc ? excelFormatedDataFunc(selectedColumnList) : data,
				{
					origin: 'A2',
					skipHeader: true,
				}
			)
			utils.sheet_add_aoa(ws, [
				selectedColumnList?.map((header) => header !== 'Actions' && [header]),
			])
			utils.book_append_sheet(wb, ws, 'Data')
			writeFileXLSX(wb, `${leftRenderToolbar?.props?.title}.xlsx`)
		},
		[_columns]
	)

	const handleDensity = useCallback(
		(table) => {
			const arr = ['comfortable', 'spacious', 'compact']
			table.setDensity(arr[densityIndex])
			setDensityIndex((densityIndex + 1) % arr.length)
		},
		[densityIndex]
	)

	const handleFullScreen = useCallback(
		(table) => {
			table.setIsFullScreen(!isFullScreen)
			setIsFullScreen(!isFullScreen)
		},
		[isFullScreen]
	)

	const handleFilter = useCallback(
		(table) => {
			table.setShowColumnFilters(!isColumnsFilterShow)
			setIsColumnsFilterShow(!isColumnsFilterShow)
			// set pagination page reset false
			setIsResetPageIndex(false)
		},
		[isColumnsFilterShow]
	)

	//handle visibility of setting option
	const handleOptions = useCallback((list) => {
		setSelectedOptionList(list)
		setOptions((prevState) => {
			const newOptions = { ...prevState }
			newOptions.resize = list?.includes('Resize')
			newOptions.order = list?.includes('Order')
			newOptions.setting = list?.includes('Settings')
			newOptions.sort = list?.includes('Sort')
			return newOptions
		})
	}, [])

	//handle visibility of column option
	const handleToggleColumn = (columnList) => {
		const newColumn =
			enableGroupColumns &&
			columns?.map((parent) => ({
				...parent,
				columns: parent?.columns?.filter((child) =>
					columnList?.includes(parent?.header !== '' ? parent?.header : child?.header)
				),
			}))
		_setColumns(
			enableGroupColumns
				? newColumn?.filter((item) => item?.columns?.length)
				: columns?.filter((item) => columnList?.includes(item?.header))
		)
		setselectedColumnList(columnList)
		setIndeterminate(!!columnList.length && columnList.length < plainColumnsList.length)
		setCheckAll(columnList.length === plainColumnsList.length)
	}

	//handle check all option
	const _handleAllSelectOfColumn = (checked) => {
		setIndeterminate(false)
		setCheckAll(checked)
		if (checked) {
			const newColumn = columns?.map((parent) => ({
				...parent,
				columns: parent?.columns?.filter((child) =>
					plainColumnsList?.includes(
						parent?.header !== '' ? parent?.header : child?.header
					)
				),
			}))
			const filteredColumns = enableGroupColumns
				? newColumn?.filter((item) => item?.columns?.length)
				: columns?.filter((item) => plainColumnsList?.includes(item?.header))
			_setColumns(filteredColumns)
			setselectedColumnList(plainColumnsList)
		} else {
			setselectedColumnList([])
			_setColumns([])
		}
	}

	// get data after pageIndex changes
	useEffect(() => {
		if (
			(_pagination?.pageIndex !== pagination?.pageIndex &&
				pagination?.pageSize !== _pagination?.pageSize) ||
			pagination?.pageSize !== _pagination?.pageSize
		) {
			return
		}
		if (_pagination?.pageIndex === 0 && pagination?.pageIndex === 1) {
			return
		}

		pagination &&
			pagination?.onChange(_pagination?.pageIndex, _pagination?.pageSize, filterValues)
		setIsResetPageIndex(false)
	}, [_pagination?.pageIndex])

	// get data after filter changes and then reset page
	useEffect(() => {
		if (!columnFilters.length && !isResetPageIndex) {
			return
		}
		const timer = setTimeout(() => {
			pagination?.onChange(0, _pagination?.pageSize, filterValues)
		}, 500)
		setIsResetPageIndex(true)
		return () => {
			clearTimeout(timer)
		}
	}, [columnFilters])

	// get data after pageSize changes and then reset page
	useEffect(() => {
		if (!pagination?.pageSize || _pagination?.pageSize === pagination?.pageSize) {
			return
		}
		setIsResetPageIndex(true)
		pagination && pagination?.onChange(0, _pagination?.pageSize, filterValues)
	}, [_pagination?.pageSize])

	// update pagination totalPage and totalRows
	useEffect(() => {
		if (pagination?.totalPage && pagination?.totalElements) {
			_setPageCount(pagination?.totalPage)
			_setRowCount(pagination?.totalElements)
		}
	}, [pagination])

	// check if columns has updated
	useEffect(() => {
		if (Array.isArray(columns)) _setColumns(columns)
	}, [columns])

	// check if data has updated
	useEffect(() => {
		if (Array.isArray(data)) _setData(data)
	}, [data])

	// useEffect for initially selected list of columns
	useEffect(() => {
		const _plainColumnsList = columns?.length
			? enableGroupColumns
				? columns
						?.map((parent) =>
							parent?.header !== ''
								? parent?.header
								: parent?.columns?.map((child) => child?.header)
						)
						?.flat()
				: columns?.map((item) => item?.header)
			: []
		setPlainColumnsList(_plainColumnsList)
		setselectedColumnList(_plainColumnsList)
	}, [columns, enableGroupColumns])

	return (
		<MaterialReactTable
			{...restProps}
			columns={_columns}
			data={_data}
			initialState={{
				showColumnFilters: false,
				density: 'comfortable',
			}}
			enableRowSelection={enableCheckbox}
			enableColumnOrdering={options?.order}
			enableColumnResizing={options?.resize}
			enableSorting={options.sort}
			enableColumnActions={options.setting}
			enablePinning={true}
			enableHiding={false}
			rowNumberMode='original'
			enableRowNumbers={enableRowNumbers ?? true}
			showSkeletons={true}
			enableStickyHeader={true}
			layoutMode='grid'
			enablePagination={enablePagination ?? true}
			//trigger column pining
			onColumnPinningChange={setColumnPinning}
			//reset page after filtered and pageSize change
			autoResetPageIndex={isResetPageIndex}
			//all states

			state={{
				columnFilters,
				columnPinning,
				globalFilter,
				isLoading,
				pagination: _pagination,
			}}
			//pagination total page number
			rowCount={_rowCount}
			pageCount={_pageCount}
			//on change pagination update
			onPaginationChange={_setPagination}
			// enable manual pagination
			manualPagination={enablePagination ?? true}
			onColumnFiltersChange={setColumnFilters}
			// 'mui*' all table styling bellow
			muiTablePaperProps={{
				sx: {
					py: '0.5rem',
					boxShadow: 0,
					borderRadius: isFullScreen ? 0 : 3,
				},
			}}
			muiTableHeadCellProps={{
				sx: {
					color: '#46649E',
					background: '#F1F4FF',
					paddingY: '10px',
				},
			}}
			muiBottomToolbarProps={{
				sx: {
					display: enablePagination ? 'block' : 'none',
				},
			}}
			muiTablePaginationProps={{
				rowsPerPageOptions: pagination?.pageSizeOptions ?? [20, 50, 100, 200],
				showFirstButton: false,
				showLastButton: false,
			}}
			muiTableContainerProps={{
				sx: {
					height: 'calc(100vh - 250px)',
				},
			}}
			// render top toolbar
			renderTopToolbar={({ table }) => {
				return (
					<div className='flex flex-col lg:flex-row justify-between items-center px-4'>
						{leftRenderToolbar}
						<div className={'flex justify-end items-center gap-3 flex-wrap'}>
							{rightRenderToolbar}
							{enableGlobalFilter && (
								<div className={'mb-4'}>
									<Input
										addonBefore={<AiOutlineSearch />}
										placeholder='Search'
										onChange={(e) => setGlobalFilter(e.target.value)}
									/>
								</div>
							)}
							{enableFilter && (
								<div className={'mb-4'}>
									<Button
										type={isColumnsFilterShow ? 'primary' : 'default'}
										icon={<BsFilter />}
										onClick={() => handleFilter(table)}
										className={'flex justify-center items-center gap-1'}
									>
										{'Filter'}
									</Button>
								</div>
							)}
							<div className={'mb-4'}>
								<CustomDropdown
									icon={<BsLayoutThreeColumns />}
									title={'Columns'}
									enableSelectAllOption={true}
									indeterminate={indeterminate}
									checked={checkAll}
									handleSelectAll={_handleAllSelectOfColumn}
									columnList={plainColumnsList}
									value={selectedColumnList}
									handleChange={handleToggleColumn}
								/>
							</div>
							<div className={'mb-4'}>
								<CustomDropdown
									icon={<RiSettings5Line />}
									title={'Options'}
									columnList={['Resize', 'Order', 'Settings', 'Sort']}
									value={selectedOptionList}
									handleChange={handleOptions}
								>
									{!enableGroupColumns && (
										<div className={'grid gap-2 p-2'}>
											<Divider className={'-my-1'} />
											<div>
												<Button
													icon={<BsDownload />}
													onClick={() => handleExport(_data)}
													className={
														'flex justify-center items-center gap-1'
													}
												>
													{'Export'}
												</Button>
											</div>
											{enableCheckbox && (
												<div>
													<Button
														disabled={
															!table.getIsSomeRowsSelected() &&
															!table.getIsAllRowsSelected()
														}
														className={
															'flex justify-center items-center gap-2'
														}
														onClick={() =>
															handleExport(
																table.getSelectedRowModel().rows
																	.original
															)
														}
														icon={<BsDownload />}
													>
														{'Export Selected Rows'}
													</Button>
												</div>
											)}
										</div>
									)}
								</CustomDropdown>
							</div>
							<div className={'flex items-center space-x-4 mb-4'}>
								<Button
									type={'default'}
									icon={
										densityIndex === 0 ? (
											<ImMenu className={'text-[20px]'} />
										) : densityIndex === 1 ? (
											<HiOutlineMenu className={'text-[20px]'} />
										) : (
											<HiOutlineMenuAlt4 className={'text-[20px]'} />
										)
									}
									onClick={() => handleDensity(table)}
									className={'flex justify-center items-center gap-1'}
								>
									{'Density'}
								</Button>
								<div
									className={'cursor-pointer flex items-center'}
									onClick={() => handleFullScreen(table)}
								>
									<Tooltip placement={'top'} title={'Full Screen'}>
										{isFullScreen ? (
											<RiFullscreenExitFill className={'text-[20px]'} />
										) : (
											<RiFullscreenFill className={'text-[20px]'} />
										)}
									</Tooltip>
								</div>
							</div>
						</div>
					</div>
				)
			}}
		/>
	)
}

const CustomDropdown = ({
	icon,
	title,
	columnList,
	value,
	handleChange,
	handleSelectAll,
	enableSelectAllOption,
	children,
	indeterminate,
	checked,
}) => {
	const [visible, setVisible] = useState(false)
	const menu = (
		<>
			<Menu>
				{enableSelectAllOption && (
					<>
						<Checkbox
							className={'px-2 pb-2 w-full'}
							indeterminate={indeterminate}
							checked={checked}
							onChange={(e) => handleSelectAll(e.target.checked)}
						>
							Select All
						</Checkbox>
						<Divider style={{ margin: 0 }} />
					</>
				)}

				<Checkbox.Group value={value} className={'grid p-2'} onChange={handleChange}>
					{columnList?.map((item, index) => (
						<div key={index}>
							<Checkbox value={item}>{item}</Checkbox>
						</div>
					))}
				</Checkbox.Group>
				{children}
			</Menu>
		</>
	)
	return (
		<Dropdown
			open={visible}
			onOpenChange={(flag) => setVisible(flag)}
			overlay={menu}
			trigger={['click']}
		>
			<Button className={'flex justify-center items-center gap-2 pl-1'}>
				{icon} {title}
			</Button>
		</Dropdown>
	)
}

export default AdvanceTable
