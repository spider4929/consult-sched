import { Typography, Box, Button, makeStyles, TextField, FormControl, FormLabel } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const classes = {
    field: {
        marginTop: 2,
        marginBottom: 2,
        display: 'block'
    },
    socials: {
        marginTop: 2,
        marginBottom: 2,
        display: 'block'
    }
}

const Profile = () => {
    const [profiles, setProfiles] = useState(null)
    const [oldPassword, setOldPassword] = useState ('')
    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [password, setPassword] = useState ('')
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchProfiles = async () => {
            const response = await fetch('/api/profile/me', {
            headers: {
                'x-auth-token': `${user.token}`
            }
            })
            const json = await response.json()

            if (response.ok) {
            setProfiles(json)
            }
        }
        
        if (user) {
            fetchProfiles()
        }
        }, [user])
    
    const handleSubmitPwChange = (e) => {
        e.preventDefault()
        setOldPasswordError(false)
        setPasswordError(false)
        setConfirmPasswordError(false)

        if (oldPassword === '') {
            setOldPasswordError(true)
        }
        if (password === '') {
            setPasswordError(true)
        }
        if (password === confirmPassword) {
            console.log("change password success")
        }
        if (password !== confirmPassword){
            console.log("change password error")
            setConfirmPasswordError(true)
        }
        setPassword("")
        setConfirmPassword("")
    }

    const handleSubmitSocials = (e) => {
        e.preventDefault()
    }

    return ( 
        <Box padding={2}>
            <Typography
             variant="h6" 
             color="primary">
                Profile
            </Typography>
            {profiles && <TextField
                sx={classes.field}
                label="First Name"
                id="outlined-disabled"
                color="secondary"
                disabled

                defaultValue={profiles.user.first_name}
            />}
            {profiles && <TextField
                sx={classes.field}
                label="Last Name"
                id="outlined"
                color="secondary"
                disabled

                defaultValue={profiles.user.last_name}
            /> }
            {/* <FormControl>
                <FormLabel>Courses and Socials</FormLabel>
                    <form noValidate autoComplete="off" onSubmit={handleSubmitSocials}>
                    <TextField
                            sx={classes.socials}
                            onChange={(e) => setFacebook(e.target.value)}
                            label="Facebook"
                            variant="outlined"
                            color="secondary"
                            id="facebook-input"
                            fullWidth

                            required
                        />
                    <TextField
                            sx={classes.socials}
                            onChange={(e) => setLinkedin(e.target.value)}
                            label="LinkedIn"
                            variant="outlined"
                            color="secondary"
                            id="linkedin-input"
                            fullWidth
                            
                            required
                        />
                    </form>
                    
            </FormControl> */}
            <FormControl>
                <FormLabel>Change password</FormLabel>
                    <form noValidate autoComplete="off" onSubmit={handleSubmitPwChange}>
                        <TextField
                            sx={classes.field}
                            onChange={(e) => setOldPassword(e.target.value)}
                            type="password"
                            label="Old Password"
                            variant="outlined"
                            color="secondary"
                            id="old-password-input"

                            value={oldPassword}
                            error={oldPasswordError}

                            required
                        />
                        <TextField
                            sx={classes.field}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            label="Enter New Password" 
                            variant="outlined"
                            color="secondary"
                            id="new-password-input"

                            value={password}
                            error={passwordError}

                            required
                        />
                        <TextField
                            sx={classes.field}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            label="Confirm Password"
                            variant="outlined"
                            color="secondary"
                            id="confirm-new-password-input"

                            value={confirmPassword}
                            error={confirmPasswordError}

                            required
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
        </Box>
     );
}
 
export default Profile;
