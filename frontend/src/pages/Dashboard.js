import React, { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import CheckIcon from '@mui/icons-material/Check';
import { Tooltip, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import format from 'date-fns/format'
import CloseIcon from '@mui/icons-material/Close';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { useAuthContext } from "../hooks/useAuthContext";
import { Stack } from '@mui/system';
import { useTheme } from "@mui/material/styles";


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
    const { user, username } = useAuthContext()
    const [value, setValue] = useState(new Date())
    
    const theme = useTheme()

    // fetch consultations of logged in student or instructor
    useEffect(() => {
        const fetchConsultations = async () => {
            let userRole = (user.role === 1) ? 'student': 'teacher'

            const response = await fetch(`/api/appointments/${userRole}`, {
                headers: {
                'x-auth-token': `${user.token}`
                }
            })

            const markFinished = await fetch(`/api/appointments/finished/`, {
                method: 'PUT',
                headers: {
                'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()

            const jsonMarkFinished = await markFinished.json()

            if (response.ok) {
                setConsultationsFuture(json)
                
            }
        }
        
        if (user) {
        fetchConsultations()
        }
    }, [user])
  
    // functions
    
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
            width: 200,
            
        },
        {
            field: 'endDate',
            headerName: 'End',
            width: 200,
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
            width: 100,
            
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
        }
    ]

    const rowsFuture = []

    consultationsFuture && consultationsFuture.map((consultation) => {
        const selectedDate = new Date(value.toDateString())
        const temp = new Date(consultation.start_date)
        const consulDate = new Date(temp.toDateString())

        if (selectedDate.getTime() == consulDate.getTime()) {
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
    })

    return (
        <Stack spacing={1} sx={{ p: `${theme.spacing(5)}` }}>
            <Paper sx={{ 
                p: `${theme.spacing(5)}`, 
                mb: `${theme.spacing(1)}`
            }}>
                <Typography variant="h4" sx={{flexGrow: 1}}>Welcome, {username ? username : 'visitor.'} </Typography>
                <Typography >It is nice to see you again. </Typography>
                <Typography sx={{ marginTop: 5 }}>You have { consultationsFuture.filter(i => i.finished === false).length } scheduled upcoming consultations. </Typography>
            </Paper>
            <div style={{ 
                display: 'flex', 
                height: 440 
            }}>
                <Paper style={{ 
                    width: '30%', 
                    marginRight: `${theme.spacing(2)}`
                }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StaticDatePicker
                            variant='static'
                            orientation='portrait'
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                        />
                    </LocalizationProvider>
                </Paper>
                <Paper style={{ 
                    height: '100%', 
                    width: '70%'
                }}>
                    <DataGrid
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'startDate', sort: 'asc' }],
                        },
                    }}
                    
                        rows={rowsFuture}
                        columns={columnsFuture}
                        pageSize={6}
                        columnVisibilityModel={{
                            id: false,   
                        }}
                        
                    />
                </Paper>
            </div>
        </Stack>
    );

}


export default Dashboard;