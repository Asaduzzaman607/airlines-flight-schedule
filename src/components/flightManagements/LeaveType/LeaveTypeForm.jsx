import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form } from 'antd'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

// import components
import { CustomInput, CustomSelectBox } from '../../commonComponents'

// import action
import { addLeaveType, editLeaveType, getLeavePeriodList } from '../../../services/actions/FlightManagementActions/leaveTypeAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import role config
import { LEAVE_TYPE } from '../../../config'

function LeaveTypeForm() {
  const { success, isLoadingAddUser, periodList } = useSelector(state => state.leaveType)
  const { routePermissions } = useSelector(state => state.auth)

  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  // destructure parent path name 
  const { parent } = routePermissions

  const _onFinish = values => {
    // dispatch to add and edit action
    if (id) {
      values.id = Number(id)
      dispatch(editLeaveType(values))
    } else {
      dispatch(addLeaveType(values))
    }
  }

  //reset form data
  const _onReset = () => {
    form.resetFields()
  }

  // Handle input field
  const inputField = ({ type, label }) => {
    const _components = {
      text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
      number: <CustomInput type={'number'} placeholder={`Enter ${label}`} />,
      select: <CustomSelectBox
        itemList={periodList}
        label={'name'}
        dataIndex={'id'}
        placeholder={`Select ${label}`}
      />
    }
    return _components[type] || null;
  }

  const addEditInfoFeilds = [
    {
      id: 1,
      name: 'name',
      label: 'Name',
      type: 'text',
      rules: [
        {
          type: 'text',
          message: 'Name is not valid',
        },
        {
          required: true,
          message: 'Name is required.',
        }
      ]
    },
    {
      id: 2,
      name: 'allocationDays',
      label: 'Allocation Days',
      type: 'number',
      rules: [
        {
          type: 'text',
          message: 'Allocation Days is not valid',
        },
        {
          required: true,
          message: 'Allocation Days is required.',
        }
      ]
    },
    {
      id: 3,
      name: 'leavePeriod',
      label: 'Leave Period',
      type: 'select',
      rules: [
        {
          type: 'select',
          message: 'Leave Period is not valid',
        },
        {
          required: true,
          message: 'Leave Period is required.',
        }
      ]
    }
  ]

  useEffect(() => {
    if (id) {
      // For edit form , If api response has successfully done then re-direct to parent path 
      success && navigate(parent)
    }
  }, [success])

  useEffect(() => {
    dispatch(getLeavePeriodList())

    const _fetchData = async () => {
      try {
        const { data } = await axios.get(LEAVE_TYPE.GET_LEAVE_TYPE + id)

        form.setFieldsValue(data);
      } catch (error) {
        console.error(error);
        const errMsg = getErrorMsg(error)

        // show error msg
        showAlert('error', errMsg)
      }
    }

    if (id) {
      _fetchData()
    }
  }, [id])

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
        <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
          {
            addEditInfoFeilds?.map(field => {
              return (
                <Form.Item
                  key={field.id}
                  name={field.name}
                  label={field.label}
                  rules={field.rules}
                  dependencies={field.dependencies ?? []}
                >
                  {inputField(field)}
                </Form.Item>
              )
            })
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
          {
            !id &&
            <Button
              htmlType={'reset'}
              onClick={() => _onReset}
            >
              {'Reset'}
            </Button>
          }
        </Form.Item>
      </Form>
    </div>
  )
}

export default LeaveTypeForm

