import React from 'react';

const useMarketDataFilter = (marketDatas, filterData) => {
    
    const filteredData = marketDatas?.filter((dt) => {
        return (
          (filterData.market == '' || dt.board == filterData.market) &&
          (filterData.category == '' || dt.group == filterData.category) &&
          (filterData.sector == '' || dt.sector == filterData.sector) &&
          (filterData.option == '' || dt.short_name == filterData.option)
        );
      });

      return filteredData;
};

export default useMarketDataFilter;