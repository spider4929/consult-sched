import { createContext, useReducer } from "react";

export const ConsultationContext = createContext()

export const consultationReducer = (state, action) => {
    switch (action.type) {
        // case 'GET_CONSULTATIONS':
        //     return {
        //         consultations: action.payload
        //     }
        case 'STORE_A_CONSULTATION':
            return {
                consultation: action.payload
            }
        // case 'EDIT_CONSULTATION':
        //     return {
        //         // TODO: add case for edit
        //     }
        // case 'DELETE_CONSULTATION':
        //     return {
        //         consultations: state.consultations.filter(c => c._id !== action.payload._id)
        //     }
    }
}

export const ConsultationContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(consultationReducer, {
        consultation: null
    })

    return (
        <ConsultationContext.Provider value={{ ...state, dispatch }}>
            { children }
        </ConsultationContext.Provider>
    )

}