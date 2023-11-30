import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { utils, writeFileXLSX } from 'xlsx'

// import components
import MaterialReactTable from 'material-react-table'
import { AutoComplete, Button, Checkbox, Dropdown, Input, Menu, Tooltip } from 'antd'

// import icons
import { RiFullscreenFill, RiFullscreenExitFill, RiSettings5Line } from 'react-icons/ri'
import { BsDownload, BsFilter, BsLayoutThreeColumns, BsPlus } from 'react-icons/bs'
import { HiOutlineMenu, HiOutlineMenuAlt4 } from 'react-icons/hi'
import { ImMenu } from 'react-icons/im'

const CustomTable = ({ columns, dataSource, loading, action, paginationData }) => {
	const [_columns, _setColumns] = useState([])
	const [_dataSource, _setDataSource] = useState([])

	const columnList = columns?.length > 0 ? columns.map((item) => item['header']) : []
	const [isColumnsFilterShow, setIsColumnsFilterShow] = useState(false)
	const [isFullScreen, setIsFullScreen] = useState(false)
	const [densityIndex, setDensityIndex] = useState(1)
	const [options, setOptions] = useState({
		resize: false,
		order: false,
		setting: false,
		sort: false,
	})
	const [visibleColumns, setVisibleColumns] = useState(columnList)
	const [selectedOptionList, setSelectedOptionList] = useState([])

	const [globalFilter, setGlobalFilter] = useState('')
	const [pagination, setPagination] = useState({
		pageIndex: paginationData?.currentPage ?? 1,
		pageSize: paginationData?.currentPageSize ?? 10,
	})
	const filteredColumn = columns.filter((column) => visibleColumns.includes(column.header))
	const filteredData =
		dataSource?.length > 0
			? dataSource.map((item) =>
					filteredColumn.reduce((newData, col) => {
						if (item[col.accessorKey]) {
							newData[col.accessorKey] = item[col.accessorKey]
						}
						return newData
					}, {})
			  )
			: []

	const dispatch = useDispatch()
	useEffect(() => {
		//do something when the pagination state changes
		console.log({ pagination })
		// get Data List initially.
		action && dispatch(action({ page: pagination.pageIndex, pageSize: pagination.pageSize }))
	}, [pagination, action, dispatch])

	// check if column prop has updated
	useEffect(() => {
		console.log({ columns })
		_setColumns(columns)
	}, [columns])

	// check if, dataSource has updated
	useEffect(() => {
		console.log({ dataSource })
	}, [dataSource])

	return (
		<>
			<MaterialReactTable
				initialState={{
					showColumnFilters: false,
					density: 'compact',
					// pagination: { pageSize: 10, pageIndex: 1 },
				}}
				columns={_columns}
				data={filteredData}
				enableColumnOrdering={options.order}
				enableColumnResizing={options.resize}
				enableSorting={options.sort}
				enableColumnActions={options.setting}
				enableGlobalFilter={false}
				enablePinning
				enableRowSelection
				enableStickyHeader
				enableDensityToggle={false}
				enableHiding={false}
				manualFiltering
				manualPagination
				muiTableContainerProps={{
					sx: {
						maxHeight: '600px',
					},
				}}
				muiTablePaginationProps={{
					rowsPerPageOptions: ['10', '20', '50', '100', '200'],
					showFirstButton: false,
					showLastButton: false,
				}}
				rowCount={paginationData?.totalPage}
				onGlobalFilterChange={setGlobalFilter}
				onPaginationChange={setPagination}
				state={{ pagination, loading }}
				// state={{
				//     // columnFilters,
				//     globalFilter,
				//     loading,
				//     pagination,
				//     showAlertBanner: isError,
				//     showProgressBars: isRefetching,
				// }}
				muiTableHeadProps={{
					//simple styling with the `sx` prop, works just like a style prop in this example
					sx: {
						fontWeight: 'normal',
						fontSize: '10px',
						backgroundColor: 'green',
						// opacity: '40%',
						color: 'white',
					},
				}}
				getPaginationRowModel={({ table }) => {}}
				// muiToolbarAlertBannerProps={
				//     isError
				//         ? {
				//             color: 'error',
				//             children: 'Error loading data',
				//         }
				//         : undefined
				// }
				muiTableBodyRowProps={{
					//simple styling with the `sx` prop, works just like a style prop in this example
					sx: {
						fontWeight: 'normal',
						fontSize: '10px',
						borderRadius: '10%',
						// backgroundColor: '#fafafa',
						// opacity: '40%',
						color: 'white',
					},
				}}
				muiTableBodyCellProps={{
					sx: {
						// borderRadius: '5px',
					},
				}}
				// muiSearchTextFieldProps={{
				//     placeholder: 'Search Row APIs',
				//     sx: { maxWidth: '4rem', backgroundColor: 'green', },
				//     variant: 'outlined',
				// }}
				muiTablePaperProps={{
					sx: {
						pt: '1.5rem',
						pb: '0.5rem',
						boxShadow: 3,
						borderRadius: isFullScreen ? 0 : 2,
					},
				}}
				// muiTableHeadCellFilterTextFieldProps={ }
				muiTableHeadCellProps={{
					sx: { backgroundColor: '#f1f1f1' },
				}}
				renderTopToolbar={({ table }) => {
					const handleFullScreen = () => {
						table.setIsFullScreen(!isFullScreen)
						setIsFullScreen(!isFullScreen)
					}

					const handleFilter = () => {
						table.setShowColumnFilters(!isColumnsFilterShow)
						setIsColumnsFilterShow(!isColumnsFilterShow)
					}

					const handleDensity = () => {
						const arr = ['comfortable', 'spacious', 'compact']
						table.setDensity(arr[densityIndex])
						setDensityIndex((densityIndex + 1) % arr.length)
					}

					const handleOptions = (list) => {
						setSelectedOptionList(list)
						setOptions((prevState) => {
							const newOptions = { ...prevState }
							newOptions.resize = list.includes('Resize')
							newOptions.order = list.includes('Order')
							newOptions.setting = list.includes('Settings')
							newOptions.sort = list.includes('Sort')
							return newOptions
						})
					}

					const handleToggleColumn = (columnList) => {
						setVisibleColumns(columnList)
					}

					const handleExport = (data) => {
						console.log(data, '@@')
						const wb = utils.book_new()
						const ws = utils.json_to_sheet(data, { origin: 'A2', skipHeader: true })
						utils.sheet_add_aoa(ws, [
							filteredColumn.map((arr) => arr.header !== 'Actions' && [arr.header]),
						]) //heading: array of arrays
						utils.book_append_sheet(wb, ws, 'Data')
						writeFileXLSX(wb, `${'fileName'}.xlsx`)
					}

					return (
						<div className='flex flex-wrap justify-end items-center gap-4 mb-4 px-4'>
							<div className=''>
								<AutoComplete
								// className='md:w-96'
								>
									<Input.Search placeholder='Search' />
								</AutoComplete>
							</div>
							<div className='flex flex-wrap justify-end items-center gap-2'>
								<div onClick={handleFilter}>
									<Button className='flex justify-center items-center gap-2 pl-1'>
										{' '}
										<BsFilter /> Filter
									</Button>
								</div>
								<div>
									<CustomDropdown
										icon={<BsLayoutThreeColumns />}
										title={'Columns'}
										columnList={columnList}
										defaultValue={visibleColumns}
										handleChange={handleToggleColumn}
									/>
								</div>
								<div>
									<CustomDropdown
										icon={<RiSettings5Line />}
										title={'Options'}
										columnList={['Resize', 'Order', 'Settings', 'Sort']}
										defaultValue={selectedOptionList}
										handleChange={handleOptions}
									/>
								</div>
								<div onClick={() => handleExport(filteredData)}>
									<Button className='flex justify-center items-center gap-2 pl-1'>
										{' '}
										<BsDownload /> Export
									</Button>
								</div>
								<div
									onClick={() =>
										handleExport(table.getSelectedRowModel().rows.original)
									}
								>
									<Button
										disabled={
											!table.getIsSomeRowsSelected() &&
											!table.getIsAllRowsSelected()
										}
										className='flex justify-center items-center gap-2 pl-1'
									>
										{' '}
										<BsDownload /> Export Selected Rows
									</Button>
								</div>
								<div className='cursor-pointer' onClick={handleDensity}>
									<Tooltip placement='top' title={'Density'}>
										{densityIndex === 0 ? (
											<ImMenu className='text-[20px]' />
										) : densityIndex === 1 ? (
											<HiOutlineMenu className='text-[20px]' />
										) : (
											<HiOutlineMenuAlt4 className='text-[20px]' />
										)}
									</Tooltip>
								</div>
								<div className='cursor-pointer' onClick={handleFullScreen}>
									<Tooltip placement='top' title={'Full Screen'}>
										{isFullScreen ? (
											<RiFullscreenExitFill className='text-[20px]' />
										) : (
											<RiFullscreenFill className='text-[20px]' />
										)}
									</Tooltip>
								</div>
							</div>
							<div className='flex justify-end items-center'>
								<div className='w-[2px] h-6 mx-3 bg-slate-400'></div>
								<div>
									<Button className='flex justify-center items-center gap-2 pl-1'>
										{' '}
										<BsPlus className='text-xl -ml-1' /> ADD
									</Button>
								</div>
							</div>
						</div>
					)
				}}
			/>
		</>
	)
}

const CustomDropdown = ({ icon, title, columnList, defaultValue, handleChange }) => {
	const [visible, setVisible] = useState(false)
	const menu = (
		<Menu>
			<Checkbox.Group
				defaultValue={defaultValue}
				className='grid p-2'
				onChange={handleChange}
			>
				{columnList?.map((item, index) => (
					<div key={index}>
						<Checkbox value={item}>{item}</Checkbox>
					</div>
				))}
			</Checkbox.Group>
		</Menu>
	)
	return (
		<Dropdown
			open={visible}
			onOpenChange={(flag) => setVisible(flag)}
			overlay={menu}
			trigger={['click']}
		>
			<Button className='flex justify-center items-center gap-2 pl-1'>
				{' '}
				{icon} {title}
			</Button>
		</Dropdown>
	)
}

export default CustomTable
