import { Typography, Container, Button, makeStyles, TextField, FormControl, FormLabel } from "@mui/material";
import { useState } from "react";

const classes = {
    field: {
        marginTop: 2,
        marginBottom: 2,
        display: 'block'
    }
}

const Profile = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState ('');
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const handleSubmit = (e) => {
        setPasswordError(false)
        setConfirmPasswordError(false)

        if (password === '') {
            setPasswordError(true)
        }
        if (password === confirmPassword) {
            console.log("change password success")
        }
        if (password != confirmPassword){
            console.log("change password error")
            setConfirmPasswordError(true)
        }
        setPassword("")
        setConfirmPassword("")
    }
    return ( 
        <Container>
            <Typography
             variant="h6" 
             color="primary">
                Profile
            </Typography>
            <TextField
                sx={classes.field}
                label="Email"
                variant="outlined"
                color="secondary"
                disabled
                helperText="You cannot change your email"
            />
            <TextField
                sx={classes.field}
                label="Role"
                variant="outlined"
                color="secondary"
                disabled
            />
            <FormControl>
                <FormLabel>Change password</FormLabel>
                    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <TextField
                            sx={classes.field}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            variant="outlined"
                            color="secondary"
                            required
                            error={passwordError}
                        />
                        <TextField
                            sx={classes.field}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            label="Confirm Password"
                            variant="outlined"
                            color="secondary"
                            required
                            error={confirmPasswordError}
                        />
                        <Button 
                            variant="contained" 
                            color="primary"
                            type="submit"
                            >
                            Change Password
                        </Button>
                    </form>
            </FormControl>
        </Container>
     );
}
 
export default Profile;