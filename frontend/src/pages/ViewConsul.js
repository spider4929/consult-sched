import format from 'date-fns/format'

// mui imports
import { useEffect, useState } from 'react'
import { IconButton, Tooltip, Box, Modal, Typography, 
    ButtonGroup, 
    Paper} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from "@mui/material/styles";

// icon imports
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// hook imports
import { useAuthContext } from "../hooks/useAuthContext";
import { useConsultationContext } from '../hooks/useConsultationsContext';

//import components
import EditConsultation from './EditConsultation';
import { Stack } from '@mui/system';

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
    const [consultationsFuture, setConsultationsFuture] = useState([])
    const [consultationsPast, setConsultationsPast] = useState([])
    const [open, setOpen] = useState(false)
    const { user } = useAuthContext()
    const { dispatch } = useConsultationContext()
    const theme = useTheme()

    // fetch consultations of logged in student or instructor
    useEffect(() => {
        const fetchConsultations = async () => {
            let userRole = (user.role === 1) ? 'student': 'teacher'

            const response = await fetch(`https://backend-consult-sched-production.up.railway.app/api/appointments/${userRole}`, {
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

            if (response.ok) {
                // setConsultations(tempJson)
                setConsultationsFuture(json.filter(i => i.finished === false))
                setConsultationsPast(json.filter(i => i.finished === true))
            }
        }
        
        if (user) {
        fetchConsultations()
        }
    }, [user])
  
    // functions

    // Modal component handlers
    const handleOpen = (consultation) => {
        dispatch({ type: 'STORE_A_CONSULTATION', payload: consultation })
        setOpen(true)
    };
  
    const handleClose = () => setOpen(false);

    // CRUD handles
    const handleCancel = async (item) => {
        const response = await fetch(`https://backend-consult-sched-production.up.railway.app/api/appointments/cancel/${item._id}`, {
            method: 'PUT',
            headers: {
                'x-auth-token': `${user.token}`
            }
        })
        
        const updatedConsultations = consultationsFuture.map((consultation) => {
            if (consultation._id === item._id) {
                consultation.accepted = 0
                return consultation
            }
            return consultation
        })
        
        setConsultationsFuture(updatedConsultations)

    }

    const handleDelete = async (consulId) => {
        const response = await fetch(`https://backend-consult-sched-production.up.railway.app/api/appointments/delete/${consulId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': `${user.token}`
            }
        })

        setConsultationsFuture(consultationsFuture.filter(item => item._id !== consulId))

    }

    // case functions
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
            case 'EnableCancel':
                return (
                    <Tooltip title="Cancel"><IconButton onClick={() => handleCancel(consultation)}><CancelOutlinedIcon color="error"/></IconButton></Tooltip>
                )
            default:
                return (
                    <Box></Box>
                )

        }
    }
    
    // column and row for future consultations

    const columnsFuture = [
        {   field: 'id',
            headerName: 'ID',
            width: 150

        },
        {
            field: 'title',
            headerName: 'Title',
            width: 300
        },
        {
            field: 'instructor',
            headerName: user && user.role === 1 ? 'Instructor' : 'Student',
            width: 250
        },
        {
            field: 'startDate',
            headerName: 'Start',
            width: 250
        },
        {
            field: 'endDate',
            headerName: 'End',
            width: 250
        },
        {
            field: 'meetLink',
            headerName: 'Link/Location',
            width: 275
        },
        {
            field: 'approvedStatus',
            headerName: 'Approved?',
            renderCell: (params) => {
                switch(params.value) {
                    case 0:
                        return <Tooltip title="Rejected"><CloseIcon color='error'/></Tooltip>;
                    case 1:
                        return <Tooltip title="Accepted"><CheckIcon color='primary'/></Tooltip>;
                    default:
                        return <Tooltip title="Pending"><PendingOutlinedIcon color='warning'/></Tooltip>;
                }
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            renderCell: (params) => {
                const consultation = params.value

                return (
                    <ButtonGroup>
                        {user.role === 1 && consultation.accepted === 2 ? buttonCases('EnableEdit', consultation) : null }
                        {user.role === 1 && consultation.accepted !== 2 ? buttonCases('DisableEdit') : null }
                        {user.role === 1 && consultation.accepted === 2 ? buttonCases('EnableDelete', consultation) : null }
                        {user.role === 1 && consultation.accepted !== 2 ? buttonCases('DisableDelete') : null }
                        {user.role === 2 && consultation.accepted === 1 ? buttonCases('EnableCancel', consultation): null }
                    </ButtonGroup>
                )
            }
        }
    ]

    const rowsFuture = []

    consultationsFuture && consultationsFuture.map((consultation) => {
        rowsFuture.push({
            id: consultation._id,
            title: consultation.text,
            instructor: user.role === 1 ? consultation.teacher_name : consultation.student_name,
            startDate: format(new Date(consultation.start_date), 'LLL dd, yyyy, hh:mm aa'),
            endDate: format(new Date(consultation.end_date), 'LLL dd, yyyy, hh:mm aa'),
            meetLink: consultation.meet_link,
            approvedStatus: consultation.accepted,
            actions: consultation
        })
    }
    )

    // column and row for past consultations

    const columnsPast = [
        {   
            field: 'id',
            headerName: 'ID',
            width: 150

        },
        {
            field: 'title',
            headerName: 'Title',
            width: 300
        },
        {
            field: 'instructor',
            headerName: user && user.role === 1 ? 'Instructor' : 'Student',
            width: 250
        },
        {
            field: 'startDate',
            headerName: 'Start',
            width: 250
        },
        {
            field: 'endDate',
            headerName: 'End',
            width: 250
        },
        {
            field: 'meetLink',
            headerName: 'Link/Location',
            width: 275
        }
    ]

    const rowsPast = []

    consultationsPast && consultationsPast.map((consultation) => {
        rowsPast.push({
            id: consultation._id,
            title: consultation.text,
            instructor: user.role === 1 ? consultation.teacher_name : consultation.student_name,
            startDate: format(new Date(consultation.start_date), 'LLL dd, yyyy, hh:mm aa'),
            endDate: format(new Date(consultation.end_date), 'LLL dd, yyyy, hh:mm aa'),
            meetLink: consultation.meet_link
        })
    }
    )

    return (
        <Stack spacing={2} sx={{ 
            p: `${theme.spacing(5)}` 
        }}>
            <Typography variant='h6'>Current Consultations</Typography>
            <Paper style={{ 
                display: 'flex', 
                height: '100%', 
                flexGrow: 1, 
                height: 370
            }}>
                <DataGrid
                    rows={rowsFuture}
                    columns={columnsFuture}
                    pageSize={5}
                    columnVisibilityModel={{
                        id: false,
                    }}
                />
            </Paper>
            <Typography variant='h6'>Past Consultations</Typography>
            <Paper style={{ 
                display: 'flex', 
                height: '100%', 
                flexGrow: 1, 
                height: 370
            }}>
                <DataGrid
                    rows={rowsPast}
                    columns={columnsPast}
                    pageSize={5}
                    columnVisibilityModel={{
                        id: false,
                    }}
                />
            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Paper sx={style}>
                    <EditConsultation />
                </Paper>
            </Modal>
        </Stack>
    );

}
 
export default ViewConsul;