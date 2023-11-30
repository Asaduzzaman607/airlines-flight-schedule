import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// import { BackwardFilled, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import _ from "lodash"
import axios from 'axios'

// import flight config
import { FLIGHTLOCATION } from '../../../config'

// import action
import { addFlightLocation, editFlightLocationList } from '../../../services/actions/FlightManagementActions/flightLocationAction'


function AddEditForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const [rowdata,setRowdata] = useState({})
  const { routePermissions } = useSelector(state => state.auth)
  const { success, isLoadingAddUser } = useSelector(state => state.flightlocation)

  // destructure page path name and parent path name 
  const { parent } = routePermissions

  const _onFinish = (values) => {
    if(id) {
      values.id = Number(id)
      if(_.isEqual(values, rowdata)) return navigate(parent);
      // console.log('Received values of form: ', values)

      // dispatch edit action
      dispatch(editFlightLocationList(values))
      // navigate('/flight-management/flight/flight-location')
    } else {
      // dispatch add action
      dispatch(addFlightLocation(values))
    } 
  };
  
  //reset form data
  const _onReset = () => {
    form.resetFields()
  };

  const inputField = (type) => {
    switch (type) {
      case 'text':
        return <Input type={'text'} placeholder="Enter here!" />
      case 'textarea':
        return <Input.TextArea type={'text'} placeholder="Enter details here!" />
      case 'password':
        return <Input.Password type={'password'} placeholder="Enter password here!" />
      case 'number':
        return <InputNumber type={'number'} placeholder="Enter number here!" />
      case 'email':
        return <Input type={'email'} placeholder="Enter your email here!" />
      default:
        break;
    }
  }

    // distruct menuList from auth redux toolkit
    // const { menuList, selectedMenuItemKey } = useSelector(state => state.auth)
    useEffect(() => {
      if(id) {
        // For edit form , If api response has successfully done then re-direct to parent path 
          success && navigate(parent)
      }
    }, [success])

    useEffect(()=> {
      if(id) {
        // get single row data for edit
        axios.get(FLIGHTLOCATION.GET_FLIGHTLOCATION_LIST + id).then(response => {
          setRowdata(response.data)
          form.setFieldsValue(response.data)
        })
      }
      // form.setFieldsValue(id && flightLocationDetails)
    },[])

  return (
    <div>
      <div className='bg-white py-3 rounded-md'>
        <Form
          validateTrigger={'onChange'}
          form={form}
          onFinish={_onFinish}
          scrollToFirstError
          layout={'vertical'}
          autoComplete={ 'off' }
        >
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'>
            {
              addEditInfoFeilds?.map(feild => (
                <Form.Item
                  key={feild.id}
                  name={feild.name}
                  label={feild.label}
                  rules={feild.rules}
                  dependencies={feild.dependencies ?? []}
                >
                  {inputField(feild?.type)}
                </Form.Item>
              ))
            }
          </div>
          <Form.Item style={{marginLeft: '17px'}}>
            <Button htmlType={'submit'} type={'primary'} loading={ isLoadingAddUser } style={{ margin: '5px' }}>{'Submit'}</Button>
            {!id && <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}


export default AddEditForm

const addEditInfoFeilds = [
  {
    id: 1,
    name: 'name',
    label: 'Flight Location Name',
    type: 'text',
    rules: [
      {
        type: 'text',
        message: 'The input is not valid username',
      },
      {
        required: true,
        message: 'Please input flight Location name!',
      },
    ],
  },
  {
    id: 2,
    name: 'description',
    label: 'Description',
    type: 'textarea',
    rules: [
      {
        type: 'textarea',
        message: 'The input is not valid',
      },
      {
        required: true,
        message: 'Please input description!',
      },
    ],
  },
]