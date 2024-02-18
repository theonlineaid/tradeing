import React from 'react'

interface Props {
  footer: JSX.Element | null
  bgColor?: string
}

const BuySellBar: React.FC<React.PropsWithChildren<Props>> = ({footer, children, bgColor = ''}) => {
  return (
    <>
      <div className={`${bgColor}p-3`}>{children}</div>
      <div className='d-flex justify-content-between align-items-center '>{footer}</div>
    </>
  )
}

export default BuySellBar
