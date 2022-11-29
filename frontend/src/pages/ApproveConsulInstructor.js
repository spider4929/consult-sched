import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
    IconButton, Tooltip, Alert, Paper, Snackbar} from "@mui/material";

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const CreateConsulProf = () => {
    const { user } = useAuthContext()
    const [consultations, setConsultations] = useState(null)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [open, setOpen] = useState(false)

    // get all consultations that are not approved
    useEffect(() => {
        const fetchConsultations = async () => {
            const response = await fetch(`https://backend-consult-sched-production.up.railway.app/api/appointments/teacher`, {
                headers: {
                    'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                const filteredJson = json.filter(item => item.accepted === 2).filter(i => i.finished === false)
                setConsultations(filteredJson)
            }
        }

        if (user) {
        fetchConsultations()
        }
    }, [user])

    const handleApproval = async (consulId) => {
        const response = await fetch(`https://backend-consult-sched-production.up.railway.app/api/appointments/approve/${consulId}`, {
            method: 'PUT',
            headers: {
                'x-auth-token': `${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            if (json.error) {
                setError(json.error)
            }
            else {
                setError("An unknown error has occured.")
            }
            setOpen(true)
        }
        else {
            setConsultations(consultations.filter(item => item._id != consulId))
            setMessage('Consultation successfully approved.')
            setOpen(true)
        }
        
    }

    // rejection function
    const handleReject = async (consulId) => {
        const response = await fetch(`https://backend-consult-sched-production.up.railway.app/api/appointments/reject/${consulId}`, {
            method: 'PUT',
            headers: {
                'x-auth-token': `${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            if (json.error) {
                setError(json.error)
            }
            else {
                setError("An unknown error has occured.")
            }
            setOpen(true)
        }
        else {
            setConsultations(consultations.filter(item => item._id != consulId))
            setMessage('Consultation successfully rejected.')
            setOpen(true)
        }
    }

    // snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    return ( 
        <Paper sx={{ 
            height: '84%', 
            padding: 1,
            margin: 5
        }}>
            <TableContainer>
                <Table sx={{ 
                    minWidth: 650 
                }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Student/s</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Meet Link/Location</TableCell>
                            <TableCell align='center'>Approve/Reject</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {consultations && consultations.map((consultation) => (
                        <TableRow key={consultation._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{maxWidth: 400}}>{consultation.text}</TableCell>
                            <TableCell>{consultation.student_name}</TableCell>
                            <TableCell>{format(new Date(consultation.start_date), 'LLL dd, yyyy, hh:mm aa')}{}</TableCell>
                            <TableCell>{format(new Date(consultation.end_date), 'LLL dd, yyyy, hh:mm aa')}</TableCell>
                            <TableCell>{consultation.meet_link}</TableCell>
                            <TableCell align='center'>
                                <Tooltip title="Approve"><IconButton onClick={() => handleApproval(consultation._id)}><CheckIcon color="primary"/></IconButton></Tooltip>
                                <Tooltip title="Reject"><IconButton onClick={() => handleReject(consultation._id)}><ClearIcon color="error"/></IconButton></Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        { error &&
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert 
                    onClose={handleClose} 
                    severity="error" 
                    sx={{width: '100%'}}>
                    {error}
                </Alert>
            </Snackbar>
        }
        { message &&
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert 
                    onClose={handleClose} 
                    severity="success" 
                    sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        }
        </Paper>
    );
}
 
export default CreateConsulProf;