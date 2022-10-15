import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { Box } from '@mui/system';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Stack } from '@mui/material';
import { format } from 'date-fns'
import { useTheme } from "@mui/material/styles";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';


const CreateConsulStudent = () => {
    let date = new Date()
    const theme = useTheme()
    const [teachProfiles, setTeachProfiles] = useState('')
    const [assignedTeach, setAssignedTeach] = useState('')
    const [displayAllForms, setDisplayAllForms] = useState('')

    // form useStates
    const [text, setText] = useState('')
    const [startDate, setStartDate] = useState(date.getDate())
    const [endDate, setEndDate] = useState(date.getDate())
    const [meetLink, setMeetLink] = useState('')

    const { user } = useAuthContext()

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

    // handle submit functions
    const handleSubmit = async (e) => {
        e.preventDefault()

        setStartDate(format(startDate, 'YYYY-MM-ddThh:mm.000Z'))
        setEndDate(format(endDate, 'YYYY-MM-DDThh:mm.000Z'))

        const consultation = {text, startDate, endDate, meetLink}

        console.log(consultation)

        // const response = await fetch(`/api/appointments/${assignedTeach}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-auth-token': `${user.token}`
        //     }
        // })

        // const json = await response.json()

        // if (response.ok) {
        //     dispatchEvent({type: 'CREATE_CONSULTATION', payload: json})
        // }
    };

    return (  
        <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl>
                    <Stack spacing={2}>
                        <InputLabel sx={{margin: `${theme.spacing(2)}`}}>Select Instructor</InputLabel>
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
                            inputFormat='YYYY-MM-DDThh:mm.000Z'
                        />
                        <DateTimePicker
                            required
                            label="End Date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat='YYYY-MM-DDThh:mm.000Z'
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
                    </Stack>
                </FormControl>
            </LocalizationProvider>
        </Box>
    );
}
 
export default CreateConsulStudent;

// workflow
// - get list of teachers where the value is their id
// - output it on a <Select />
// - display forms taking "text", "start_date", "end_date", and "meet_link" 
// - then submit