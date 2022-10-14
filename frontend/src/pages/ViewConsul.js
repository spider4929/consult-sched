import { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
  IconButton, Tooltip} from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import format from 'date-fns/format'

const ViewConsul = () => {
  // add state for not approved consultations
  const [consultations, setConsultations] = useState(null)
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchConsultations = async () => {
      const response = await fetch('/api/appointments/student', {
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
            <TableCell align='center'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consultations && consultations.map((consultation) => (
            <TableRow key={consultation._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              
              <TableCell sx={{maxWidth: 400}}>{consultation.text}</TableCell>
              <TableCell>{consultation.teacher_name}</TableCell>
              <TableCell>{format(new Date(consultation.start_date), 'PPpp')}{}</TableCell>
              <TableCell>{format(new Date(consultation.end_date), 'PPpp')}</TableCell>
              <TableCell>{consultation.meet_link}</TableCell>
              <TableCell align='center'>
                <Tooltip title="Delete"><IconButton><DeleteOutlineOutlinedIcon color="primary"/></IconButton></Tooltip>
                <Tooltip title="Edit"><IconButton><EditOutlinedIcon color="primary"/></IconButton></Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
 
export default ViewConsul;