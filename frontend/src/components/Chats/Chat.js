import { Box, CircularProgress, Divider, FormControl, Input, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import ScrollableChat from "./ScrollableChat";
import './scrollbar.css'

const Chat = ({ fetchAgain, setFetchAgain }) => {

    const [ messages, setMessages ] = useState([])
    const [loading, setLoading ] = useState(false);
    const [newMessage, setNewMessage ] = useState('');

    const { user, selectedChat, setSelectedChat } = useAuthContext();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true)
            const response = await fetch(`/api/chat/${selectedChat._id}`, {
                headers: {
                    'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()

            setMessages(json.message)
            setLoading(false);

        } catch ( error ) {
            console.log(error)
        } 
    }

    const sendMessage = async (event) => {
        if(event.key==="Enter" && newMessage) {
            try {
                setLoading(true);

                const reply = {
                    text: newMessage
                }
                
                setNewMessage("")
                const response = await fetch(`/api/chat/${selectedChat._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(reply),
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': `${user.token}`
                    }
                })
        
                const json = await response.json()

                setMessages([...messages, json]);
                setLoading(false);
            } catch (error) {
                console.log(error)
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing Indicator Logic
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    return (
        <>
            <Box sx={{
                m: 2,
                p: 0.5
            }}>
            <Typography
                sx={{
                    fontWeight: 'bold'
                }}> 
                { selectedChat ? selectedChat.teacher_name : 'Chat Window'}
            </Typography>
            </Box>
            { selectedChat ? (
            <Box>
                {loading ? ( <CircularProgress/>) : 
                 <div className='messages'>
                    <ScrollableChat messages={messages}/>
                </div>}
                <Divider/>
                <Box onKeyDown={sendMessage} 
                sx={{
                    display:"flex",
                    flexGrow: 1
                }}
                 >
                    <Input
                        placeholder="Enter a message.."
                        onChange={typingHandler}
                        value={newMessage}
                        required
                        fullWidth
                        sx={{
                            p:1
                        }}
                        >
                    </Input>
                </Box>
            </Box> ) : 
                <Box 
                    sx={{ 
                        display: 'flex',
                        height: 500,
                        justifyContent: 'center',
                        flexGrow: 1
                    }}
                > 
                    <Typography> Click on a user to start chatting</Typography>
                </Box>}
        </>
    );
};
export default Chat;