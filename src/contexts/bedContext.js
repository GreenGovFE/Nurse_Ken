import React, { createContext, useState, useContext } from 'react';

const BedContext = createContext();

export const useBeds = () => useContext(BedContext);

export const BedProvider = ({ children }) => {
    const [beds, setBeds] = useState([]);
    const [bedsTablePages, setBedTablePages] = useState(1);
    const [bedsTablePage, setBedTablePage] = useState(1);

    return (
        <BedContext.Provider value={{ beds, setBeds, bedsTablePages, setBedTablePages,bedsTablePage, setBedTablePage }}>
            {children}
        </BedContext.Provider>
    );
};
