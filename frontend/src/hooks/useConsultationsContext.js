import { ConsultationContext } from '../context/ConsultationContext'
import { useContext } from 'react'

export const useConsultationContext = () => {
  const context = useContext(ConsultationContext)

  if (!context) {
    throw Error('useConsultationsContext must be used inside a ConsultationContextProvider')
  }

  return context
}