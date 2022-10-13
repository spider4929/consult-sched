import { Box, Card, TextField, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Register = () => {
    const theme = useTheme()
    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signup, error, isLoading } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(firstName, lastName, email, password)
    }

    return (
        <Box sx={{padding: `${theme.spacing(10)}`}}>
            <Card sx={{
                width: '33%',
                margin: 'auto',
                padding: `${theme.spacing(3)}`
            }}
                elevation = {3}
            >
                <img src="cpe.png" alt="cpe logo" className="loginLogo"></img>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Enter first name" 
                        variant="standard"
                        fullWidth
                        required
                        onChange={(e) => setfirstName(e.target.value)}
                        value={firstName}
                    />
                    <TextField
                        label="Enter last name" 
                        variant="standard"
                        fullWidth
                        required
                        onChange={(e) => setlastName(e.target.value)}
                        value={lastName}
                    />
                    <TextField
                        label="Enter email" 
                        variant="standard"
                        type="email"
                        fullWidth
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <TextField
                        label="Enter password" 
                        variant="standard"
                        id="standard-password-input"
                        type="password"
                        fullWidth
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    <Button disabled={isLoading} type="submit" variant="contained">Register</Button>

                    {/* TODO: for array of errors, to .map() here */}
                    { error && <Card sx={{padding: `${theme.spacing(2)}`, color: 'white', backgroundColor: '#ff4569'}}>{error}</Card>}

                </form>
            </Card>
        </Box>
    );
}
 
export default Register;