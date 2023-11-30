import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// import components
import SelectedCockpitCrewOptions from '../../commonComponents/SelectedCockpitCrewOptions'
import IndivisualSearchBlock from '../../commonComponents/IndivisualSearchBlock'
import { HoverHandler } from './HoverHandler'
import { TagRender } from '../../commonComponents'
import { Button, Form, Select, Checkbox, DatePicker, Tooltip, Empty } from 'antd'

// import image and icon
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { ReactComponent as Seat } from '../../../assets/icon/seat-icon.svg'
import checkedIcon from '../../../assets/icon/check.png'

// import action
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { addCockpitCrewAssign, validateCockpitCrewAssign } from '../../../services/actions/CrewManagementActions/crewAssign'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// IMPORT API CONFIG
import { CREW_ASSIGN } from '../../../config'
import CockpitCrewModal from './CockpitCrewModal'

const  CockpitCrewAssign = () => {
  const [flightNoList, setFlightNoList] = useState([])
  const [aircraftTypeList, setAircraftTypeList] = useState([])
  const [captainSeat, setCaptainSeat] = useState(null)
  const [officerSeat, setOfficerSeat] = useState(null)
  const [captainlist, setCaptainList] = useState([])
  const [officerlist, setOfficerList] = useState([])
  const [optionalEmployeelist, setOptionalEmployeelist] = useState([])
  const [assignedCaptainId, setAssignedCaptainId] = useState()
  const [assignedOfficerId, setAssignedOfficerId] = useState()
  const [assignedP3Id, setAssignedP3Id] = useState()
  const [officerChecked, setOfficerChecked] = useState(null)
  const [captainChecked, setCaptainChecked] = useState(null)
  const [captainStatusChecked, setCaptainStatusChecked] = useState(0)
  const [officerStatusChecked, setOfficerStatusChecked] = useState(1)
  const [addSeat, setAddSeat] = useState([])
  
  const {  isLoadingAddUser, isCrewAssignModalOpen } = useSelector(state => state.crewassign)
  

  const dispatch = useDispatch()
  const [form] = Form.useForm()
  
  // captain checkbox handler
  const captainCheckboxHandler = (e) => {
    if(captainChecked === e.target.value) setCaptainChecked(null)
    else setCaptainChecked(e.target.value)
    
  }
  
  // officer checkbox handler
  const officerCheckboxHandler = (e) => {
	if(officerChecked === e.target.value) setOfficerChecked(null)
    else setOfficerChecked(e.target.value)
  }

  // captain seat Handler
  const CaptainSeatHandler = () => {
	setCaptainSeat(1)
  }

  // officer seat handler
  const OfficerSeatHandler = () => {
	setOfficerSeat(1)
  }

  // optional seat handler
  const OptionalSeatHandler = (index) => {
	const values = [...addSeat]
	values[index].id = index + 1
	setAddSeat(values)
  }

  // optional status check handler
  const OptionalStatusCheckHandler = (id, index) => {
	const values = [...addSeat]
	values[index].statusId = id
	setAddSeat(values)
  }

  // optional checkbox handler
  const OptionalCheckboxHandler = (e, index) => {
	const values = [...addSeat]
	if(values[index].value === e.target.value) {
		values[index].value = '';
		setAddSeat(values)
	} 
	else {
		values[index].value = e.target.value
		setAddSeat(values)
	}
	
  }

  // Disable checkbox handler
  const disableCheckedHandler = (employeeId) => {
	const found = addSeat?.find(item => item.value === employeeId);
	return found;
  }

  // Disable checkbox handler for optional seat
  const optionalDesableCheckHandler = (employeeId, index) => {
	  if(addSeat?.length === 1) return false;
	  else if(index === 0){
		return addSeat[1].value === employeeId
		// const finalItems = addSeat.filter(item => item )
	  } else if(index === 1) {
		return addSeat[0].value === employeeId
	  }
  }

  // get input field value from Form
  const aircraftType = Form.useWatch('aircraftType', form)
  const flightDate = Form.useWatch('flightDate', form)
  const flightNo = Form.useWatch('flightNo', form)
  
  // Save or Submit Handler
  const _onFinish = values => {
	if(!officerChecked || officerChecked === 'required') return setOfficerChecked('required')
	if(!captainChecked || captainChecked === 'required') return setCaptainChecked('required')

    let finalValue = []
    flightNo?.map(value => {
        finalValue.push(
            {
                assignedCockpitCrewId: assignedCaptainId,
                dailyFlightPlanId: value,
                employeeId: captainChecked,
                cockpitCrewFlightCommandType: 'PIC',
                cockpitCrewFlightRoleType: captainStatusChecked
            },
            {
                assignedCockpitCrewId: assignedOfficerId,
                dailyFlightPlanId: value,
                employeeId: officerChecked,
                cockpitCrewFlightCommandType: 'SIC',
                cockpitCrewFlightRoleType: officerStatusChecked
            }
        )
        addSeat?.map(item => {
            item.value && finalValue.push({
                assignedCockpitCrewId: assignedP3Id,
                dailyFlightPlanId: value,
                employeeId: item.value,
                cockpitCrewFlightCommandType: null,
                cockpitCrewFlightRoleType: item.statusId
            })
        })
    })

    // dispatch to add action
    if(isCrewAssignModalOpen) {
        dispatch(addCockpitCrewAssign(finalValue))
    } else {
        dispatch(validateCockpitCrewAssign(finalValue))
    }

  }
  
  // reset form data
  const _onReset = () => {
    form.resetFields()
  }

  // More seat handler
  const MoreSeatHandler = () => {
	let items = [...addSeat]
	items.push({
		id: '',
		statusId: 2,
		value: ''
	})
	// addSeat?.length > 0 ? addSeat[addSeat.length - 1] + 1 : 0 
	setAddSeat(items)
  }

  // Remove seat handler
  const RemoveSeatHandler = (index) => {
	addSeat.splice(index, 1)
	setAddSeat([...addSeat])
  }

  // get aircraft type 
  useEffect(() => {
	let pageWithSize = { page: 0, pageSize: 200 }
	dispatch(getAircraftTypeList(pageWithSize))
    const _fetchAircraftTypeData = async () => {
        try {
            const { data } = await axios.get(CREW_ASSIGN.GET_AIRCRAFT_TYPE_CABIN_CREW)
            setAircraftTypeList(data)
        } catch (err) {
            console.error(err)
            const errMsg = getErrorMsg(err) 
                
            // show error msg
            showAlert('error', errMsg)
        }
    }
    _fetchAircraftTypeData()
  },[])

  // get flight no
  useEffect(() => {
	setAddSeat([])
    form.setFieldsValue({
        flightNo: null
    })
	if(aircraftType && flightDate) {
		// reset flight no list
		form.setFieldsValue({
			flightNo: undefined
		})
		
        const _fetchFlgithNoData = async () => {
            try {
                const params = {
                    flightDate: flightDate?.format('YYYY-MM-DD'),
                    aircraftTypeIdForScheduler: aircraftType
                }
                const { data } = await axios.post(CREW_ASSIGN.GET_FLIGHT_FOR_CREW, params, {params: {page: 0, size: 500}})
                let newFlightNoList = []
                data?.model?.map(item => newFlightNoList.push({label: item.flightNo + ` ( ${item?.leg} ${item?.standardDepartureTime})`, value: item.id}))
                setFlightNoList(newFlightNoList)
            } catch (err) {
                const errMsg = getErrorMsg(err)
                console.error(err)
                // show error msg
                showAlert('warning', errMsg)
            }
        }
		_fetchFlgithNoData();
	}
	setOfficerChecked(null)
	setCaptainChecked(null)
  },[flightDate, aircraftType])

  // get captain and first officer list and set details, checkbox options, checklist
  useEffect(()=> {
	setCaptainSeat(null)
	setOfficerSeat(null)
	setOfficerStatusChecked(1)
	setCaptainStatusChecked(0)
	setAddSeat([])
    if(flightNo?.length) {
        const _fetchCaptainAndFirstOffierList = async () => {
            try {
                const { data } = await axios.post(CREW_ASSIGN.GET_COCKPIT_CREW_ASSIGN_LIST, {dailyFlightPlanIds: flightNo})
                
                // get captain list
                const captainLists = data?.sortedCockpitCrewResponseDtoList?.filter(item => item.cockpitCrewType === 'CAPTAIN')
                setCaptainList(captainLists)

                // default assign captain check
                setCaptainChecked(data?.assignedEmployees?.P1?.employeeId)
                setAssignedCaptainId(data?.assignedEmployees?.P1?.id)
                setCaptainSeat(data?.assignedEmployees?.P1?.id ? 1 : null)
                setCaptainStatusChecked(data?.assignedEmployees?.P1?.cockpitCrewFlightRoleType ?? 0)

                // default assign officer check
                setOfficerChecked(data?.assignedEmployees?.P2?.employeeId)
                setAssignedOfficerId(data?.assignedEmployees?.P2?.id)
                setOfficerSeat(data?.assignedEmployees?.P2?.id ? 1 : null)
                setOfficerStatusChecked(data?.assignedEmployees?.P2?.cockpitCrewFlightRoleType ?? 1)

                // add extra seat item
                const extraSeatItem = data?.assignedEmployees?.P3 ? [{
                    id: 1,
                    statusId: data?.assignedEmployees?.P3?.cockpitCrewFlightRoleType,
                    value: data?.assignedEmployees?.P3?.employeeId
                }] : []
                setAssignedP3Id(data?.assignedEmployees?.P3?.id)
                setAddSeat(extraSeatItem)
                
                // get officer and optional person list
                setOfficerList(data?.sortedCockpitCrewResponseDtoList ?? [])
                setOptionalEmployeelist(data?.sortedCockpitCrewResponseDtoList ?? [])
            } catch (err) {
                console.error(err)
                const errMsg = getErrorMsg(err) 
                
                // set default list
                setCaptainList([])
                setOfficerList([])
                setOptionalEmployeelist([])

                setCaptainSeat(null)
	            setOfficerSeat(null)
                setAddSeat([])

                setOfficerChecked(null)
		        setCaptainChecked(null)

                // show error msg
                showAlert('error', errMsg)
            }
        }
        _fetchCaptainAndFirstOffierList();
    } else {
		setOfficerChecked(null)
		setCaptainChecked(null)
	}
  },[flightNo])
  
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
                <Form.Item
                    name='aircraftType'
                    label='Aircraft Type'
                    rules={[
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Aircraft Type is Required.',
                        },
                    ]}
                >
                    <Select placeholder="Select Aircraft Type" allowClear >
                        { aircraftTypeList?.map((item,index) => <Select.Option value={item.id} key={index}>{ item.name }</Select.Option>) }
                    </Select> 
                </Form.Item>

                <Form.Item
                    name='flightDate'
                    label='Flight Date'
                    rules={[
                        {
                            type: 'date',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Flight Date is Required.',
                        },
                    ]}
                >
                    <DatePicker style={{width: '100%'}}/>
                </Form.Item>
            </div>

            { (aircraftType && flightDate) && (
                <div className={'grid sm:grid-cols-1 lg:grid-cols-2 gap-5 sm:p-5 sm:pt-0'}>
                    <Form.Item
                        name='flightNo'
                        label='Flight No'
                        rules={[
                            {
                                type: 'select',
                                message: 'The input is not valid',
                            },
                            {
                                required: true,
                                message: 'Flight No is Required.',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            mode="multiple"
                            tagRender={TagRender}
                            showArrow
                            style={{
                                width: '100%',
                            }}
                            placeholder="Select Flight No"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={flightNoList}
                        />
                    </Form.Item>
                </div>
            )}
            { (flightNo && aircraftType && flightDate ) && (
            <>
                <div className={'grid sm:grid-cols-1 lg:grid-cols-1 gap-5 sm:p-5 sm:pt-0'}>
                    <div className={'border rounded-xl p-4 h-52'}>
                        <div className={'italic font-semibold'}>
                            <span className={'text-red-500 font-bold'}>* </span>
                            Please select at least 2 seat with P1 & P2 
                        </div>
                        <div className={'flex pt-3'}>
                            <div className={'italic relative text-center'} >
                                <Seat 
                                    onClick={CaptainSeatHandler} 
                                    fill={`${captainChecked === 'required' ? 'red' : captainSeat ? 'green' : 'gray'}`} 
                                    stroke={`${captainChecked === 'required' ? 'red' : captainSeat ? 'green' : 'gray'}`} 
                                    className={'h-24 w-24 mr-1 cursor-pointer'}
                                />
                                { (captainSeat && (!captainChecked || captainChecked === 'required')  ) && 
                                    <span className={`animate-ping absolute inline-flex h-6 w-6 rounded-full ${captainChecked === 'required' ? 'bg-red-400' : 'bg-green-400'} opacity-85 top-8 right-[38px]`}></span> 
                                }
                                { (captainSeat && captainChecked && captainChecked !== 'required' ) && 
                                    <span className={"absolute text-2xl font-bold text-green-800 inline-flex h-7 w-7 top-7 right-[38px]"}>
                                        <img src={checkedIcon} alt="crew checked icon" className='font-bold'/>
                                    </span>
                                }
                                <span className='block text-lg'> P1 </span> 
                            </div>

                            <div className={'italic relative px-4 pl-8 text-center'} >
                                <Seat 
                                    onClick={OfficerSeatHandler} 
                                    fill={`${officerChecked === 'required' ? 'red' : officerSeat ? 'green' : 'gray'}`} 
                                    stroke={`${officerChecked === 'required' ? 'red' : officerSeat ? 'green' : 'gray'}`} 
                                    className={'h-24 w-24 cursor-pointer'}
                                />
                                { (officerSeat && (!officerChecked || officerChecked === 'required')) && 
                                    <span className={`animate-ping absolute inline-flex h-6 w-6 rounded-full ${officerChecked === 'required' ? 'bg-red-400' : 'bg-green-400'} opacity-85 top-8 right-[50px]`}></span> 
                                }
                                { (officerSeat && officerChecked && officerChecked !== 'required' ) && 
                                    <span className={"absolute text-2xl font-bold text-green-800 inline-flex h-7 w-7 top-7 right-[50px]"}>
                                        <img src={checkedIcon} alt="crew checked icon" className=' font-bold'/>
                                    </span>
                                }
                                <div className={'text-lg'}> P2 </div> 
                            </div>

                            {
                                addSeat?.map((item, index) => (
                                    <div className={'italic relative pl-8 text-center'} key={index}>
                                        <Seat 
                                            onClick={() => OptionalSeatHandler(index)} 
                                            fill={`${item.id ? 'green' : 'gray'}`} 
                                            stroke={`${item.id ? 'green' : 'gray'}`} 
                                            className={'h-24 w-24 mr-1 cursor-pointer'}
                                        />
                                        {(item.id && !item.value) ? (
                                            <span className={`animate-ping absolute inline-flex h-6 w-6 rounded-full bg-green-400 opacity-85 top-8 right-[38px]`}></span>
                                        ) : ''}
                                        {(item.id && item.value ) ?
                                            <span className={"absolute text-2xl font-bold text-green-800 inline-flex h-7 w-7 top-7 right-[38px]"}>
                                                <img src={checkedIcon} alt="crew checked icon" className=' font-bold'/>
                                            </span> : ''
                                        }
                                        
                                        <div className={'text-lg'}> P3 </div>
                                        <div className={'text-center pr-2'}>
                                            <MinusCircleOutlined onClick={() => RemoveSeatHandler(index)} style={{fontSize: '20px', cursor: 'pointer', color: 'red'}}/>
                                        </div> 
                                    </div>
                                ))
                            }
                            {
                                (
                                        addSeat?.length < 1 && 
                                        <div className='flex items-center pb-6 pl-8'>
                                            <PlusCircleOutlined onClick={MoreSeatHandler} style={{fontSize: '50px', cursor: 'pointer', color: 'gray'}}/>
                                        </div> 
                                    
                                )
                            }

                        </div>
                    </div>
                </div>
                <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5 sm:pt-0 '}>
                    { captainSeat && 
                        <div className={'border rounded-xl p-4'}>
                            <div className={'italic font-bold bg-zinc-100 p-1 rounded-xl'}>
                                <span className={'text-red-500 font-bold'}>* </span>Select captain for P1(PIC) seat
                                <div className={'p-2'}>
                                    <IndivisualSearchBlock dataList={captainlist} setDataList={setCaptainList}/>
                                </div>
                            </div>
                            { captainSeat && (
                                <div className={'flex h-[450px] overflow-y-auto'}>
                                    <div style={{ width: '60%'}}>
                                        { captainlist?.length ?
                                            captainlist?.map((item,index) => (
                                                item.employeeId && <p key={index} className={"mt-4"}>
                                                    <Checkbox 
                                                        onChange={captainCheckboxHandler} 
                                                        value={item.employeeId} 
                                                        checked={captainChecked === item.employeeId} 
                                                        disabled={(officerChecked === item.employeeId || disableCheckedHandler(item.employeeId)) ? true : false}
                                                    >
                                                        <Tooltip placement="right" color='#87d068' title={() => HoverHandler(item)}>
                                                            {item.employeeName + ` (${item.employeeId})`}
                                                        </Tooltip>
                                                    </Checkbox>
                                                </p>
                                            ))
                                            : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                            </div> 
                                        }
                                    </div>
                                    
                                    <SelectedCockpitCrewOptions setSelectedOptionId={setCaptainStatusChecked} selectedOptionId={captainStatusChecked} from="p1"/>
                                </div>
                            )}
                        </div>
                    }
                    { officerSeat && 
                        <div className={'border rounded-xl p-4'}>
                            <div className={'italic font-bold bg-zinc-100 p-1 rounded-xl'}>
                                <span className={'text-red-500 font-bold'}>* </span>Select first officer for P2(SIC) seat
                                <div className={'p-2'}>
                                    <IndivisualSearchBlock  dataList={officerlist} setDataList={setOfficerList}/>
                                </div>
                            </div>
                            { officerSeat && (
                                <div className={'flex justify-between h-[450px] overflow-y-auto'}>
                                    <div style={{ width: '60%' }}>
                                        { officerlist?.length ? 
                                        <>
                                            <p className={'mt-4 font-semibold'}>Available First officer list</p>
                                            {
                                                officerlist?.map((item,index) => (
                                                    item?.cockpitCrewType === 'FIRST_OFFICER' && <p key={index}>
                                                        <Checkbox 
                                                            onChange={officerCheckboxHandler} 
                                                            value={item.employeeId} 
                                                            checked={officerChecked === item.employeeId} 
                                                            disabled={(captainChecked === item.employeeId || disableCheckedHandler(item.employeeId)) ? true : false}
                                                        >
                                                            <Tooltip placement="right" color='#87d068' title={() => HoverHandler(item)}>
                                                                {item.employeeName + ` (${item.employeeId})`}
                                                            </Tooltip>
                                                        </Checkbox>
                                                    </p>
                                                ))
                                            }
                                            <p className={'mt-4 font-semibold'}>Available Captain list</p>
                                            {
                                                officerlist?.map((item,index) => (
                                                    item?.cockpitCrewType === 'CAPTAIN' && <p key={index}>
                                                        <Checkbox 
                                                            onChange={officerCheckboxHandler} 
                                                            value={item.employeeId} 
                                                            checked={officerChecked === item.employeeId} 
                                                            disabled={(captainChecked === item.employeeId || disableCheckedHandler(item.employeeId)) ? true : false}
                                                        >
                                                            <Tooltip placement="right" color='#87d068' title={() => HoverHandler(item)}>
                                                                {item.employeeName + ` (${item.employeeId})`}
                                                            </Tooltip>
                                                        </Checkbox>
                                                    </p>
                                                ))
                                            } 
                                        </> : 
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                            </div> 
                                        }
                                    </div>

                                    <SelectedCockpitCrewOptions setSelectedOptionId={setOfficerStatusChecked} selectedOptionId={officerStatusChecked} from="p2"/>
                                </div>
                            )}
                        </div>
                    }
                    { addSeat?.map((itemList, index) => (
                            (itemList.id) ? <div className={'border rounded-xl p-4'} key={index}>
                            <div className={'italic font-bold bg-zinc-100 p-1 rounded-xl'}>
                                <span className={'text-red-500 font-bold'}>* </span>Select Flight Crews for P3 seat
                                <div className={'p-2'}>
                                    <IndivisualSearchBlock dataList={optionalEmployeelist} setDataList={setOptionalEmployeelist}/>
                                </div>
                            </div>
                            <div className={'flex justify-between h-[450px] overflow-y-auto'}>
                                <div style={{ width: '60%' }}>
                                    { optionalEmployeelist?.length ?
                                    <>
                                        <p className={'mt-4 font-semibold'}>Available First officer list</p>
                                        {
                                            optionalEmployeelist?.map((item, index1) => (
                                                item?.cockpitCrewType === 'FIRST_OFFICER' && <p key={index1}>
                                                    <Checkbox 
                                                        onChange={(e) => OptionalCheckboxHandler(e, index)} 
                                                        value={item.employeeId} 
                                                        checked={itemList.value === item.employeeId} 
                                                        disabled={((captainChecked === item.employeeId)|| (officerChecked === item.employeeId) || (optionalDesableCheckHandler(item.employeeId, index))) ? true : false}
                                                    >
                                                        <Tooltip placement="right" color='#87d068' title={() => HoverHandler(item)}>
                                                            {item.employeeName + ` (${item.employeeId})`}
                                                        </Tooltip>
                                                    </Checkbox>
                                                </p>
                                            ))
                                        }
                                        <p className={'mt-4 font-semibold'}>Available Captain list</p>
                                        {
                                            optionalEmployeelist?.map((item, index2) => (
                                                item?.cockpitCrewType === 'CAPTAIN' && <p key={index2}>
                                                    <Checkbox 
                                                        onChange={(e) => OptionalCheckboxHandler(e, index)} 
                                                        value={item.employeeId} 
                                                        checked={itemList.value === item.employeeId} 
                                                        disabled={((captainChecked === item.employeeId)|| (officerChecked === item.employeeId) || (optionalDesableCheckHandler(item.employeeId, index))) ? true : false}
                                                    >
                                                        <Tooltip placement="right" color='#87d068' title={() => HoverHandler(item)}>
                                                            {item.employeeName + ` (${item.employeeId})`}
                                                        </Tooltip>
                                                    </Checkbox>
                                                </p>
                                            ))
                                        }
                                    </> : 
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                        </div> 
                                    }
                                </div>

                                <SelectedCockpitCrewOptions setSelectedOptionId={setAddSeat} selectedOptionId={itemList.statusId} addSeat={addSeat} from="p3"/>
                            </div>
                        </div> : ''
                    ))}
                </div>
            </>
            )}

            <Form.Item style={{marginLeft: '17px'}}>
                <Button 
                    htmlType={'submit'} 
                    type={'primary'} 
                    loading={isLoadingAddUser} 
                    style={{ margin: '5px' }} 
                    disabled={ (captainSeat && officerSeat) ? false : true }
                >
                    {'Submit'}
                </Button>
                <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>
            </Form.Item>
        </Form>

        {
            isCrewAssignModalOpen && <CockpitCrewModal onFinish={_onFinish}/>
        }
    </div>
  )
}


export default CockpitCrewAssign
