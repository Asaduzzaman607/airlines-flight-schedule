// import components
import {
  Select
} from 'antd';

const CustomSelect = ({ width, options, placeholder, ...rest }) => {
  return (
    <Select
      {...rest}
      style={{ width: width ?? 200 }}
      options={options}
      placeholder={placeholder ?? ''}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      // filterSort={(optionA, optionB) =>
      //   (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      // }
    />
  )
}

export default CustomSelect