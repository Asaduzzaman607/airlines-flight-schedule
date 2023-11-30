import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Select, Divider, Checkbox, DatePicker } from 'antd'
import axios from 'axios'

//import custom css for role assign
import '../../roleManagements/RoleAssign/custom_checkbox_design.css'

// import action
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { addCabinCrewAssign } from '../../../services/actions/CrewManagementActions/crewAssign'

// IMPORT API CONFIG
import { CREW_ASSIGN } from '../../../config'

// for checkrole 
const CheckboxGroup = Checkbox.Group

const  CabinCrewAssign = () => {
//   const { aircraftTypeList } = useSelector(state => state.aircrafttype)
  const {  isLoadingAddUser } = useSelector(state => state.crewassign)
  const dispatch = useDispatch()

  // define state checkedlist, checkall, indeterminate for role list
  const [flightNoList, setFlightNoList] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const [plainOptions, setPlainOptions] = useState([])
  const [allEmployeeId, setAllEmployeeId] = useState([])
  const [employeeDetails, setEmployeeDetails] = useState([])
  const [aircraftTypeList, setAircraftTypeList] = useState([])

  const [form] = Form.useForm()
  
  const onChange = (list) => {
    setCheckedList(list)
    setIndeterminate(!!list.length && list.length < plainOptions.length)
    setCheckAll(list.length === plainOptions.length)
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? allEmployeeId : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
    // console.log(e.target.checked,allEmployeeId, checkedList,' test check value')
  };

  // get input field value from Form
  const aircraftType = Form.useWatch('aircraftType', form)
  const flightDate = Form.useWatch('flightDate', form)
  const flightNo = Form.useWatch('flightNo', form)
  
  // Submit action
  const _onFinish = values => {
    let res = {
        employeeId: checkedList,
        dailyFlightPlanId: flightNo
    }
    // dispatch to add action
    dispatch(addCabinCrewAssign(res))
  }

  
  // reset form data
  const _onReset = () => {
    form.resetFields()
  }

  // get aircraft type 
  useEffect(() => {
	  dispatch(getAircraftTypeList())
    axios.get(CREW_ASSIGN.GET_AIRCRAFT_TYPE_CABIN_CREW).then(res => {
        setAircraftTypeList(res?.data)
    })
  },[])

  // get flight no
  useEffect(() => {
	if(aircraftType && flightDate) {
		// reset flight no list
		form.setFieldsValue({
			flightNo: null
		})
		let data = {
			flightDate: flightDate?.format('YYYY-MM-DD'),
			aircraftTypeIdForScheduler: aircraftType
		}
		axios.post(CREW_ASSIGN.GET_FLIGHT_FOR_CREW, data).then(res => {
			setFlightNoList(res?.data?.model)
		})
	}
  },[flightDate, aircraftType])

  // get employee list and set employee details, checkbox options, checklist
  useEffect(()=> {
    if(flightNo) {
        // setIndeterminate(true)
        axios.get(CREW_ASSIGN.GET_EMPLOYEE_FOR_CABIN_CREW + flightNo).then(res => {
            let employeeIdList = [], plainOption = [], employeeDetail = []
            res?.data?.map(item => {
                employeeIdList.push(item.empId)
                plainOption.push({ label: item.employeeName, value: item.empId })
                employeeDetail.push({
                    empId: item.empId,
                    employeeName: item.employeeName,
                    trainingStatuses: item.trainingStatuses
                })
            })

            // set state
            // setCheckedList(employeeIdList)
            setAllEmployeeId(employeeIdList)
            setPlainOptions(plainOption)
            setEmployeeDetails(employeeDetail)
        })

        // get default checklist
        axios.post(CREW_ASSIGN.GET_ASSIGN_CABIN_CREW,{ dailyFlightPlanId: flightNo }).then(response => {
            setCheckedList(response?.data?.model)
        })
    }
  },[flightNo])

// console.log(checkedList,'itme list', allEmployeeId,'from employee list for cabin crew',plainOptions,employeeDetails)
  return (
    <div >
      <div className='bg-white py-3 rounded-md'>
        <Form
          validateTrigger={'onChange'}
          form={form}
          onFinish={_onFinish}
          scrollToFirstError
          layout={'vertical'}
          autoComplete={ 'off' }
        >
          <div className='grid sm:grid-cols-1 lg:grid-cols-2 gap-5 sm:p-5 sm:pb-0'>
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
						message: 'Please select anyone!',
					},
				]}
            >
              <Select placeholder="Select aircraft type" allowClear >
                  { aircraftTypeList?.map((item,index) => <Select.Option value={item.id} key={index}>{ item.name }</Select.Option>)}
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
                      message: 'Please select a date!',
                    },
                ]}
            >
              <DatePicker style={{width: '100%'}}/>
            </Form.Item>
          </div>

		  { (aircraftType && flightDate) && <div className='grid sm:grid-cols-1 lg:grid-cols-2 gap-5 sm:p-5 sm:pt-0 '>
            <div className=''>
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
                            message: 'Please select flight no!',
                        },
                    ]}
                >
                  <Select placeholder="Please select flight no" allowClear >
                    { flightNoList?.map((item,index) => <Select.Option value={item.id} key={index}>{ item.flightNo }</Select.Option>)}
                  </Select>  
                </Form.Item>

                { flightNo && <div className='outer-border'>
                  <div className='mb-2 pt-1 font-bold text-center'> ----- Employee List -----</div>
                  <div className='ant-checkbox-group-item'>
                    <Checkbox className='checkbox-header' indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                      Select all
                    </Checkbox>
                    <Divider />
                    <CheckboxGroup className='checkbox-group' options={plainOptions} defaultValue={checkedList} value={checkedList} onChange={onChange} />
                  </div>
                </div> }
            </div>

            { ( flightNo && checkedList?.length >0) && <div className='p-3 rounded-md border border-slate-300'>
                <div className='font-bold'> Selected Employee Details :</div>
                { employeeDetails?.map((item,index) => {
                    if(checkedList.includes(item.empId)) {
                        return (<div className={`p-3 mt-2 rounded-md bg-green-100`} key={index}>
                            <div><span className='font-bold'> Employee Name :</span> { item.employeeName } </div>
                            {/* <div><span className='font-bold'> Training Status :</span> { item.trainingStatuses ?  String(item.trainingStatuses.status) : 'false'}</div> */}
                            
                            { item.trainingStatuses?.length > 0 ? <div className=''>
                                <div className='font-bold italic '>Recency Information list</div>
                                <table class="table-fixed w-full">
                                    <thead>
                                        <tr className=' text-left'>
                                            <th>Recency Name</th>
                                            <th>Expired In</th>
                                            <th>Recency Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { item.trainingStatuses?.map((value,index) => (
                                        <tr key={index} className={`${!value.status && 'bg-red-300'}`}>
                                            <td>{ value.trainingName }</td>
                                            <td>{ value.expiredIn }</td>
                                            <td>{ value.status ? 'Done' : 'Not yet done' }</td>
                                        </tr>
                                    )) }
                                    </tbody>
                                </table>
                                {/* <span className='font-semibold'> Training Name : { value.trainingName }</span>
                                <span className='font-semibold'> Expired In : { value.expiredIn }</span>
                                <span className='font-semibold'> Training Status : { String(value.status) }</span> */}
                            </div> : <div className='font-bold italic bg-yellow-100 rounded-sm'>Recency information not found.</div>}
                        </div>)
                    }
                })}
            </div>
            }
            
          </div>}
          
          <Form.Item style={{marginLeft: '17px'}}>
            <Button htmlType={'submit'} type={'primary'} disabled={checkedList?.length > 0 ? false : true} loading={isLoadingAddUser} style={{ margin: '5px' }}>{'Submit'}</Button>
            <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}


export default CabinCrewAssign
