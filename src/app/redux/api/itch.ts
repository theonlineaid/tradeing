import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {MarketDataStruct} from '../../common/types/market-data'

export type Channel = 'redux' | 'general'

export const itchAPI = createApi({
  reducerPath: 'itchApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.1.35:8080'}),
  endpoints: (build) => ({
    getITCHData: build.query<MarketDataStruct[], any>({
      query: (channel) => `/api/v1/`,
      async onCacheEntryAdded(arg, {updateCachedData, cacheDataLoaded, cacheEntryRemoved}) {
        console.log('getITCHData query call')

        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket('ws://192.168.1.35:8080/ws/v1/itch')
        try {
          console.log("I'm in getITCHData try section")
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          console.log('successfully cacheDataLoaded')

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = (event: MessageEvent) => {
            console.log('itch socket data: ', event)

            const data = JSON.parse(event.data)

            console.log('Socket listen in redux', {arg, data})

            updateCachedData((draft) => {
              console.log('updateCachedData draft: ', draft)

              const idx = draft.findIndex((item) => item.id === data?.id)
              if (idx === -1) {
                draft.push(data)
              } else {
                draft[idx] = data
              }
            })
          }

          ws.addEventListener('message', listener)
          ws.addEventListener('open', (e) => console.log('itch connection open: ', e))
          ws.addEventListener('close', (e) => console.log('itch connection close: ', e))
          ws.addEventListener('error', (e) => console.log('itch connection error: ', e))
        } catch (err) {
          console.error('itch data loading error: ', err)
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close()
      },
    }),
  }),
})

export const {useGetITCHDataQuery} = itchAPI
