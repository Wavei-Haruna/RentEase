import { createContext, useState } from "react";
import { navItems } from "../../utils";



export const navContext = createContext();

export function ActiveRouteProvider({children}){
const {isActive, setIsActive} = useState(1)
const [showMenu, setShowMenu] = useState(false);




    return (
        <navContext.Provider value={{isActive, setIsActive, navItems, showMenu, setShowMenu}}>           
       { children}
        </navContext.Provider>
    )

}


