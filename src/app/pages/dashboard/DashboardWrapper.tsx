/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, PropsWithChildren} from 'react'
import {useIntl} from 'react-intl'

const DashboardPage: FC<PropsWithChildren> = () => <></>

const DashboardWrapper: FC<PropsWithChildren> = () => {
  const intl = useIntl()
  return (
    <>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
