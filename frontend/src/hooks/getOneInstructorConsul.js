import { useAuthContext } from "./useAuthContext"

export const getOneInstructorConsul = (identity) => {
    const [error, setError] = useState(null)
    const { user } = useAuthContext()
    const identifier = identity

    const getConsultation = async () => {
        setError(null)

        const response = await fetch('', {
            method: 'GET',
            headers: {
                'x-auth-token': `${user.token}`
              }
        })

        const json = await response.json()

        
    }
    
    
    return ()
}