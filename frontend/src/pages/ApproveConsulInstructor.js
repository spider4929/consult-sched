import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
  IconButton, Tooltip} from "@mui/material";

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const CreateConsulProf = () => {
  const [consultations, setConsultations] = useState(null)
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchConsultations = async () => {
      const response = await fetch(`/api/appointments/teacher`, {
        headers: {
            'x-auth-token': `${user.token}`
        }
        })
        
        const json = await response.json()
  
        if (response.ok) {
          const filteredJson = json.filter(item => item.accepted == '2')
          setConsultations(filteredJson)
        }
      }
      
      if (user) {
        fetchConsultations()
      }
  }, [user])

    
    
  return ( 
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
          <TableCell>{format(new Date(consultation.start_date), 'PPpp')}{}</TableCell>
          <TableCell>{format(new Date(consultation.end_date), 'PPpp')}</TableCell>
          <TableCell>{consultation.meet_link}</TableCell>
          <TableCell align='center'>
            <Tooltip title="Approve"><IconButton><CheckIcon color="primary"/></IconButton></Tooltip>
            <Tooltip title="Reject"><IconButton><ClearIcon color="error"/></IconButton></Tooltip>
          </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
    );
}
 
export default CreateConsulProf;