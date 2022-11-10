import { Avatar, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i+1].sender !== m.sender || 
            messages[i+1].sender === undefined) &&
            messages[i].sender !== userId);
};
const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender !== userId &&
        messages[messages.length - 1].sender
    );
};

const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender === m.sender &&
        messages[i].sender !== userId
    )
        return 'flex-start';
    else if (
        (i < messages.length - 1 &&
          messages[i+1].sender !== m.sender &&
          messages[i].sender !== userId) ||
        (i === messages.length - 1 && messages[i].sender !== userId)  
    ) return 'flex-start';
    else return 'flex-end';
};

const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender === m.sender;
};

const ScrollableChat = ({messages}) => {
    const { user } = useAuthContext()
    const [ luser, setUser] = useState()

    const fetchUser = async () => {
    try {
        const response = await fetch(`/api/profile/me`, {
            headers: {
            'x-auth-token': `${user.token}`
            }
        })
        
        const json = await response.json()

        if (response.ok) {
            setUser(json.user)
        }
    
    } catch (error) {
        console.log(error)
    }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Box
            sx={{
                height: 500,
                bgcolor: '#ECECEC',
                overflow: "hidden",
                overflowY: "scroll"
            }}>
        {messages && luser &&
            messages.map((m, i) => (
                <Box key={m._id} sx={{
                    display: "flex",
                    justifyContent: isSameSenderMargin(messages, m, i, luser._id)
                }}>
                    <Box sx={{ display: "flex" }}>
                        {(isSameSender(messages, m, i, luser._id) ||
                            isLastMessage(messages, i, luser._id)) && (
                            <Typography></Typography>
                            )}
                        {   
                            <Box sx={{
                                display: 'inline-flex',
                                bgcolor: `${m.sender === luser._id ? "primary.main" : "primary.dark"}`,
                                borderRadius: 3,
                                p: 1,
                                marginTop: isSameUser(messages,m,i,luser._id) ? 1:3,
                                ml: 2,
                                mr: 2
                            }}>
                                <Typography sx={{
                                    color: 'white'
                                }}>
                                {m.text}
                                </Typography>
                            </Box>
                        }
                    </Box>
                </Box>
            )
        )}
        </Box>
    );
};

export default ScrollableChat;
