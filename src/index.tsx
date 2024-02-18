import axios from 'axios'
import { Chart, registerables } from 'chart.js'

// Apps
import { CookiesProvider } from 'react-cookie'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { MetronicI18nProvider } from './_metronic/i18n/Metronici18n'
import { AuthProvider, setupAxios } from './app/modules/auth'
import { persistor, store } from './app/redux'
import { AppRoutes } from './app/routing/AppRoutes'

// CSS
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import 'react-grid-layout/css/styles.css'
import 'react-image-crop/dist/ReactCrop.css'
import 'react-resizable/css/styles.css'
import './index.css'

import FilterMarketDataProvider from '#context/filterMarketDataContext'
import IndexDataProvider from '#context/indexContext'
import { createRoot } from 'react-dom/client'

setupAxios(axios)

Chart.register(...registerables)

const container = document.getElementById('root') as HTMLElement

const root = createRoot(container)



root.render(
  <Provider store={store}>
    <FilterMarketDataProvider>
        <MetronicI18nProvider>
          <AuthProvider>
            <CookiesProvider>
              <IndexDataProvider>
                <PersistGate loading={null} persistor={persistor}>
                  <AppRoutes />
                </PersistGate>
              </IndexDataProvider>
            </CookiesProvider>
          </AuthProvider>
        </MetronicI18nProvider>
    </FilterMarketDataProvider>
  </Provider>
)
