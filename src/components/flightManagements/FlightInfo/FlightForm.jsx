import { useSelector } from 'react-redux';

// import components
import {
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
} from 'antd';

// import custom hooks and values
import useFlightInfoAddEditForm from './useFlightInfoAddEditForm';
import { CustomSelectWithSearch } from '../../commonComponents';

// Addeditform function
function AddEditForm() {
  const {
    addEditInfoFields,
    handleOnFinish,
    handleOnReset,
    onValuesChangeHandler,
    isLoadingAddUser,
    form,
    id,
    scheduleName,
  } = useFlightInfoAddEditForm();
  
  const { aircraftList } = useSelector((state) => state.aircraft);
  const { airportList } = useSelector((state) => state.airport);
  const { airportPairList } = useSelector((state) => state.airportpair);
  const { aircraftTypeList } = useSelector((state) => state.aircrafttype);

  const inputField = (type) => {
    const components = {
      text: <Input type={'text'} placeholder="Enter flight no" />,
      textarea: (
        <Input.TextArea type={'text'} placeholder="Enter details here!" />
      ),
      password: (
        <Input.Password
          type={'password'}
          placeholder={'Enter password here!'}
        />
      ),
      number: (
        <InputNumber type={'number'} placeholder={'Enter number here!'} />
      ),
      flightdate: <DatePicker style={{ width: '100%' }} />,
      date: <DatePicker showTime style={{ width: '100%' }} />,
      timePicker: <TimePicker style={{ width: '100%' }} format="HHmm" />,
      aircraft: (
        <Select
          showSearch
          allowClear
          style={{
            width: '100%',
          }}
          placeholder="Search to Select Aircraft"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={aircraftList?.map((item) => ({
            label: item?.name,
            value: item?.id,
          }))}
        />
      ),
      flightSchedule: (
        <div className={'bg-[#FFF8DE] rounded-md p-2 '}>
            { scheduleName }
        </div>
      ),
      flightStatus: (
        <Select placeholder="Select flight status">
          <Select.Option value="PENDING"> PENDING </Select.Option>
          <Select.Option value="COMPLETED"> COMPLETED </Select.Option>
          <Select.Option value="DELAYED"> DELAYED </Select.Option>
          <Select.Option value="CANCELLED"> CANCELLED </Select.Option>
        </Select>
      ),
      airportPairId: (
        <Select
          showSearch
          allowClear
          style={{ width: '100%' }}
          placeholder={'Search to Select Airport Pair'}
          optionFilterProp={'children'}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={airportPairList?.map((item) => ({
            label: item?.leg,
            value: item?.id,
          }))}
        />
      ),
      fromairport: (
        <Select placeholder={'Select starting airport'}>
          {airportList?.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      ),
      toairport: (
        <Select placeholder={'Select destination airport'}>
          {airportList?.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      ),
      flighttype: (
        <Select placeholder={'Select flight type'}>
          <Select.Option value={'INTERNATIONAL'}> INTERNATIONAL </Select.Option>
          <Select.Option value={'DOMESTIC'}> DOMESTIC </Select.Option>
        </Select>
      ),
      aircraftTypeSelectBox: ( 
        <CustomSelectWithSearch
            itemList={aircraftTypeList}
            label={'name'}
            dataIndex={'id'}
            mode={'single'}
            allowClear={true}
            placeholder={`Select aircraft type`}
        />
      ),
    };
    return components[type] || null;
  };

  return (
    <div className={'bg-white py-3 rounded-md'}>
        <Form
          validateTrigger={'onChange'}
          form={form}
          onFinish={handleOnFinish}
          scrollToFirstError
          layout={'vertical'}
          autoComplete={'off'}
          onValuesChange={onValuesChangeHandler}
        >
          <div className={'gap-5 sm:p-5'}>
            {addEditInfoFields?.length > 0 &&
              addEditInfoFields.map((field, index) => {
                return (
                  <Badge.Ribbon text={field?.field_name} placement={'start'}>
                    <div
                      key={index}
                      className={
                        'grid sm:grid-cols-2 lg:grid-cols-3 p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'
                      }
                    >
                      {field.field.map((item) => {
                        if (item?.id) {
                          return (
                            <Form.Item
                              key={item?.id}
                              name={item?.name ?? 'N/A'}
                              label={item?.label}
                              rules={item?.rules}
                              dependencies={item?.dependencies ?? []}
                            >
                              {inputField(item?.type)}
                            </Form.Item>
                          );
                        }
                      })}
                    </div>
                  </Badge.Ribbon>
                );
              })}
          </div>
          <Form.Item style={{ marginLeft: '17px' }}>
            <Button
              htmlType={'submit'}
              type={'primary'}
              loading={isLoadingAddUser}
              style={{ margin: '5px' }}
            >
              {!id ? 'Submit' : 'Update'}
            </Button>
            {!id && (
              <Button htmlType={'reset'} onClick={handleOnReset}>
                {'Reset'}
              </Button>
            )}
          </Form.Item>
        </Form>
    </div>
  );
}

export default AddEditForm;
