import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Input, InputNumber, DatePicker, Select } from 'antd'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import _ from "lodash"

// import action
import { addRoute, editRoute } from '../../../services/actions/VehicleManagementActions/routeAction'

// import role config
import { VCC } from '../../../config'

// import Form component
import { showAlert } from '../../../services/actions/commonActions';

function AddEditForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { success, isLoadingAddUser } = useSelector(state => state.route)
  const { routePermissions } = useSelector(state => state.auth)
  const [rowdata, setRowdata] = useState({})

  // destructure parent path name 
  const { parent } = routePermissions

  const _onFinish = values => {
    // dispatch to add and edit action
    if (id) {
      values.id = Number(id)
      if (_.isEqual(values, rowdata)) return navigate(parent)
 

      dispatch(editRoute(values))
    } else {
        
      //check estimatedTime negetive or not
      if(values.estimatedTime <= 0) {
        return showAlert('warning','Estimated Time should be greater than Zero.')
      }

      dispatch(addRoute(values))
    }
  }

  //reset form data
  const _onReset = () => {
    form.resetFields()
  }

  const inputField = (type) => {
    const _components = {
      text: <Input type={'text'} placeholder={"Enter route here"} />,
      textarea: <Input.TextArea type={'text'} placeholder={"Enter details here"} />,
      password: <Input.Password type={'password'} placeholder={"Enter password here"} />,
      number: <InputNumber type={'number'} min={0} placeholder={"Enter estimated time"} style={{ width: '100%' }} />,
      email: <Input type={'email'} placeholder={"Enter your email here"} />,
      date: <DatePicker showTime />,
      select: (
        <Select placeholder="Please select any one">
          <Select.Option value={true} >{"True"}</Select.Option>
          <Select.Option value={false} >{"False"}</Select.Option>
        </Select>
      ),
    }

    return _components[type] || null;

  }

  useEffect(() => {
    if (id) {
      // For edit form , If api response has successfully done then re-direct to parent path 
      success && navigate(parent)
    }
  }, [success])

  useEffect(() => {
    if (id) {
      // get single row data for edit
      axios.get(VCC.GET_ROUTE_LIST + id).then(response => {
        setRowdata(response.data)
        form.setFieldsValue(response.data)
      })
    }
  }, [])

  return (
    <div>
      <div className='bg-white py-3 rounded-md'>
        <Form
          validateTrigger={'onChange'}
          form={form}
          onFinish={_onFinish}
          scrollToFirstError
          layout={'vertical'}
          autoComplete={'off'}
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
          <Form.Item style={{ marginLeft: '17px' }}>
            <Button
              htmlType={'submit'}
              type={'primary'}
              loading={isLoadingAddUser}
              style={{ margin: '5px' }}
            >
              {id ? 'Update' : 'Submit'}
            </Button>
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
    label: 'Route Name',
    type: 'text',
    rules: [
      {
        type: 'text',
        message: 'The input is not valid name',
      },
      {
        required: true,
        message: 'Please enter route name',
      },
    ],
  },
  {
    id: 2,
    name: 'estimatedTime',
    label: 'Estimated Time (Minute)',
    type: 'number',
    rules: [
      {
        type: 'number',
        message: 'The input is not valid',
      },
      {
        required: true,
        message: 'Please enter estimated time',
      },
    ],
  },
]