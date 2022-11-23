import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { CircularProgress } from '@mui/material';


export const UserProfile = (props) => {
    const [ profile, setProfile] = useState(null)
    const { user } = useAuthContext()

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
        }
        }
        
        if (user) {
        fetchProfile()
        }
    }, [user])

    
    return (
    <Card {...props}>
        {profile ?
        <CardContent>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Avatar
                    src={profile.user.avatar}
                    sx={{
                        height: 128,
                        mb: 2,
                        width: 128
                    }}
                    />
                <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h6"
                    >
                        {profile.user.last_name}, {profile.user.first_name}
                    </Typography>
                <Typography
                    color="textSecondary"
                    gutterBottom
                    >
                        {(user.role === 1) ? "Student" : "Instructor"}
                    </Typography>
            </Box>
        </CardContent> : <CircularProgress />}
    </Card>
    )
}