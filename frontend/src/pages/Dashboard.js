import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import CheckIcon from '@mui/icons-material/Check';
import './Dashboard.css'
import { IconButton, Tooltip, Box, Modal, Typography, ButtonGroup } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import format from 'date-fns/format'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useAuthContext } from "../hooks/useAuthContext";
import { useConsultationContext } from '../hooks/useConsultationsContext';
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

const Dashboard = () => {
    const [consultationsFuture, setConsultationsFuture] = useState([])
    const [open, setOpen] = useState(false)
    const { user } = useAuthContext()
    const { dispatch } = useConsultationContext()
    const [value, setValue] = useState(new Date());
    const [highlightedDays, setHighlightedDays] = useState([]);//ignore this

    // fetch consultations of logged in student or instructor
    useEffect(() => {
        const fetchConsultations = async () => {
            let userRole = (user.role === 1) ? 'student': 'teacher'

            const response = await fetch(`/api/appointments/${userRole}`, {
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
        const response = await fetch(`/api/appointments/reject/${item._id}`, {
            method: 'DELETE',
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
        const response = await fetch(`/api/appointments/cancel/${consulId}`, {
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
            width: 100,

        },
        {
            field: 'title',
            headerName: 'Title',
            width: 200
        },
        {
            field: 'instructor',
            headerName: user && user.role === 1 ? 'Instructor' : 'Student',
            width: 200
        },
        {
            field: 'startDate',
            headerName: 'Start',
            width: 250,
            
        },
        {
            field: 'endDate',
            headerName: 'End',
            width: 250,
        },
        {
            field: 'meetLink',
            headerName: 'Link/Location',
            width: 150,
        },
        {
            field:'approvedStatus',
            headerName: 'Approved?',
            headerAlign: 'center',
            align:"center",
            width: 200,
            
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
        //{
           //field: 'actions',
            //headerName: 'Actions',
            //renderCell: (params) => {
                //const consultation = params.value

                //return (
                    //<ButtonGroup>
                        //{user.role === 1 && consultation.accepted === 2 ? buttonCases('EnableEdit', consultation) : null }
                        //{user.role === 1 && consultation.accepted !== 2 ? buttonCases('DisableEdit') : null }
                       // {user.role === 1 && consultation.accepted === 2 ? buttonCases('EnableDelete', consultation) : null }
                      //  {user.role === 1 && consultation.accepted !== 2 ? buttonCases('DisableDelete') : null }
                     //   {user.role === 2 && consultation.accepted === 1 ? buttonCases('EnableCancel', consultation): null }
                   // </ButtonGroup>
              //  )
        //    }
    //    }
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
            actions: consultation,
            
        })
    }
    )

    
    return (
        <Stack spacing={1}>

            <div>

            <img src='./images/welcome.jpg' className='cpe' alt=''/>
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className='Header'>Dashboard</div>
                <StaticDatePicker
                    // mask='____/__/__'
                    variant='static'
                    orientation='portrait'
                    value={value}
                    
                    onChange={(newValue) => setValue(newValue)}
                    renderInput={(params) => {
                    <TextField {...params} />;
                    }}
                    renderDay={(day, _value, DayComponentProps) => {
                    const isSelected =
                        !DayComponentProps.outsideCurrentMonth &&
                        highlightedDays.indexOf(day.getDate()) >= 0;

                    return (
                        <Badge
                        key={day.toString()}
                        overlap='circular'
                        badgeContent={isSelected ? <CheckIcon color='red' /> : undefined}
                        >
                        <PickersDay {...DayComponentProps} />
                        </Badge>
                    );
                    }}
                />
            </LocalizationProvider>
            <Typography variant='h6'>Available Consultations</Typography>
            <div style={{  align: "center", display: 'flex', height: '100%', flexGrow: 1, height: 371}}>
                <DataGrid
                initialState={{
                    filter: {
                        filterModel: {
                          items: [{ columnField: 'approvedStatus', operatorValue: 'contains', value: '1' }],
                        },
                      },
                      sorting: {
                        sortModel: [{ field: 'startDate', sort: 'asc' }],
                      },
                  }}
                
                    rows={rowsFuture}
                    columns={columnsFuture}
                    pageSize={10}
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


export default Dashboard;