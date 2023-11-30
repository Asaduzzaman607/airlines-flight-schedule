import { BellOutlined } from "@ant-design/icons";

export function Trigger({ count, onClick }) {
  return (
    <div onClick={onClick} className={'relative inline-block cursor-pointer'}>
      <BellOutlined style={{fontSize: '27px'}}/>
      {
        count > 0 && <span className={'absolute bg-red-500 w-[22px] h-[22px] flex justify-center items-center rounded-md text-white -top-1 -right-2 text-center '}>{count}</span>
      }
    </div>
  );
}
