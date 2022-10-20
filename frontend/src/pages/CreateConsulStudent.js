import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { Box } from '@mui/system';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Stack, Alert} from '@mui/material';
import { formatISO } from 'date-fns';
import { utcToZonedTime } from "date-fns-tz";
import { useTheme } from "@mui/material/styles";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useNavigate } from "react-router-dom";

const CreateConsulStudent = () => {
    // context calls
    const { user } = useAuthContext()

    const theme = useTheme()
    const navigate = useNavigate()

    const [teachProfiles, setTeachProfiles] = useState('')
    const [assignedTeach, setAssignedTeach] = useState('')
    //const [displayAllForms, setDisplayAllForms] = useState('')

    // error checking
    const [error, setError] = useState(null)

    // form useStates
    const [text, setText] = useState('')
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [meetLink, setMeetLink] = useState('')

    // fetch list of Instructors on database
    useEffect(() => {
        const fetchTeachProfiles = async () => {
            const response = await fetch('/api/profile/teachers', {
                headers: {
                    'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                setTeachProfiles(json)
            }
        }
        
        if (user) { 
            fetchTeachProfiles()
        }
    }, [user])

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

        const consultation = {text, start_date: formatToUTC(startDate), end_date: formatToUTC(endDate), meet_link: meetLink}

        const response = await fetch(`/api/appointments/${assignedTeach}`, {
            method: 'POST',
            body: JSON.stringify(consultation),
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${user.token}`
            }
        })

        const json = await response.json()

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
                        <InputLabel sx={{marginTop: `${theme.spacing(2)}`}}>Select Instructor</InputLabel>
                        <Select
                            value={assignedTeach}
                            label="Select Instructor"
                            onChange={(e) => setAssignedTeach(e.target.value)}
                        >
                            { teachProfiles && teachProfiles.map((teachProfile) => (
                                <MenuItem 
                                    key={teachProfile._id}
                                    value={teachProfile.user._id}
                                    >

                                    {teachProfile.user.first_name} {teachProfile.user.last_name}

                                </MenuItem>
                            ))}
                        </Select>
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
                            value={startDate}
                            onChange={handleStarDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat="MM/dd/yyyy hh:mm a"
                        />
                        <DateTimePicker
                            required
                            label="End Date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat="MM/dd/yyyy hh:mm a"
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
                            Submit
                        </Button>
                        
                        { error && <Alert severity="error">{error}</Alert>}
                        
                    </Stack>
                </FormControl>
            </LocalizationProvider>
        </Box>
    );
}
 
export default CreateConsulStudent;