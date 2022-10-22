import { Box, Container, Grid, Typography } from '@mui/material';
import { UserProfile } from '../components/UserProfile';
import { UserProfileDetails } from '../components/UserProfileDetails';

const Profile = () => (
    <>
        <Box
            components="main"
            sx={{
                flexGrow: 1,
                py: 8
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    sx={{ mb: 3}}
                    variant="h4"
                >
                    User Profile 
                </Typography>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        lg={12}
                        md={12}
                        xs={12}
                    >
                        <UserProfile />
                    </Grid>
                    <Grid
                        item
                        lg={12}
                        md={12}
                        xs={12}
                    >
                        <UserProfileDetails />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </>
);

export default Profile;