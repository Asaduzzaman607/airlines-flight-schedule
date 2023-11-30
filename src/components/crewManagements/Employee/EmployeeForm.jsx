import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import comapreWithLodash from "lodash"
import dayjs from 'dayjs'

// import components
import { useAwsFileUploader } from '../../customHooks'
import { CustomSelectBox, CustomSelectWithSearch, TagRender } from '../../commonComponents'
import { Button, Form, Input, InputNumber, Select, DatePicker, Badge, Upload, Modal, Image } from 'antd'

// import image
import defaultImage from '../../../assets/images/default_pilot.jpg'

// import icons
import { PlusOutlined } from '@ant-design/icons';

// import action
import { 
    addEmployee, 
    editEmployee, 
    getAreaList,
    getContactTypeList,
    getEmployeeTypeList 
} from '../../../services/actions/CrewManagementActions/employeeAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { getAirportList } from '../../../services/actions/FlightManagementActions/airportAction'
import { getUserTypeList } from '../../../services/actions/UserManagementActions/userTypeAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'
import { getCountryList } from '../../../services/actions/CrewManagementActions/countryAction'

// import API config
import { EMPLOYEE, PAGE_SIZE } from '../../../config'
import { CustomDateRangePicker } from '../../commonComponents/CustomFormField'

function AddEditForm() {
    // use aws custom hook
    const { 
        selectedFile, 
        objectUrl,
        progress, 
        handleChange, 
        beforeUpload, 
        handleCancel,
        handlePreview,
        previewOpen,
        previewImage,
        previewTitle, 
        setProgress,
        setSelectedFile,
        onRemoveFileUploadHandler
    } = useAwsFileUploader()

	const [rowdata, setRowdata] = useState({})
	const [crewType, setCrewType] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [othersConttryValue, setOthersConttryValue] = useState('');
    
	const { 
        success, 
        areaList, 
        isLoadingAddUser,
        employeeTypeList, 
        contactTypeList 
    } = useSelector(state => state.employee)
    const { countryList } = useSelector(state => state.country)
    const { userTypeList } = useSelector(state => state.userType)
	const { aircraftTypeList } = useSelector(state => state.aircrafttype)
	const { routePermissions } = useSelector(state => state.auth)
	const { airportList } = useSelector(state => state.airport)

    const { id } = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [form] = Form.useForm()
    
	// destructure parent path name 
	const { parent } = routePermissions

    const roleLookup = {
        '/crew-management/rated-crews': 'COCKPIT_CREW',
        '/crew-management/cabin-crews': 'CABIN_CREW'
    };
    // getting crew type from path
    const crewTypes = roleLookup[parent] || null
    
    // get form values
    const userTypeId = Form.useWatch('userTypeId', form)
    const contractTypeId = Form.useWatch('contractTypeId', form)
    const countryId = Form.useWatch('countryId', form)

    // File upload button
    const uploadButton = (
        id && rowdata?.profileUrl ? (
            <Image
                width={100}
                height={100}
                src={(!rowdata?.profileUrl || rowdata?.profileUrl === 'N/A') ? defaultImage : rowdata?.profileUrl}
                preview={false}
            />
        ) : (
            <div>
                <PlusOutlined />
                <div
                    style={{
                        marginTop: 8,
                    }}
                >
                    Upload
                </div>
            </div>
        )
    );
    
    // Save or Submit Handler
	const _onFinish = (values) => {
        if(values.emergencyContactNumber == values.mobile) {
            return showAlert('warning', 'Mobile and Emergency contact number can not be same.')
        }
        if(values.serialRank < 0 ) return showAlert('warning', 'Serial rank can not be negative.')
        
		const { birthDate, joiningDate, passportExpiryDate, contractDate } = values
		const transformedValues = {
			...values,
            crewType: crewType,
            countryId: countryId !== 'others' ? values.countryId : null,
            others: countryId === 'others' && othersConttryValue,
            isUser: userTypeId ? true : false,
            aircraftTypesIds: Array.isArray(values.aircraftTypesIds) ? values.aircraftTypesIds : [values.aircraftTypesIds],
			profileUrl: objectUrl ?? rowdata?.profileUrl,
			birthDate: birthDate?.format('YYYY-MM-DD'),
			contractDate: {
                startDate: contractDate?.[0]?.format('YYYY-MM-DD'),
				endDate: contractDate?.[1]?.format('YYYY-MM-DD'),
            },
			joiningDate: joiningDate?.format('YYYY-MM-DD'),
			passportExpiryDate: passportExpiryDate?.format('YYYY-MM-DD'),
            emergencyContactNumber: values.emergencyContactNumber?.trim(),
            mobile: values.mobile?.trim()
		}

		// dispatch to add and edit action
		if(id) {
			transformedValues.id = Number(id)
			const {fileName, name, ...finalData} = rowdata
            if(comapreWithLodash.isEqual(transformedValues, finalData)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }
			dispatch(editEmployee(transformedValues))
		} else {
			dispatch(addEmployee(transformedValues))
		} 
	}

	//reset form data
	const _onReset = () => {
        setProgress(0)
        setSelectedFile([])
		form.resetFields()
	}

    // create gender list
    const genderList = [
        {
            id: 1,
            name: 'Male',
            value: 'MALE'
        },
        {
            id: 2,
            name: 'Female',
            value: 'FEMALE'
        },
        {
            id: 3,
            name: 'Others',
            value: 'OTHERS'
        },
    ]

    // structure country list
    const _updatedCountryList = () => {
        return countryList?.length ? countryList.map((item) => ({label: item?.name, value: item?.id})) : []
    }

    // Date Range PreSets
	const rangePresets = [
		{
            label: 'Next 180 Days',
            value: [dayjs(), dayjs().add(180, 'd')],
        },
        {
            label: 'Next 1 Year',
            value: [dayjs(), dayjs().add(1, 'y')],
        },
	]

	const inputField = (type) => {
		const _components = {
			text: <Input type={'text'} placeholder="Enter here." />,
			textarea: <Input.TextArea type={'text'} placeholder="Enter details here." />,
			password: <Input.Password type={'password'} placeholder="Enter password here." />,
			number: <InputNumber min={0} type={'number'} placeholder="Enter number here." style={{width: '100%'}}/>,
			serialRank: <InputNumber type={'number'} placeholder="Enter number here." style={{width: '100%'}}/>,
			email: <Input type={'email'} placeholder="Enter email here." />,
			birthdate: <DatePicker disabledDate={(current) => current && current > dayjs().endOf('day')} style={{width: '100%'}}/>,
			date: <DatePicker style={{width: '100%'}}/>,
            dateRange: (
                <CustomDateRangePicker
                    rangePresets={rangePresets}
                />
            ),
			userSelect: (
                <Select
                    showSearch
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={userTypeList?.map(item => ({label: item?.name, value: item?.id}))}
                />
			),
			areaId: (
                <Select placeholder="Please select area">
					{
						areaList?.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
					}
				</Select>
			),
			aircraftTypesIds: (
                <Select
                    showSearch
                    mode={ (crewType === 'CABIN_CREW') ? "multiple" : "single" }
                    tagRender={TagRender}
                    showArrow
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Search to select airport type"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={aircraftTypeList.map((item) => ({label: item?.name, value: item?.id}))}
                />
			),
			countryId: (
                <Select
                    showSearch
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Search to select country"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={_updatedCountryList()}
                />
			),
			restrictedAirportsIds: (
                <Select
                    showSearch
                    mode='multiple'
                    tagRender={TagRender}
                    showArrow
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Search to select airport"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={airportList.map((item) => ({label: item?.code, value: item?.id}))}
                />
			),
			crewType: (
                <Select placeholder="Please select crew type">
                    <Select.Option value={'CABIN_CREW'}>{'Cabin Crew'}</Select.Option>
                    <Select.Option value={'COCKPIT_CREW'}>{'Cockpit Crew'}</Select.Option>
				</Select>
			),
            cabinCrewType: (
                <Select placeholder="Please select cabin crew type">
                    <Select.Option value={'PURSER'}>{'PURSER'}</Select.Option>
                    <Select.Option value={'JUNIOR_PURSER'}>{'JUNIOR PURSER'}</Select.Option>
                    <Select.Option value={'GENERAL_CREW'}>{'GENERAL CREW'}</Select.Option>
                </Select>
            ),
			cockpitCrewType: (
                <Select placeholder="Please select cockpit crew type">
                    <Select.Option value={'CAPTAIN'}>{'CAPTAIN'}</Select.Option>
                    <Select.Option value={'FIRST_OFFICER'}>{'FIRST OFFICER'}</Select.Option>
				</Select>
			),
			isForeign: (
                <Select placeholder="Please select nationality">
                    <Select.Option value={false}>{'NO'}</Select.Option>
                    <Select.Option value={true}>{'YES'}</Select.Option>
				</Select>
			),
			gender: (
                <CustomSelectBox 
                    itemList={genderList} 
                    label={'name'} 
                    dataIndex={'value'} 
                    placeholder={`Select Gender`}
                />
			),
			employeeTypeId: (
                <CustomSelectWithSearch 
                    itemList={employeeTypeList} 
                    label={'displayName'} 
                    dataIndex={'employeeTypeId'} 
                    mode={'single'}
                    tagRender={null}
                    allowClear={false}
                    placeholder={`Select Employee Type`}
                />
			),
			contractTypeId: (
                <CustomSelectWithSearch 
                    itemList={contactTypeList} 
                    label={'displayName'} 
                    dataIndex={'contractTypeId'} 
                    mode={'single'}
                    tagRender={null}
                    allowClear={false}
                    placeholder={`Select Contact Type`}
                />
			),
			profile: (
                <>
                    <div>
                        <Upload
                            accept="image/*"
                            listType="picture-card"
                            fileList={selectedFile}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                            onRemove={onRemoveFileUploadHandler}
                        >
                            {selectedFile.length >= 1 ? null : uploadButton}
                        </Upload>
                    </div>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img
                            alt="example"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>
                </>
			),
            progress: (
                <div className={'text-green-400 mt-10'}>
                    File Upload Progress is <span className={'text-green-900 font-bold'}> {progress}% </span>
                </div>
            )
		}

        return _components[type] || null;
	}

    useEffect(() => {
        setCrewType(crewTypes)
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [success, crewType, crewTypes])

    useEffect(()=> {
        // get data for select box
        dispatch(getUserTypeList(PAGE_SIZE))
        dispatch(getAreaList(PAGE_SIZE))
        dispatch(getAircraftTypeList(PAGE_SIZE))
        dispatch(getContactTypeList(PAGE_SIZE))
        dispatch(getCountryList(PAGE_SIZE))
        dispatch(getAirportList(PAGE_SIZE))
        dispatch(getEmployeeTypeList(PAGE_SIZE))
    },[])

    useEffect(() => {
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(EMPLOYEE.GET_EMPLOYEE_LIST + id)
                const startDate = data?.contractDate?.startDate && dayjs(data.contractDate.startDate);
                const endDate = data?.contractDate?.endDate && dayjs(data.contractDate.endDate);
                let newvalues = {
                    ...data,
                    birthDate: data?.birthDate && dayjs(data?.birthDate),
                    contractDate: [startDate, endDate],
                    joiningDate: data?.joiningDate && dayjs(data?.joiningDate),
                    passportExpiryDate: data?.passportExpiryDate && dayjs(data?.passportExpiryDate),
                }
                setCrewType(data?.crewType)
                setRowdata(data)
                
                form.setFieldsValue(newvalues)
            } catch (error) {
                console.error(error)
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(id) _fetchData();
    }, [ id ])

    // for others country modal
    const handleOkModal = () => {
        setIsModalOpen(false);
    };
    const handleCancelModal = () => {
        setIsModalOpen(false);
    };

    // others country onChange handler
    const othersCountryHandler = (e) => {
        setOthersConttryValue(e.target.value)
    }

    // onChange Handler
    const onValueChangeHander = (changedValues, _) => {
        const _addNewCountry = () => {
            setIsModalOpen(true)
        }

        if(changedValues?.countryId === 'others') {
            _addNewCountry()
        }
    } 

    // define field list for employee
    const FieldsItem = [
        {
            id: 1,
            field_name: 'Employee Type Info',
            field: [
                {
                    id: (crewType === 'CABIN_CREW') ? 2 : null,
                    name: 'cabinCrewType',
                    label: 'Cabin Crew Type',
                    type: 'cabinCrewType',
                    category: 'employee_type_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select cabin crew type.',
                        },
                    ],
                },
                {
                    id: (crewType === 'COCKPIT_CREW') ? 3 : null,
                    name: 'cockpitCrewType',
                    label: 'Cockpit Crew Type',
                    type: 'cockpitCrewType',
                    category: 'employee_type_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select cockpit crew type.',
                        },
                    ],
                },
                {
                    id: 8,
                    name: 'employeeTypeId',
                    label: 'Employee Type',
                    type: 'employeeTypeId',
                    category: 'employee_type_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'Employee type is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select employee type.',
                        },
                    ],
                },
                {
                    id: 9,
                    name: 'contractTypeId',
                    label: 'Contract Type',
                    type: 'contractTypeId',
                    category: 'employee_type_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'Contract type is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select contract type.',
                        },
                    ],
                },
                {
                    id: contractTypeId ? 10 : null,
                    name: 'contractDate',
                    label: 'Contract Date',
                    type: 'dateRange',
                    category: 'employee_type_info',
                    rules: [
                        {
                            required: false,
                            message: 'Please select contract date.',
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'code',
                    label: 'Employee Id',
                    type: 'text',
                    category: 'employee_type_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter employee id.',
                        },
                    ],
                },
                {
                    id: (crewType) ? 6 : null,
                    name: 'aircraftTypesIds',
                    label: 'Aircraft Type',
                    type: 'aircraftTypesIds',
                    category: 'employee_type_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select aircraft type.',
                        },
                    ],
                },
                {
                    id: 7,
                    name: 'restrictedAirportsIds',
                    label: 'Restricted Airport',
                    type: 'restrictedAirportsIds',
                    category: 'employee_type_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: false,
                            message: 'Please select aircraft type.',
                        },
                    ],
                },
            ]

        },
        {
            id: 2,
            field_name: 'Employee Personal Info',
            field: [
                {
                    id: 1,
                    name: 'firstName',
                    label: 'Employee First Name',
                    type: 'text',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter first name.',
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'lastName',
                    label: 'Employee Last Name',
                    type: 'text',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter last name.',
                        },
                    ],
                },
                {
                    id: 3,
                    name: 'email',
                    label: 'Email',
                    type: 'text',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'email',
                            message: 'Please enter valid email address.',
                        },
                        {
                            required: true,
                            message: 'Please enter email.',
                        },
                    ],
                },
                {
                    id: 5,
                    name: 'mobile',
                    label: 'Mobile',
                    type: 'text',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter mobile no.',
                        },
                    ],
                },
                {
                    id: 6,
                    name: 'birthDate',
                    label: 'Birth Date',
                    type: 'birthdate',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'date',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select birth date.',
                        },
                    ],
                },
                {
                    id: 7,
                    name: 'emergencyContactName',
                    label: 'Emergency Contact Name',
                    type: 'text',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter emergency contact name.',
                        },
                    ],
                },
                {
                    id: 8,
                    name: 'emergencyContactNumber',
                    label: 'Emergency Contact Number',
                    type: 'text',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter emergency contact number.',
                        },
                    ],
                },
                {
                    id: 11,
                    name: 'countryId',
                    label: 'Country',
                    type: 'countryId',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select country.',
                        },
                    ],
                },
                {
                    id: 12,
                    name: 'gender',
                    label: 'Gender',
                    type: 'gender',
                    category: 'employee_personal_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'Gender is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select gender.',
                        },
                    ],
                },
            ]

        },
        {
            id: 5,
            field_name: 'Profile Picture',
            field: [
                {
                    id: 1,
                    name: 'profile',
                    label: '',
                    type: 'profile',
                    category: 'profile_picture',
                    rules: [
                        {
                            type: 'select',
                            message: 'Profile Picture is not valid',
                        },
                        {
                            required: false,
                            message: 'Please select Profile.',
                        },
                    ],
                },
                {
                    id: 3,
                    name: 'progress',
                    label: '',
                    type: 'progress',
                    category: 'profile_picture',
                    rules: [
                    ],
                },
            ]

        },
        {
            id: 3,
            field_name: 'Employee Address Info',
            field: [
                {
                    id: 1,
                    name: 'postCode',
                    label: 'Post Code',
                    type: 'text',
                    category: 'employee_address_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter post code.',
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'areaId',
                    label: 'Area',
                    type: 'areaId',
                    category: 'employee_address_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select area.',
                        },
                    ],
                },
                {
                    id: 3,
                    name: 'roadNo',
                    label: 'Road No',
                    type: 'text',
                    category: 'employee_address_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: false,
                            message: 'Please enter road no.',
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'blockNo',
                    label: 'Block No',
                    type: 'text',
                    category: 'employee_address_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: false,
                            message: 'Please enter block no.',
                        },
                    ],
                },
                {
                    id: 5,
                    name: 'flatNo',
                    label: 'Flat No',
                    type: 'text',
                    category: 'employee_address_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: false,
                            message: 'Please enter flat no.',
                        },
                    ],
                },
                {
                    id: 6,
                    name: 'houseNo',
                    label: 'House No',
                    type: 'text',
                    category: 'employee_address_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter house no.',
                        },
                    ],
                },
                {
                    id: 7,
                    name: 'addressRemarks',
                    label: 'Address Remarks',
                    type: 'textarea',
                    category: 'employee_address_info',
                    rules: [
                        {
                            type: 'textarea',
                            message: 'The input is not valid',
                        },
                        {
                            required: false,
                            message: 'Please enter address remarks.',
                        },
                    ],
                },
            ]

        },
        {
            id: 4,
            field_name: 'Employee Official Info',
            field: [
                {
                    id: 1,
                    name: 'joiningDate',
                    label: 'Joining Date',
                    type: 'date',
                    category: 'employee_office_info',
                    rules: [
                        {
                            type: 'date',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select joining date.',
                        },
                    ],
                },
                {
                    id: 3,
                    name: 'licenceNumber',
                    label: 'Licence Number',
                    type: 'text',
                    category: 'employee_office_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter licence number.',
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'passportNumber',
                    label: 'Passport Number',
                    type: 'text',
                    category: 'employee_office_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter passport number.',
                        },
                    ],
                },
                {
                    id: 5,
                    name: 'passportExpiryDate',
                    label: 'Passport Expiry Date',
                    type: 'date',
                    category: 'employee_office_info',
                    rules: [
                        {
                            type: 'date',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select passport expiry date.',
                        },
                    ],
                },
                {
                    id: 6,
                    name: 'serialRank',
                    label: 'Serial Rank',
                    type: 'serialRank',
                    category: 'employee_office_info',
                    rules: [
                        {
                            type: 'number',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please input positive serial rank.',
                        },
                    ],
                },
                {
                    id: 7,
                    name: 'batch',
                    label: 'Batch',
                    type: 'number',
                    category: 'employee_office_info',
                    rules: [
                        {
                            type: 'number',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please enter batch.',
                        },
                    ],
                },
                
            ]

        },
        {
            id: id ? null : 5,
            field_name: 'User Info',
            field: [
                {
                    id: id ? null : 1,
                    name: 'userTypeId',
                    label: 'User Type',
                    type: 'userSelect',
                    category: 'user_info',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select user type.',
                        },
                    ],
                },
                {
                    id: id ? null : 2,
                    name: 'userName',
                    label: 'User Name',
                    type: 'text',
                    category: 'user_info',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please input user name.',
                        },
                    ],
                },
            ]
        }
    ]

	return (
        <div className={'bg-white py-3 rounded-md'}>
            <Form
                validateTrigger={'onChange'}
                form={form}
                onFinish={_onFinish}
                scrollToFirstError
                layout={'vertical'}
                autoComplete={'off'}
                onValuesChange={onValueChangeHander}
            >
                <div className='gap-5 sm:p-5'>
                    {
                        FieldsItem?.map((field, index) => {
                            return (
                                field.id && <Badge.Ribbon text={field.field_name} placement='start'>
                                    <div key={index} className={'grid sm:grid-cols-2 lg:grid-cols-3 p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'}>
                                        { field.field.map(item => {
                                            if(item.id) {
                                                return (
                                                    <>
                                                        <Form.Item
                                                            key={item.id}
                                                            name={item.name}
                                                            label={item.label}
                                                            rules={item.rules}
                                                            dependencies={item.dependencies ?? []}
                                                        >
                                                            {inputField(item?.type)}
                                                        </Form.Item>
                                                    </>
                                                )
                                            }
                                        }) }
                                    </div>
                                </Badge.Ribbon>
                            )
                        })
                    }
                </div>

                <Form.Item style={{marginLeft: '17px'}}>
                    <Button 
                        htmlType={'submit'} 
                        type={'primary'} 
                        loading={ isLoadingAddUser } 
                        style={{ margin: '5px' }}
                    >
                        { id ? 'Update' : 'Submit'}
                    </Button>
                    {
                        !id && 
                            <Button 
                                htmlType={'reset'} 
                                onClick={_onReset}
                            >
                                {'Reset'}
                            </Button>
                    }
                </Form.Item>
            </Form>

            {
                countryId === 'others' && (
                    <Modal
                        title="Add Others Country" 
                        open={isModalOpen} 
                        onOk={handleOkModal} 
                        onCancel={handleCancelModal}
                        maskClosable={false}
                    >
                        <Input onChange={othersCountryHandler} type={'text'} placeholder="Enter country name" />
                    </Modal>
                )
            }
        </div>
	)
}

// export add edit form
export default AddEditForm
