import { useMemo, memo } from 'react'
import { Input, DatePicker, TimePicker, Select, InputNumber, Space } from 'antd'

const { RangePicker } = DatePicker;

// Date Picker
const CustomDatePicker = ({ showTime, placeholder, ...rest }) => (
	<DatePicker showTime={showTime} style={{ width: '100%' }} placeholder={placeholder} {...rest} />
)

// Month Picker
const CustomMonthPicker = ({ disabledDate=false, placeholder, ...rest }) => (
	<DatePicker disabledDate={disabledDate} picker="month" style={{ width: '100%' }} placeholder={placeholder} {...rest} />
)

// Date Range Picker
const CustomDateRangePicker = ({ rangePresets, ...rest }) => (
    <Space direction="vertical" size={12} style={{width: '100%'}}>
        <RangePicker 
            presets={rangePresets} 
            {...rest}
            style={{width: '100%'}}
        />
    </Space>
)

// Time Picker
const CustomTimePicker = ({ showTime, placeholder, format, ...rest }) => (
	<TimePicker
		showTime={showTime}
		style={{ width: '100%' }}
		placeholder={placeholder}
		format={format}
		{...rest}
	/>
)

// Input Field
const CustomInput = ({ type, placeholder, ...rest }) => (
	<Input type={type} placeholder={placeholder} {...rest} />
)

// Input Number
const CustomInputNumber = ({ type, placeholder, ...rest }) => (
	<InputNumber type={type} placeholder={placeholder} {...rest} />
)

// Input Password
const CustomInputPassword = ({ type, placeholder, ...rest }) => (
	<Input.Password type={type} placeholder={placeholder} {...rest} />
)

// Text Area
const CustomTextArea = ({ type, placeholder, ...rest }) => (
	<Input.TextArea type={type} placeholder={placeholder} {...rest} />
)

// Select Box
const CustomSelectBox = ({ itemList, label, dataIndex, placeholder, ...rest }) => (
	<Select placeholder={placeholder} {...rest} className={'min-w-[200px]'}>
		{itemList.map((item, index) => (
			<Select.Option value={item?.[dataIndex]} key={index}>
				{item?.[label]}
			</Select.Option>
		))}
	</Select>
)

// Select Box With Search
const CustomSelectWithSearch = memo(
	({
		itemList,
		label,
		dataIndex,
		mode,
		tagRender = false,
		allowClear = true,
		placeholder,
		...rest
	}) => {
		const options = useMemo(() => {
			return itemList.map((item) => ({ label: item?.[label], value: item?.[dataIndex] }))
		}, [itemList, label, dataIndex])

		return (
			<Select
				{...rest}
				showSearch
				allowClear={allowClear}
				mode={mode}
				tagRender={tagRender}
				style={{
					width: '100%',
				}}
				placeholder={placeholder}
				optionFilterProp='children'
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
				filterSort={(optionA, optionB) =>
					(optionA?.label ?? '')
						.toLowerCase()
						.localeCompare((optionB?.label ?? '').toLowerCase())
				}
				options={options}
			/>
		)
	}
)

export {
	CustomDatePicker,
	CustomMonthPicker,
	CustomTimePicker,
	CustomInput,
	CustomInputNumber,
	CustomSelectBox,
	CustomSelectWithSearch,
	CustomTextArea,
	CustomInputPassword,
    CustomDateRangePicker
}
