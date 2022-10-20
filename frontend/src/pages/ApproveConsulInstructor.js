import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
    IconButton, Tooltip, Box, Alert} from "@mui/material";
import { useNavigate } from "react-router-dom";

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const CreateConsulProf = () => {
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const [consultations, setConsultations] = useState(null)
    const [accept, setAccept] = useState(false)
    const [reject, setReject] = useState(false)
    const [error, setError] = useState(null)

    // get all consultations that are not approved
    useEffect(() => {
        const fetchConsultations = async () => {
            const response = await fetch(`/api/appointments/teacher`, {
                headers: {
                    'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                const filteredJson = json.filter(item => item.accepted === 2)
                setConsultations(filteredJson)
            }
        }

        if (user) {
        fetchConsultations()
        }
    }, [user])

    //TODO: add alerts for when a consultation is successfully accepted or not
    // approval function
    const handleApproval = async (consulId) => {
        const response = await fetch(`/api/appointments/approve/${consulId}`, {
            method: 'PUT',
            headers: {
                'x-auth-token': `${user.token}`
            }
        })

        setConsultations(consultations.filter(item => item._id != consulId))
        
    }

    // rejection function
    const handleReject = async (consulId) => {
        const response = await fetch(`/api/appointments/reject/${consulId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': `${user.token}`
            }
        })

        setConsultations(consultations.filter(item => item._id != consulId))

    }
    
    return ( 
        <Box>
            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            { user.role === 1 ? <TableCell>Instructor</TableCell> : <TableCell>Student/s</TableCell>}
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
                            { user.role === 1 ? <TableCell>{consultation.teacher_name}</TableCell> : <TableCell>{consultation.student_name}</TableCell> }
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
        {/* TODO: pop-up if accept or reject is successful */}
        </Box>
    );
}
 
export default CreateConsulProf;