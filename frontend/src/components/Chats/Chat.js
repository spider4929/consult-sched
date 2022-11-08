import { Box, CircularProgress, FormControl, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Chat = ({ fetchAgain, setFetchAgain }) => {

    const [ messages, setMessages ] = useState([])
    const [loading, setLoading ] = useState(false);
    const [newMessage, setNewMessage ] = useState();

    const { user, selectedChat, setSelectedChat } = useAuthContext();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true)
            const response = await fetch(`/api/inbox/me`, {
                headers: {
                    'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()

            setMessages(json)
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
                const response = await fetch(`/api/inbox/${selectedChat._id}`, {
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
            <Typography> Selected Chat

            </Typography>
            { selectedChat ? (
            <Box>
                {loading ? ( <CircularProgress/>) : 
                 <div>
                    {/* { Messages }  */}
                </div>}
                <FormControl onKeyDown={sendMessage}
                 >
                    <TextField
                        label="Enter a message.."
                        onChange={typingHandler}
                        value={newMessage}
                        required
                        >

                    </TextField>
                </FormControl>
            </Box> ) : 
                <Box 
                    sx={{ 
                        width: '50%',
                        height: '50%'
                    }}
                > 
                    <Typography> Click on a user to start chatting</Typography>
                </Box>}
        </>
    );
};
export default Chat;