import format from 'date-fns/format'

// mui imports
import { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
  IconButton, Tooltip, Box, Modal, Typography } from "@mui/material";

// icon imports
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';

// hook imports
import { useAuthContext } from "../hooks/useAuthContext";
import { useConsultationContext } from '../hooks/useConsultationsContext';

//import components
import EditConsultation from './EditConsultation';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    p: 4,
};

const ViewConsul = () => {
    const [consultations, setConsultations] = useState(null)
    const [open, setOpen] = useState(false);
    const [itemEdited, setItemEdited] = useState(null);
    const { user } = useAuthContext()
    const { dispatch } = useConsultationContext()

    // fetch consultations of logged in student or instructor
    useEffect(() => {
        const fetchConsultations = async () => {
        let userRole = (user.role === 1) ? 'student': 'teacher'

        const response = await fetch(`/api/appointments/${userRole}`, {
            headers: {
            'x-auth-token': `${user.token}`
            }
        })
        
        const json = await response.json()

        if (response.ok) {
            setConsultations(json)
        }
        }
        
        if (user) {
        fetchConsultations()
        }
    }, [user])
  
    // functions

    const handleDelete = async (consulId) => {
        const response = await fetch(`/api/appointments/cancel/${consulId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': `${user.token}`
            }
        })

        setConsultations(consultations.filter(item => item._id != consulId))

    }

    const handleOpen = (consultation) => {
        dispatch({ type: 'STORE_A_CONSULTATION', payload: consultation })
        setOpen(true)
    };
  
    const handleClose = () => setOpen(false);

    const statusCheck = (value) => {
        switch(value) {
        case 0:
            return <Tooltip title="Rejected"><CloseIcon color='error'/></Tooltip>;
        case 1:
            return <Tooltip title="Accepted"><CheckIcon color='primary'/></Tooltip>;
        default:
            return <Tooltip title="Pending"><PendingOutlinedIcon color='warning'/></Tooltip>;
        }
    }

    const buttonCases = (caseEvent, consultation) => {
        switch(caseEvent) {
            case 'EnableEdit':
                return (
                    <Tooltip title="Edit"><IconButton onClick={() => handleOpen(consultation)}><EditOutlinedIcon color="primary"/></IconButton></Tooltip>
                )
            case 'EnableDelete':
                return (
                    <Tooltip title="Delete"><IconButton onClick={() => handleDelete(consultation._id)}><DeleteOutlineOutlinedIcon color="primary"/></IconButton></Tooltip>
                )
            case 'DisableEdit':
                return (
                    <IconButton disabled><EditOutlinedIcon color="disabled"/></IconButton>
                )
            case 'DisableDelete':
                return (
                    <IconButton disabled><DeleteOutlineOutlinedIcon color="disabled"/></IconButton>
                )
            default:
                return (
                    <Box></Box>
                )

        }
    }
  // return is different if you are a student or a teacher

  return (
    <div>
        <TableContainer>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        { user.role === 1 ? <TableCell>Instructor</TableCell> : <TableCell>Student/s</TableCell>}
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell>Meet Link/Location</TableCell>
                        <TableCell align='center'>Approved?</TableCell>
                        <TableCell align='center'>Actions</TableCell>
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
                            <TableCell align='center'>{ statusCheck(consultation.accepted) }</TableCell>
                            <TableCell align='center'>
                                { user.role === 1 && consultation.accepted === 2 ? buttonCases('EnableEdit', consultation) : buttonCases('DisableEdit') }
                                { user.role === 1 && consultation.accepted === 1 ? buttonCases('DisableDelete') : buttonCases('EnableDelete', consultation) }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        {/* TODO: pop-up if edit or delete is successful */}
        </TableContainer>
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography align='center'>Edit Consultation</Typography>
                <EditConsultation />
            </Box>
        </Modal>
    </div>
    
  );

}
 
export default ViewConsul;