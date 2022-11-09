import { Box, Divider, Grid, List, Paper } from '@mui/material';
import { Chat2 } from '../components/Chat2';
import Chat from '../components/Chats/Chat';
import MyChats from '../components/Chats/MyChats';
import SideDrawer from '../components/Chats/SideDrawer'
import { useAuthContext } from '../hooks/useAuthContext';

const Inbox = () => {
    const { user } = useAuthContext();

    return <>
        
        <Grid container component={Paper}>
            <Grid item xs={3}>
            <List>
            { user && <SideDrawer/> }
            <Divider/>
            { user && <MyChats/> }
            </List>
            </Grid>
            <Grid item xs={9}>
            { user && <Chat/>}
            </Grid>
        </Grid>
        <Divider/>
        {/* { user && <Chat2/>} */}
    </>
};

export default Inbox;