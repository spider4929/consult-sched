import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
    IconButton, Tooltip, Alert, Paper} from "@mui/material";

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const CreateConsulProf = () => {
    const { user } = useAuthContext()
    const [consultations, setConsultations] = useState(null)
    const [error, setError] = useState(null)

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
            setError(json.error)
        }
        else {
            setConsultations(consultations.filter(item => item._id != consulId))
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

        setConsultations(consultations.filter(item => item._id != consulId))

    }
    
    return ( 
        <Paper sx={{ 
            height: '90vh', 
            padding: 1 
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
        { error && <Alert severity="error">{error}</Alert> }
        </Paper>
    );
}
 
export default CreateConsulProf;