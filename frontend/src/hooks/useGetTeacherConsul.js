import { useAuthContext } from "./useAuthContext"
import { useState } from "react"

export const useGetTeacherConsul = () => {
    const [error, setError] = useState(null)
    const [teacherConsul, setTeacherConsul] = useState(null)
    const { user } = useAuthContext()

    const getConsultation = async (teacherId) => {
        setError(null)

        const response = await fetch(`api/appointments/${teacherId}`, {
            method: 'GET',
            headers: {
                'x-auth-token': `${user.token}`
              }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json)
            console.log(error)
        }
        
        if (response.ok) {
            setTeacherConsul(json)
        }

        return (teacherConsul)
    }
    
    
    return { getConsultation }
}