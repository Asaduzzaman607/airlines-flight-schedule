import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// import components
import { Badge, Button, Empty, Form } from 'antd'
import { CustomSelectWithSearch, DragSortingTable } from '../../commonComponents'

// import action
import {
	getApprovalMenuList,
	submitApprovalConfig,
} from '../../../services/actions/RoleManagementActions/approvalConfigAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// IMPORT API CONFIG
import { ROLE } from '../../../config'

const ApprovalConfig = () => {
	const [dataSource, setDataSource] = useState([])
	const [initialDataSource, setInitialDataSource] = useState([])

	const { approvalMenuList, isLoading } = useSelector((state) => state.approvalConfig)

	const dispatch = useDispatch()
	const [form] = Form.useForm()

	// get input field value from Form
	const menuId = Form.useWatch('menuId', form)

	// Submit Handler
	const _onFinish = (values) => {
		const approvalPriorities = dataSource.map((item, index) => ({ key: item.key, priority: index + 1 }))
		dispatch(submitApprovalConfig({ menuId: values.menuId, approvalPriorities }))
	}

	// reset form data
	const _onReset = () => {
		form.resetFields()
	}

	// create columns
	const columns = [
		{
			title: '',
			dataIndex: 'id',
            render: (_, __, index) => <span className={'float-left'}>{ index + 1 + '.'}</span>
		},
		{
			title: '',
			dataIndex: 'name',
            render: (item) => <span className={'float-left'}>{ item }</span>
		},
	]

	useEffect(() => {
		dispatch(getApprovalMenuList())
	}, [])

	useEffect(() => {
		const _fetchData = async () => {
			try {
				const { data } = await axios.get(ROLE.GET_APPROVAL_MENU_PAIR, {
					params: { id: menuId },
				})
				const ValidatedDataList = data?.length ? data : []
				setDataSource(ValidatedDataList)
				setInitialDataSource(ValidatedDataList)
			} catch (error) {
				console.error(error)

				const errMsg = getErrorMsg(error)

				// show error msg
				showAlert('error', errMsg)
			}
		}

		if (menuId) {
			_fetchData()
		}
	}, [menuId])
	
	return (
		<div className={'bg-white py-3 rounded-md'}>
			<Form
				validateTrigger={'onChange'}
				form={form}
				onFinish={_onFinish}
				scrollToFirstError
				layout={'vertical'}
				autoComplete={'off'}
			>
				<div className={'grid sm:grid-cols-1 lg:grid-cols-2 gap-5 sm:p-5 sm:pb-0'}>
					<Badge.Ribbon color={'purple'} text={'Module Name'} placement='start'>
						<Form.Item
							name='menuId'
							label={null}
							style={{
								border: '2px solid #dcdedc',
								borderRadius: '5px',
								padding: '35px',
								paddingTop: '40px',
							}}
							rules={[
								{
									type: 'select',
									message: 'Module name is not valid',
								},
								{
									required: true,
									message: 'Module Name is Required.',
								},
							]}
						>
							<CustomSelectWithSearch
								itemList={approvalMenuList}
								label='menuDisplayName'
								dataIndex='id'
								mode='single'
								allowClear={false}
								placeholder='Select Module Name'
							/>
						</Form.Item>
					</Badge.Ribbon>
				</div>
				<div className={'grid sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:p-5 sm:pt-0'}>
					<Badge.Ribbon
						color={'volcano'}
						text={'Initial Approval Menu Sequence'}
						placement='start'
					>
						<div
							style={{
								minHeight: '300px',
                                maxHeight: '450px',
								overflowY: 'auto',
								border: '2px solid #dcdedc',
								borderRadius: '5px',
								padding: '5px',
								paddingTop: '40px',
							}}
						>
							{initialDataSource?.length > 0 ? (
								initialDataSource?.map((item) => (
									<div className={'p-3'} key={item}>
										{item.priority + '. '}<span className={'pl-10'}>{item.name}</span>
									</div>
								))
							) : (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										height: '100%',
									}}
								>
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
								</div>
							)}
						</div>
					</Badge.Ribbon>
					<Badge.Ribbon
						color={'magenta'}
						text={'Rearrange Approval Menu'}
						placement='start'
					>
						<div
							style={{
								minHeight: '300px',
                                maxHeight: '450px',
								overflowY: 'auto',
								border: '2px solid #dcdedc',
								borderRadius: '5px',
								padding: '35px',
								paddingTop: '40px',
							}}
						>
                            { dataSource?.length > 0 ? (
								<DragSortingTable
                                    dataSource={dataSource}
                                    columns={columns}
                                    setDataSource={setDataSource}
                                />
							) : (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										height: '100%',
									}}
								>
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
								</div>
							) }
						</div>
					</Badge.Ribbon>
				</div>

				<Form.Item style={{ marginLeft: '17px' }}>
					<Button
						htmlType={'submit'}
						type={'primary'}
						style={{ margin: '5px' }}
						loading={isLoading}
						disabled={dataSource?.length ? false : true}
					>
						{'Submit'}
					</Button>
					<Button htmlType={'reset'} onClick={() => _onReset}>
						{'Reset'}
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default ApprovalConfig
