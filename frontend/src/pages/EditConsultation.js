import { useEffect, useState } from 'react'

//mui
import { Box } from '@mui/system';
import { FormControl, TextField, Button, Stack, Alert, Typography} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

//hooks
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useConsultationContext } from '../hooks/useConsultationsContext';

const EditConsultation = () => {
    // context calls
    const { user } = useAuthContext()
    const { consultation } = useConsultationContext()

    const navigate = useNavigate()

    // error checking
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    // form useStates
    const [text, setText] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [meetLink, setMeetLink] = useState('')
    const [consulId, setConsulId] = useState('')

    useEffect(() => {
        setConsulId(consultation._id)
        setText(consultation.text)
        setStartDate(consultation.start_date)
        setEndDate(consultation.end_date)
        setMeetLink(consultation.meet_link)
    }, [])

    const handleStarDateChange = (newValue) => {
        setStartDate(newValue);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue);
    };

    // functions

    // pass form to database

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)

        const consultation = {
            text: text, 
            meet_link: meetLink
        }

        console.log(consulId)

        const response = await fetch(`api/appointments/edit/${consulId}`, {
            method: 'PUT',
            body: JSON.stringify(consultation),
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${user.token}`
            }
        })

        const json = await response.json()

        //TODO: set error checking to recevie multiple errors
        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            // dispatch({type: 'CREATE_CONSULTATION', payload: json})
            navigate('/view-consultations')
            setSuccess('Consultation updated!')
        }
    };

    //TODO: add a way for student's to see all of an instructor's schedules to know what times slots are unavailable
    return (  
        <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormControl>
                    <Stack spacing={2}>
                    <Typography align='center'>Edit Consultation</Typography>
                        <TextField
                            required
                            label="Enter title" 
                            variant="outlined"
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                        />
                        <DateTimePicker
                            required
                            label="Start Date"
                            onChange={handleStarDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat="MM/dd/yyyy hh:mm a"
                            value={startDate}
                            disabled
                        />
                        <DateTimePicker
                            required
                            label="End Date"
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat="MM/dd/yyyy hh:mm a"
                            value={endDate}
                            disabled
                        />
                        <TextField
                            required
                            label="Enter location or link" 
                            variant="outlined"
                            type="text"
                            onChange={(e) => setMeetLink(e.target.value)}
                            value={meetLink}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Update
                        </Button>
                        
                        { error && <Alert severity="error">{error}</Alert> }
                        { success && <Alert severity="success">{success}</Alert> }

                    </Stack>
                </FormControl>
            </LocalizationProvider>
        </Box>
    );
}
 
export default EditConsultation;