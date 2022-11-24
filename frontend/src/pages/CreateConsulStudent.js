import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { Box } from '@mui/system';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Stack, 
    Alert, Typography, Paper, Grid} from '@mui/material';
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
            const response = await fetch('https://consult-sched-production.up.railway.app/api/profile/teachers', {
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

        const response = await fetch(`https://consult-sched-production.up.railway.app/api/appointments/${e.target.value}`, {
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
            const temp2Json = json.filter(i => i.finished === false)
            setTeacherConsul(temp2Json.filter(i => i.accepted === 1))
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

        const response = await fetch(`https://consult-sched-production.up.railway.app/api/appointments/${assignedTeach}`, {
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
            navigate('/view-consultations')
        }
    };

    return (  
        <Box sx={{ 
            display: 'flex', 
            p: `${theme.spacing(5)}` 
        }}>
            <Grid container sx={{ flex: '1 1 auto'}}>
                    <Grid item
                        lg={6}
                        xs={12}
                        component={Paper}
                        sx={{
                            padding: `${theme.spacing(2)}`,
                            mr: 4,
                            mb: 2
                        }}
                        >
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
            </Grid>
            <Grid item
                        lg={5.51}
                        xs={12}
                        component={Paper}
                        sx={{
                            mr: 4,
                            mb: 2
                        }}
                        >
                <Typography sx={{p:2}}> The following dates are not available: </Typography>
                    { teacherConsul && teacherConsul.map((consultation) => (
                        <Box>
                            <Paper sx={{ 
                                marginRight: `${theme.spacing(2)}`,
                                marginLeft: `${theme.spacing(2)}`,
                                marginTop: `${theme.spacing(1)}`,
                                marginBottom: `${theme.spacing(1)}`,
                                padding: `${theme.spacing(1)}`, 
                                boxShadow: 1 
                            }}>
                                <Typography key={consultation._id}>
                                    {formatInTimeZone(consultation.start_date, 'Asia/Manila', 'hh:mm a')} - {formatInTimeZone(consultation.end_date, 'Asia/Manila', 'hh:mm a')}, {formatInTimeZone(consultation.start_date, 'Asia/Manila', 'MMMM dd, yyyy')}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
            </Grid>
            </Grid>
        </Box>
    );
}
 
export default CreateConsulStudent;