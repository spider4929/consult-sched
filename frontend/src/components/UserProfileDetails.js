import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    InputAdornment,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { CircularProgress } from '@mui/material';
import React from 'react'
import { MuiChipsInput } from 'mui-chips-input'

export const UserProfileDetails = (props) => {
    const [ profile, setProfile ] = useState(null)
    const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const navigate = useNavigate()
    const [ courses, setCourses ] = useState('')
    const [ facebookLink, setfacebookLink] = useState('https://www.facebook.com/')
    const [ linkedinLink, setlinkedinLink] = useState('https://www.linkedin.com/in/')
    
    useEffect(() => {
        const fetchProfile = async () => {

        const response = await fetch(`/api/profile/me`, {
            headers: {
            'x-auth-token': `${user.token}`
            }
        })
        
        const json = await response.json()

        if (response.ok) {
            setProfile(json)
            setCourses(json.courses)
            setfacebookLink(json.social.facebook)
            setlinkedinLink(json.social.linkedin)
            console.log(json)
        }
        }
        
        if (user) {
        fetchProfile()
        }
        
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)
        setSuccess(null)

        const newProfile = {
            courses: courses,
            facebook: facebookLink,
            linkedin: linkedinLink
        }
        const response = await fetch(`/api/profile`, {
            method: 'POST',
            body: JSON.stringify(newProfile),
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            console.log(json.error)
        }

        if (response.ok) {
            setSuccess('Change details sucess!')
            navigate('/profile')
        }

    };

    const handleChange = (newValue) => {
        setCourses(newValue)
    }

    return (
    <form
      autoComplete="off"
      noValidate
      {...props}
      onSubmit={handleSubmit}
    >
        {profile ?
      <Card>
        <CardHeader
          title="Details"
        />
        <Divider />
        <CardContent>
        <Grid
            container
            spacing={3}
            >
                <Grid
                item
                md={6}
                xs={12}
                >   
                    <TextField
                        fullWidth
                        label="First Name"
                        id="outlined-disabled"
                        disabled
                        variant="outlined"

                        defaultValue={profile.user.first_name}
                        />
                </Grid>
                <Grid
                    item
                    md={6}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label="Last Name"
                        id="outlined-disabled"
                        disabled
                        variant="outlined"
                        
                        defaultValue={profile.user.last_name}
                        />
                </Grid>
                <Grid
                    item
                    md={12}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label="Account Email"
                        id="outlined-disabled"
                        disabled
                        variant="outlined"
                        
                        defaultValue={profile.user.email}
                        />
                </Grid>
                <Grid
                    item
                    md={12}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><FacebookIcon /></InputAdornment>),
                        }}
                        label="Facebook Link"
                        name="facebookLink"
                        onChange={(e) => setfacebookLink(e.target.value)}
                        required
                        variant="outlined"
                        
                        value={facebookLink}
                        />
                </Grid>
                <Grid
                    item
                    md={12}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><LinkedInIcon /></InputAdornment>),
                        }}
                        label="LinkedIn Link"
                        name="linkedinLink"
                        onChange={(e) => setlinkedinLink(e.target.value)}
                        required
                        variant="outlined"
                        
                        value={linkedinLink}
                        />
                </Grid>
                <Grid
                    item
                    md={12}
                    xs={12}
                >
                    <MuiChipsInput 
                        label="Courses" 
                        fullWidth 
                        value={courses} 
                        onChange={handleChange}
                        required
                        variant="outlined"
                        />
                </Grid>
            </Grid>
        </CardContent>
        <Divider />
        <Box
            sx={{
                display:'flex',
                justifyContent: 'flex-end',
                p: 2
            }}
            >
                <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                >
                    Save
                </Button>

                { error && <Alert severity="error">{error}</Alert>}
                { success && <Alert severity="success">{success}</Alert>}
            </Box>
      </Card> : <CircularProgress />}
    </form>
    );
}