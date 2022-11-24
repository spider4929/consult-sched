import { Box, Grid, List, Paper } from '@mui/material';
import Chat from '../components/Chats/Chat';
import MyChats from '../components/Chats/MyChats';
import SideDrawer from '../components/Chats/SideDrawer'
import { useAuthContext } from '../hooks/useAuthContext';

import { useTheme } from "@mui/material/styles";

const Inbox = () => {
    const theme = useTheme()
    const { user } = useAuthContext();

    return <>
        <Box sx={{ py: `${theme.spacing(3)}`}}/>
        <Grid container component={Paper}>
            <Grid item xs={3}>
            <List>
            { user && <SideDrawer/> }
            { user && <MyChats/> }
            </List>
            </Grid>
            <Grid item xs={9}>
            { user && <Chat/>}
            </Grid>
        </Grid>
        {/* { user && <Chat2/>} */}
    </>
};

export default Inbox;