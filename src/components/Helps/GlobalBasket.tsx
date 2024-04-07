'use client';
import { createContext, useContext, useState } from "react";

const GlobalContext = createContext<any>([]);

export const GlobalContextProvider = ({children}:any) => {
    const [basket, setBasket] = useState<any>([{
        
    }]);

    return(
        <GlobalContext.Provider value={{basket, setBasket}}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useBasketContext = () => useContext(GlobalContext);