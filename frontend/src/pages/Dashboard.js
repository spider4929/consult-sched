import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import CheckIcon from '@mui/icons-material/Check';
import './Dashboard.css'
import { Tooltip} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import format from 'date-fns/format'
import CloseIcon from '@mui/icons-material/Close';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { useAuthContext } from "../hooks/useAuthContext";
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
    const { user } = useAuthContext()
    const [value, setValue] = useState(new Date());

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
        }
    ]

    const rowsFuture = []

    const selectedDate = new Date(value.toDateString())

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
        <Stack spacing={1}>
            <div style={{ display: 'flex', height: 440 }}>
                <div style={{ width: '30%' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StaticDatePicker
                            // mask='____/__/__'
                            variant='static'
                            orientation='portrait'
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                        />
                </LocalizationProvider>
                </div>
                <div style={{  height: '100%', width: '70%'}}>
                    <DataGrid
                    initialState={{
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
            </div>
        </Stack>
    );

}


export default Dashboard;