 const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');

router.post('/signup', async (req, res) => {

    try {
        const data = req.body//Assuming the request body contains the person data

        //Create a new User document using the Mongoose model
        const newUser = new User(data);

        //Save  the new User to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response._id,
        };
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is :", token);
        res.status(200).json({ response: response, token: token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Login route
router.post('/login', async (req, res) => {
    try {
        //Extract the username and password from the request body
        const {  aadharCardNumber, password } = req.body;

        const user = await User.findOne({  aadharCardNumber:  aadharCardNumber });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        //generate a token
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        res.json({ token })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Profile route
router.get('/profile', jwtAuthMiddleware,async (req, res) => {
    try {
        const userData = req.user;//Extract the user data from the request object
        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



//Update
router.put('/profile/password',jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user;//Extract the id from the url parameter
        const{currentPassword,newPassword}=req.body;
        
        const user = await User.findById(userId);
        
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router;