/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {AsideMenuItem} from './AsideMenuItem'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'

export function AsideMenuMain() {
  const intl = useIntl()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen008.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItemWithSub
        to='/order/form'
        title='Order'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/ecommerce/ecm001.svg'
      >
        <AsideMenuItem to='/order/buy' title='Buy and Sell' hasBullet={true} />
        <AsideMenuItem to='/order/trades' title='Trades' hasBullet={true} />
      </AsideMenuItemWithSub>

      {/* <AsideMenuItemWithSub
        to='/credit-panel/form'
        title='DSE Panel'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/coding/cod003.svg'
      >
        <AsideMenuItem to='/credit-panel/list' title='DSE Panel' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      <AsideMenuItem
        to='/settings/general'
        icon='/media/icons/duotune/general/gen009.svg'
        title="Settings"
        fontIcon='bi-app-indicator'
      />

    </>
  )
}
