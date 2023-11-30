import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form } from 'antd'
import { useDispatch } from 'react-redux'

// import component
import { CustomInput,CustomSelectBox } from '../../commonComponents'

import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import actions
import { addVehicle, editVehicle, getType} from '../../../services/actions/VehicleManagementActions/vehicleAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions';

// import vehicle config
import { VCC } from '../../../config'

function VehicleForm() {
  const [rowdata, setRowdata] = useState({})
  const [typeData, setTypeData] = useState(false)

  const { success, isLoadingAddUser } = useSelector(state => state.vehicle)
  const { routePermissions } = useSelector(state => state.auth)
  const { typeList } = useSelector(state => state.vehicle)

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
      if (comapreWithLodash.isEqual(values, rowdata)) return navigate(parent)

      dispatch(editVehicle(values))
    } else {
      dispatch(addVehicle(values))
   
    }
  }

  //reset form data
  const _onReset = () => {
    form.resetFields()
  }

  const inputField = ({ type, label }) => {
    const _components = {
      text: <CustomInput
        type={'text'}
        placeholder={`Enter ${label}`} />,
      number: <CustomInput
        type={'number'}
        placeholder={`Enter ${label}`} />,
      customSelect:
        <CustomSelectBox
            itemList={typeList}
            label={'name'} 
            dataIndex={'id'} 
            mode={'single'}
            tagRender={null}
            placeholder={`Select ${label}`}
      />

    }
    return _components[type] || null;
  }

  const addEditInfoFields = [
    {
      id: 1,
      name: 'name',
      label: 'Vehicle Name',
      type: 'text',
      rules: [
        {
          type: 'text',
          message: 'Vehicle Name is not valid',
        },
        {
          required: true,
          message: 'Vehicle Name is required.',
        },
      ],
    },
    {
      id: 2,
      name: 'type',
      label: 'Vehicle Type',
      type: 'customSelect',
      rules: [
        {
          type: 'select',
          message: 'Vehicle Type is not valid',
        },
        {
          required: true,
          message: 'Vehicle Type is required.',
        },
      ],
    },
    {
      id: 3,
      name: 'model',
      label: 'Model',
      type: 'text',
      rules: [
        {
          type: 'text',
          message: 'Model is not valid',
        },
        {
          required: true,
          message: 'Model is required.',
        },
      ],
    },
    {
      id: 4,
      name: 'licensePlate',
      label: 'License Plate',
      type: 'text',
      rules: [
        {
          type: 'text',
          message: 'License Plate is not valid',
        },
        {
          required: true,
          message: 'License Plate is required.',
        },
      ],
    },
    {
      id: 5,
      name: 'color',
      label: 'Color',
      type: 'text',
      rules: [
        {
          type: 'text',
          message: 'Color is not valid',
        },
        {
          required: true,
          message: 'Color is required.',
        },
      ],
    },
    {
      id: 6,
      name: 'vendor',
      label: 'Vendor',
      type: 'text',
      rules: [
        {
          type: 'text',
          message: 'Vendor is not valid',
        }
      ],
    },
    {
      id: 7,
      name: 'capacity',
      label: 'Seat Capacity',
      type: 'number',
      rules: [
        {
          required: true,
          message: 'Seat Capacity is required.',
        },
      ],
    },
  ]

  useEffect(() => {
    setTypeData(true)
    if (typeData) {
        dispatch(getType())
    }
   
    if (id) {
      // For edit form , If api response has successfully done then re-direct to parent path 
      success && navigate(parent)
    }
  }, [success,typeData])

  useEffect(() => {

    const _fetchData = async () => {
        try {
            const { data } = await axios.get(VCC.GET_VEHICLE_LIST + id)

            setRowdata(data)
            form.setFieldsValue(data)
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
            addEditInfoFields?.map(feild => (
              <Form.Item
                key={feild.id}
                name={feild.name}
                label={feild.label}
                rules={feild.rules}
                dependencies={feild.dependencies ?? []}
              >
                {inputField(feild)}
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
  )
}

export default VehicleForm

