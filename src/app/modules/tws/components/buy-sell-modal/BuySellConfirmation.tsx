import React from 'react'
import {RootState} from '#store/index'
import {Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'

interface ConfirmationProps {
  width?: number
  height?: number
  companyCode: string
  clientCode: string
  quantity: number
  price: number
  handleSubmit: (e: any) => void
  handleClose: (e: any) => void
}

const BuySellConfirmation: React.FC<ConfirmationProps> = ({
  height,
  width,
  companyCode,
  clientCode,
  quantity,
  price,
  handleSubmit,
  handleClose,
}) => {
  const {buySell} = useSelector((state: RootState) => state)

  return (
    <div
      className='tw-fixed bg-[#00000090] tw-flex tw-justify-center tw-items-center tw-z-10 tw-transition-all'
      style={{width: width + 'px', height: height + 'px'}}
    >
      <div
        className={`${
          buySell.isBuy ? 'tw-bg-green-100' : 'tw-bg-red-100'
        } tw-w-1/2 tw-h-60 tw-p-8 tw-rounded tw-border tw-border-green-500`}
      >
        <span className='text-center tw-text-lg tw-font-semibold '>Trade Confirmation</span>
        <div className='tw-flex tw-flex-col tw-justify-between'>
          <ul className='my-3'>
            <li> Company Code : {companyCode}</li>
            <li> Client Code : {clientCode}</li>
            <li> Quantity : {quantity}</li>
            <li> Price : {price}</li>
          </ul>
          <div className='tw-flex tw-justify-end tw-items-center tw-gap-4'>
            <Button
              className={
                buySell.isBuy
                  ? 'tw-bg-gradient-to-l tw-from-green-500 tw-to-green-700 tw-text-white'
                  : 'tw-bg-gradient-to-l tw-from-red-500 tw-to-red-700 tw-dark:text-slate-200 text-white'
              }
              color='success'
              onClick={handleSubmit}
            >
              {buySell.isBuy ? 'Buy' : 'Sell'}
            </Button>
            <Button
              className='tw-bg-gradient-to-r tw-from-purple-500 tw-to-purple-700 tw-text-white'
              onClick={handleClose}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BuySellConfirmation
