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
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { CircularProgress } from '@mui/material';


export const UserProfileDetails = (props) => {
    const [ profile, setProfile ] = useState(null)
    const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const [ courses, setCourses ] = useState('')
    const [ facebookLink, setfacebookLink] = useState('')
    const [ linkedinLink, setlinkedinLink] = useState('')

    const handleCoursesChange = (newValue) => {
        setCourses(newValue);
    }
    const handleFacebookLinkChange = (newValue) => {
        setfacebookLink(newValue);
    }
    const handleLinkedInLinkChange = (newValue) => {
        setlinkedinLink(newValue);
    }

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
            console.log(json)
        }
        }
        
        if (user) {
        fetchProfile()
        }
        
    }, [user])

    const handleSubmit = async (e) => {

        setError(null)

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
            navigate('/profile')
        }

    };

    
    return (
    <form
      autoComplete="off"
      noValidate
      {...props}
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
                                label="Courses"
                                name="courses"
                                onChange={handleCoursesChange}
                                required
                                variant="outlined"
                                
                                defaultValue={profile.courses}
                                />
                        </Grid>
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                inputProps={{
                                    startAdornment: <InputAdornment position="start"><FacebookIcon /></InputAdornment>
                                }}
                                label="Facebook Link"
                                name="facebookLink"
                                onChange={handleFacebookLinkChange}
                                required
                                variant="outlined"
                                
                                defaultValue={profile.social.facebook}
                                />
                        </Grid>
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                inputProps={{
                                    startAdornment: <InputAdornment position="start"><LinkedInIcon /></InputAdornment>
                                }}
                                label="LinkedIn Link"
                                name="linkedinLink"
                                onChange={handleLinkedInLinkChange}
                                required
                                variant="outlined"
                                
                                defaultValue={profile.social.linkedin}
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
                    onClick={handleSubmit}
                >
                    Save
                </Button>

                { error && <Alert severity="error">{error}</Alert>}
            </Box>
      </Card> : <CircularProgress />}
    </form>
    );
}