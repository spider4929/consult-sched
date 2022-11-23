import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { Box } from '@mui/system';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Stack, 
    Alert, Typography, Paper} from '@mui/material';
import { formatISO } from 'date-fns';
import { utcToZonedTime, formatInTimeZone } from "date-fns-tz";
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
    const [teacherConsul, setTeacherConsul] = useState(null)

    // error checking
    const [error, setError] = useState(null)

    // form useState
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
    const formatToUTC = (time) => formatISO(utcToZonedTime(time, "UTC")).replace("+08:00", ".000Z")
    const formatToManilaTime = (time) => formatInTimeZone(time, 'Asia/Manila', 'MMM dd, yyyy hh:mm a')

    /* retrieves the list of consultations of a teacher */
    const handleAssignedTeach = async (e) => {
        e.preventDefault()

        setAssignedTeach(e.target.value)

        const response = await fetch(`/api/appointments/${e.target.value}`, {
            method: 'GET',
            headers: {
                'x-auth-token': `${user.token}`
              }
        })

        const tempJson = await response.json()

        const json = tempJson.sort((a, b) => {
            let da = new Date(a.start_date),
                db = new Date(b.start_date);
            return da - db;
        })
        
        if (!response.ok) {
            setError(json)
        }
        
        if (response.ok) {
            setTeacherConsul(json)
        }

    }

    /* pass form to database */
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

        //TODO: set error checking to receive multiple errors
        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            // dispatch({type: 'CREATE_CONSULTATION', payload: json})
            navigate('/view-consultations')
        }
    };

    //TODO: add a way for student's to see all of an instructor's schedules to know what times slots are unavailable
    return (  
        <Box sx={{ display: 'flex', p: `${theme.spacing(5)}` }}>
            <Paper sx={{ width: '40%', alignContent: 'center', justifyContent: 'center', padding: `${theme.spacing(5)}`, mr: `${theme.spacing(4)}` }}>
                <Typography sx={{ mb: 1 }}variant='h5'>Create Consultation</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl
                            fullWidth
                        >
                            <Stack spacing={2}>
                                <InputLabel sx={{marginTop: `${theme.spacing(2)}`}}>Select Instructor</InputLabel>
                                <Select
                                    value={assignedTeach}
                                    label="Select Instructor"
                                    onChange={handleAssignedTeach}
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
            </Paper>
            <Paper sx={{ width: '60%', padding: `${theme.spacing(5)}` }}>
                <Typography>The following dates are not available: </Typography>
                { teacherConsul && teacherConsul.map((consultation) => (
                    <Box>
                        <Paper sx={{ marginTop: `${theme.spacing(2)}`, padding: `${theme.spacing(1)}`, boxShadow: 3 }}>
                            <Typography key={consultation._id}>{formatInTimeZone(consultation.start_date, 'Asia/Manila', 'hh:mm a')} - {formatInTimeZone(consultation.end_date, 'Asia/Manila', 'hh:mm a')}, {formatInTimeZone(consultation.start_date, 'Asia/Manila', 'MMM dd, yyyy')}</Typography>
                        </Paper>
                    </Box>
                ))}
            </Paper>

        </Box>
    );
}
 
export default CreateConsulStudent;