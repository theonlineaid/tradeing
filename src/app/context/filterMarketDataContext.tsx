import { BlotterDataStruct, BlotterDataType } from "#common/types/blotter-data";
import { RootState } from "#store/index";
import * as React from "react";
import { useSelector } from "react-redux";
// import { blotterDataStruct, MarketDataType } from "#common/types/market-data";

export const FilterMarketDataContext = React.createContext<any | null>(null);
interface Props {
    children?: React.ReactNode;
}


const FilterMarketDataProvider: React.FC<Props> = ({ children }) => {
    const [filterMarketData, setFilterMarketData] = React.useState<any>({
        market: '',
        category: '',
        sector: '',
        option: '',
      }
    );


    return (
        <FilterMarketDataContext.Provider value={{ filterMarketData, setFilterMarketData }}>
            {children}
        </FilterMarketDataContext.Provider>
    );
};

export default FilterMarketDataProvider;
