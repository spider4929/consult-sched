import React, { useEffect, useState } from 'react';
import { Paper, Grid, Divider, TextField, Typography, List, ListItem, 
    ListItemIcon, ListItemText, Avatar, Fab, ListItemButton, } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { useAuthContext } from '../hooks/useAuthContext';
import { Stack } from '@mui/system';
import { formatInTimeZone } from "date-fns-tz";
import AddIcon from '@mui/icons-material/Add';

const classes = {
    active: {
        margin: '10px 0',
        background: '#f4f4f4',
    },
    inactive: {
        margin: '10px 0'
    }
}

export const Chat2 = () => {
    // Declaration of useStates
    const [ profile, setProfile] = useState(null)       //for the profile card at the top left
    const [ inbox, setInbox] = useState(null)           //for general inbox fetch json
    const { user } = useAuthContext()                    
    const [ thread, setThread ] = useState(null)        //for the message thread, inside the specific mail object in mail array
    const [ sender, setSender ] = useState(null)        //to remember the id of 'from' user in mail object
    const [ active, setActive ] = useState(null)        //for setting which active thread on the left panel
    const [ replyMsg, setReplyMsg ] = useState('')      //for reply form submit

    //Time formatting to Manila Time
    const formatToManilaTime = (time) => formatInTimeZone(time, 'Asia/Manila', 'MMM dd, yyyy hh:mm a')

    //Function to open the thread to UI
    const setCurrentThread = (option) => {
        console.log(option)
        setThread(option.message.reverse())
        setSender(profile.user._id)
        setActive(option._id)
    }

    //use effect to fetch profile information and inbox information
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
        const fetchInbox = async () => {

            const response = await fetch(`/api/inbox/me`, {
                headers: {
                    'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                setInbox(json)
                console.log(json)
            }
            }

        if (user) {
            fetchProfile()
            fetchInbox()
        }
    }, [user])

    //submit function
    const handleSubmit = async (e) => {

        const reply = {
            text: replyMsg
        }

        const response = await fetch(`/api/inbox/${active}`, {
            method: 'PUT',
            body: JSON.stringify(reply),
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            console.log('failed')
        }

        if (response.ok) {
            console.log(json, 'success')
        }
    };

    return (
        <div>
          <Grid container component={Paper}>
              <Grid item xs={3}>
                  <List to='/profile'>
                    {profile &&
                      <ListItemButton href="/profile">
                          <ListItemIcon>
                          <Avatar alt="Profile Picture" src={profile.user.avatar} />
                          </ListItemIcon>
                          <ListItemText primary={profile.user.first_name}></ListItemText>
                      </ListItemButton>
                        }
                  </List>
                  <Divider />
                  { inbox &&
                  <List>
                      {inbox && inbox.map((message) => {
                        return (
                            <ListItem 
                                button 
                                key={message.to_name}
                                onClick={() => setCurrentThread(message)}
                                sx={message._id === active ? classes.active : classes.inactive}
                            >
                            <ListItemIcon>
                                <Avatar src={"https://material-ui.com/static/images/avatar/1.jpg"} />
                            </ListItemIcon>
                            <ListItemText primary={user.role === 1 ? message.teacher_name : message.student_name}></ListItemText>
                        </ListItem>
                        )
                      })}
                     <Divider />
                     <ListItem 
                        button 
                        key='Create'
                        //</List>onClick={}
                        sx={classes.inactive}
                        >
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create new thread"></ListItemText>
                    </ListItem>
                  </List>}
              </Grid>
              <Grid item xs={9}>
                  <List
                    sx={{ maxHeight: 500, overflow: 'auto'}}
                  >
                      {thread ? thread.map((messages) => {
                        return (
                        <ListItem key={messages._id}>
                          <Grid container>
                              <Grid item xs={12}>
                                  <ListItemText align={messages.from === sender ? "right" : "left"} primary={messages.text}></ListItemText>
                              </Grid>
                              <Grid item xs={12}>
                                  <ListItemText align={messages.from === sender ? "right" : "left"} secondary={formatToManilaTime(messages.date)}></ListItemText>
                              </Grid>
                          </Grid>
                        </ListItem>
                        )})
                        : 
                      (<Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            display:'flex',
                            flexWrap: 'wrap',
                            '& > :not(style)':{
                                m: 25,
                                height: 100,
                            },
                        }}>
                        <Typography>Click a thread on the left</Typography>
                     </Stack>)
                      }
                  </List>
                  <Divider />
                  { active &&
                  <Grid container style={{padding: '20px'}}>
                      <Grid item xs={11}>
                          <TextField 
                            label="Type Something" 
                            type="text"
                            fullWidth 
                            onChange={(e) => setReplyMsg(e.target.value)}
                        />
                      </Grid>
                      <Grid xs={1} align="right">
                          <Fab 
                            color="primary" 
                            aria-label="add"
                            onClick={handleSubmit}
                            ><SendIcon /></Fab>
                      </Grid>
                  </Grid>
                }
              </Grid>
          </Grid>
        </div>
    );
  }
  