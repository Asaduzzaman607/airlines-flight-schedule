import { Tag } from 'antd';

export const ValueTag = ({ value }) => {
  const getColor = () => {
    if (value < 0) {
      return 'red';
    } else if (value > 0) {
      return 'green';
    }
    return 'default';
  };

  const getFormattedValue = () => {
    if (value < 0) {
      return value.toString();
    } else if (value > 0) {
      return `+${value}`;
    }
    return value.toString();
  };

  return <Tag color={getColor()}>{getFormattedValue()}</Tag>;
};
