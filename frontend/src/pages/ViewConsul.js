import format from 'date-fns/format'

// mui imports
import { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
  IconButton, Tooltip, Box, Modal, Typography, ButtonGroup } from "@mui/material";
import { DataGrid, gridColumnsTotalWidthSelector } from '@mui/x-data-grid';

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
    const [consultations, setConsultations] = useState(null)
    const [consultationsFuture, setConsultationsFuture] = useState([])
    const [consultationsPast, setConsultationsPast] = useState([])
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
            
            const oldJson = await response.json()

            const json = oldJson.sort((a, b) => {
                let da = new Date(a.start_date),
                    db = new Date(b.start_date);
                return da - db;
            })

            if (response.ok) {
                setConsultations(json)
                setConsultationsFuture(json.filter(i => i.finished === false))
                setConsultationsPast(json.filter(i => i.finished === true))
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
    
    // column and row for futureConsultations

    const columnsFuture = [
        {   field: 'id',
            headerName: 'ID',
            width: 150

        },
        {
            field: 'title',
            headerName: 'Title',
            width: 350
        },
        {
            field: 'instructor',
            headerName: 'Instructor',
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
            width: 300
        },
        {
            field: 'approvedStatus',
            headerName: 'Approved?',
            renderCell: (params) => {
                switch(params.value.accepted) {
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
                        {user.role === 1 && consultation.accepted === 2 ? buttonCases('EnableEdit', consultation) : buttonCases('DisableEdit')}
                        {user.role === 1 && consultation.accepted === 1 ? buttonCases('DisableDelete') : buttonCases('EnableDelete', consultation)}
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
            approvedStatus: consultations,
            actions: consultations
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
            width: 350
        },
        {
            field: 'instructor',
            headerName: 'Instructor',
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
            width: 300
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
        <Stack spacing={1}>
            <Typography variant='h6'>Current Consultations</Typography>
            <div style={{  display: 'flex', height: '100%', flexGrow: 1, height: 371}}>
                <DataGrid
                    rows={rowsFuture}
                    columns={columnsFuture}
                    pageSize={5}
                    columnVisibilityModel={{
                        id: false,
                    }}
                />
            </div>
            <Typography variant='h6'>Past Consultations</Typography>
            <div style={{  display: 'flex', height: '100%', flexGrow: 1, height: 371}}>
                <DataGrid
                    rows={rowsPast}
                    columns={columnsPast}
                    pageSize={5}
                    columnVisibilityModel={{
                        id: false,
                    }}
                />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <EditConsultation />
                </Box>
            </Modal>
        </Stack>
    );

}
 
export default ViewConsul;