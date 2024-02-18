/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {AsideMenuItem} from './AsideMenuItem'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'

export function AsideMenuMainSettings() {
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
        to='/share-price/form'
        title='Latest Share Price'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <AsideMenuItem to='/share-price/indices' title='Indices' hasBullet={true} />
        <AsideMenuItem to='/share-price/indices_2' title='Indices 2' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItemWithSub
        to='/share-price/form'
        title='Share Trade'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <AsideMenuItem to='/share-price/list' title='Share Price List' hasBullet={true} />
        <AsideMenuItem to='/share-price/trade-list' title='Share Trade List' hasBullet={true} />
        <AsideMenuItem to='/share-price/ticker' title='News Ticker' hasBullet={true} />
        <AsideMenuItem to='/share-price/area-chart' title='Trade Area' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      <AsideMenuItemWithSub
        to='/credit-panel/form'
        title='Credit Panel'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/coding/cod003.svg'
      >
        <AsideMenuItem to='/credit-panel/list' title='Credit Panel' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItem
        to='/settings/general'
        icon='/media/icons/duotune/general/gen008.svg'
        title="Settings"
        fontIcon='bi-app-indicator'
      />

    </>
  )
}
