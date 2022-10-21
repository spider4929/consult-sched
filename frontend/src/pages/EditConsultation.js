import { useEffect, useState } from 'react'
import { formatISO } from 'date-fns';
import { utcToZonedTime } from "date-fns-tz";

//mui
import { Box } from '@mui/system';
import { FormControl, TextField, Button, Stack, Alert} from '@mui/material';
import { useTheme } from "@mui/material/styles";
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

    const theme = useTheme()
    const navigate = useNavigate()

    const [assignedTeach, setAssignedTeach] = useState('')

    // error checking
    const [error, setError] = useState(null)

    // form useStates
    const [text, setText] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [meetLink, setMeetLink] = useState('')

    useEffect(() => {
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
    // TODO: change the function to remove the seconds and replace it with 00
    const formatToUTC = (time) => formatISO(utcToZonedTime(time, "UTC")).replace("+08:00", ".000Z")

    // pass form to database

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)

        const consultation = {
            text, 
            start_date: formatToUTC(startDate), 
            end_date: formatToUTC(endDate), 
            meet_link: meetLink
        }

        const response = await fetch(`/api/appointments/${assignedTeach}`, {
            method: 'POST',
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
            console.log(json.error)
        }

        if (response.ok) {
            // dispatch({type: 'CREATE_CONSULTATION', payload: json})
            navigate('/view-consultations')
        }
    };

    //TODO: add a way for student's to see all of an instructor's schedules to know what times slots are unavailable
    return (  
        <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormControl>
                    <Stack spacing={2}>
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
                        />
                        <DateTimePicker
                            required
                            label="End Date"
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat="MM/dd/yyyy hh:mm a"
                            value={endDate}
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
                        
                        { error && <Alert severity="error">{error}</Alert>}
                        
                    </Stack>
                </FormControl>
            </LocalizationProvider>
        </Box>
    );
}
 
export default EditConsultation;