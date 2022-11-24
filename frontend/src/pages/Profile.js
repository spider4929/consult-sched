import { Box, Container, Grid, Typography } from '@mui/material';
import { UserProfile } from '../components/UserProfile';
import { UserProfileDetails } from '../components/UserProfileDetails';

import { useTheme } from "@mui/material/styles";

const Profile = () => {
    const theme = useTheme()

    return (
        <Box sx={{ flexGrow: 1, p: `${theme.spacing(5)}`}}>
            <Typography
                    sx={{ mb: 3}}
                    variant="h4"
                >
                    User Profile 
            </Typography>
            <Box
                components="main"
                sx={{
                    display: 'flex'
                }}
            >
                
                <UserProfile sx={{width: '50%'}} />
                <UserProfileDetails />
            </Box>
        </Box>
        
    )
};

export default Profile;