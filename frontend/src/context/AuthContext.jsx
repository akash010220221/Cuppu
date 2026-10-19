import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [coupon, setCoupon] = useState([])

    return (
        <AuthContext.Provider value={{ user, setUser, coupon, setCoupon }}>
            {children}
        </AuthContext.Provider >
    )
}

export const useAuth = () => useContext(AuthContext)