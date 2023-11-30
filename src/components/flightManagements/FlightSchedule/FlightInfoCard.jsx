import { IoAirplane } from 'react-icons/io5';
import { MdOutlineFlightTakeoff } from 'react-icons/md';

const FlightInfoCard = ({ flightNo, depTime, arrTime, duration, depLeg, arrLeg }) => {
  return (
    <div className={'grid grid-cols-3 gap-2 text-white rounded-md shadow px-4 py-2 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600'}>
      <div className={'space-y-1'}>
        <div className={'flex items-center space-x-2 text-lg font-bold'}>
          <IoAirplane />
          <div>{flightNo}</div>
        </div>
        <div className={'text-3xl font-bold'}>{depLeg}</div>
        <div className={'font-bold text-lg'}>{depTime}</div>
      </div>
      <div className={'space-y-1 place-self-center flex justify-center items-center flex-col'}>
        <MdOutlineFlightTakeoff className={'text-5xl p-2'} />
        <div>{duration}</div>
      </div>
      <div className={'space-y-1 place-self-end'}>
        <div className={'text-3xl font-bold'}>{arrLeg}</div>
        <div className={'font-bold text-lg'}>{arrTime}</div>
      </div>
    </div>
  )
}

export default FlightInfoCard