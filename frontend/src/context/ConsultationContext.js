import { createContext } from "react";

export const ConsultationContext = createContext()

export const workoutsReducer = (state, action) => {
    switch (action.type) {
        case 'GET_CONSULTATIONS':
            return {
                consultations: action.payload
            }
        case 'CREATE_CONSULTATION':
            return {
                consultations: [...state.consultations, action.payload]
            }
        case 'EDIT_CONSULTATION':
            return {
                // TODO: add case for edit
            }
        case 'DELETE_CONSULTATION':
            return {
                consultations: state.consultations.filter(c => c._id !== action.payload._id)
            }
    }
}

export const ConsultationContextProvider = () => {
    const [state, dispatch] = useReducer(consultationReducer, {
        consultation: null
    })

    return (
        <WorkoutsContext.Provider value={{ ...state, dispatch }}>
            { children }
        </WorkoutsContext.Provider>
    )

}