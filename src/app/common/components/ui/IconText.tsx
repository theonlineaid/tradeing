import React from 'react'
import {KTSVG} from '../../../../_metronic/helpers'

interface Props {
  path: string
  text: string
}

const IconText = ({path, text}: Props) => {
  return (
    <a href='#' className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'>
      <KTSVG path={path} className='svg-icon-4 me-1' />
      {text}
    </a>
  )
}

export default IconText
