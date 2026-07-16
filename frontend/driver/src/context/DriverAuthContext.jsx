import {createContext,useState} from 'react';
const DriverAuthContext = createContext();
export const DriverAuthProvider = ({children})=>{
    const [driver,setDriver] = useState(null);
    const [loading,setLoading] = useState(true);
    return(
        <DriverAuthContext.Provider
        value={{
            driver,
            setDriver,
            loading,
            setLoading
        }}
        >
            {children}
        </DriverAuthContext.Provider>
    )

};
export default DriverAuthContext;