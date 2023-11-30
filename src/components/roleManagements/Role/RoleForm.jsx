import { useEffect, useState, cloneElement } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import components
import { CustomInput, CustomTextArea } from '../../commonComponents'
import { Button, Form } from 'antd'

// import action
import { addRole, editRole } from '../../../services/actions/RoleManagementActions/roleAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import role config
import { ROLE } from '../../../config'


function RoleForm() {
    const [rowdata,setRowdata] = useState({})

    const { routePermissions } = useSelector(state => state.auth)
    const { isLoadingAddUser } = useSelector(state => state.role)
  
    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()


  const _onFinish = async (values) => {
    if(id) {
        values.id = Number(id)
        if(comapreWithLodash.isEqual(values, rowdata)) {
            // show success message
            showAlert('success', 'Successfully Updated.')

            return navigate(parent)
        } 

        // dispatch edit action
        const result = await dispatch(editRole(values))
        if(result?.success) {
            navigate(parent)
        }
    } else {
        // dispatch addRole action
        const result = await dispatch(addRole(values))

        // Check the result returned by the addRole action
        if (result?.success) {
            // If addRole succeeds, Form will be reset.
            form.resetFields()
        }
    } 
    
  };

  //reset form data
  const _onReset = () => {
    form.resetFields()
  };

  const inputField = ({type, label}) => {
    const _components = {
        text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
        textarea: <CustomTextArea type={'text'} placeholder={`Enter ${label}`} />,
    }
    
    return _components[type] || null
  }

  useEffect(()=> {
    const _fetchData = async () => {
        try {
            const response = await axios.get(ROLE.GET_ROLE + id)
            setRowdata(response.data)
            form.setFieldsValue(response.data)
        } catch (error) {
            console.error(error);

            const errMsg = getErrorMsg(error)

            // show error msg
            showAlert('error', errMsg)
        }
    }

    if(id) {
        _fetchData()
    }
  },[])


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
                roleFields?.map(field => (
                <Form.Item
                    key={field.id}
                    name={field.name}
                    label={field.label}
                    rules={field.rules}
                    dependencies={field.dependencies ?? []}
                >
                    {inputField(field)}
                </Form.Item>
                ))
            }
            </div>
            <Form.Item style={{marginLeft: '17px'}}>
            <Button 
                htmlType={'submit'} 
                type={'primary'} 
                loading={ isLoadingAddUser } 
                style={{ margin: '5px' }}
            >
                { id ? 'Update' : 'Submit' }
            </Button>
                {!id && <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>}
            </Form.Item>
        </Form>
    </div>
  )
}

// export add edit form
export default RoleForm

// define role type field
const roleFields = [
  {
    id: 1,
    name: 'name',
    label: 'Role Name',
    type: 'text',
    rules: [
      {
        type: 'text',
        message: 'The input is not valid',
      },
      {
        required: true,
        message: 'Please enter your role.',
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
        required: false,
        message: 'Please enter description.',
      },
    ],
  },
]