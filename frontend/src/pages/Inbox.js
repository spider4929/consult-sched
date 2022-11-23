import { Grid, List, Paper } from '@mui/material';
import Chat from '../components/Chats/Chat';
import MyChats from '../components/Chats/MyChats';
import SideDrawer from '../components/Chats/SideDrawer'
import { useAuthContext } from '../hooks/useAuthContext';

import { useTheme } from "@mui/material/styles";

const Inbox = () => {
    const theme = useTheme()
    const { user } = useAuthContext();

    return <>
        <Grid container component={Paper} sx={{  }}>
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