import * as React from 'react';
import { useState } from "react";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Box, Button, Tooltip, Typography, Drawer, TextField, ListItem, List, Snackbar, Stack, ListItemButton, Divider } from "@mui/material";
import { useAuthContext } from '../../hooks/useAuthContext';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { CircularProgress } from '@mui/material';

const SideDrawer = () => {
    const { user, setSelectedChat, chats, setChats } = useAuthContext()

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
      });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
        handleSearch();
      };
    
      const handleClick = () => {
        setOpen(true);
      };
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const handleSearch = async () => {
        // if (!search) {
        //     console.log('error')
        //     return;
        // };

        try {
            setLoading(true)

            const response = await fetch(`https://backend-consult-sched-production.up.railway.app/api/profile/teachers`, {
                headers: {
                    'x-auth-token': `${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                setLoading(false)
                setSearchResult(json)
                console.log(json)
            }
        } catch (error) {}
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const startChat = {
                "text" : "Started conversation"
            }


            const response = await fetch(`https://backend-consult-sched-production.up.railway.app/api/chat/${userId}`, {
                method: 'POST',
                body: JSON.stringify(startChat),
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()
            
            if (!chats.find((c) => c._id === json._id)) setChats([json, ...chats]);

            setSelectedChat(json);
            setLoadingChat(false);
            setState('left',false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment key='left'>
            { user && user.role === 1 ? (
                <ListItemButton 
                variant="contained"
                onClick={toggleDrawer('left', true)}
                sx={{
                    p: 2
                }}
                >
            <PersonSearchIcon />
            <Typography>
                Select an Instructor
            </Typography>
            
            </ListItemButton>) : (
            <ListItem sx={{ justifyContent: 'center', mt: 0.5}}>
                <Typography sx={{ fontWeight: 'bold' }}> 
                    Current threads 
                </Typography>
            </ListItem>)
            }
            
            <Drawer
                    anchor='left'
                    open={state['left']}
                    onClose={toggleDrawer('left',false)}
                >
                    <List>
                        <ListItem sx={{
                            p: 2,
                        }}>
                            <Typography sx={{
                                fontWeight: 'bold',
                                fontSize: 'large'
                            }}>
                                List of Instructors
                            </Typography>
                        </ListItem>
                        <Divider sx={{
                            mb: 2,
                            mt: 1
                        }}/>
                        {/* <ListItem>
                            <TextField 
                                label="Search by name"
                                value={search}
                                fullWidth
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                variant="string"
                                onClick={handleSearch}
                                >
                                Go
                            </Button>
                        </ListItem> */}
                        <Stack>
                         { loading ? ( 
                            <ChatLoading/>
                         ) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>accessChat(user.user._id)}
                                    />
                            ))
                         ) 
                            
                        }
                        </Stack>
                        {loadingChat && <CircularProgress/>}
                    </List>
            </Drawer>
        </React.Fragment>
    );
};

export default SideDrawer;