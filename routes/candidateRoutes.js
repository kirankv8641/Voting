const express = require('express');
const router = express.Router();
const Candidate = require('./../models/candidate');
const User = require('./../models/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');

const checkAdminRole= async (userId) =>{
    try{
        const user=await User.findById(userId);
        if(user.role==='admin'){
            return true;
        };
    }catch(err){
        return false;
}
}
router.post('/',jwtAuthMiddleware, async (req, res) => {
    try {
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({ error: 'user does not have admin role' });
        }
        const data = req.body//Assuming the request body contains the person data

        //Create a new User document using the Mongoose model
        const newCandidate = new Candidate(data);

        //Save  the new User to the database
        const response = await newCandidate.save();
        console.log('data saved');

        res.status(200).json({ response: response});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Update
router.put('/:candidateId',jwtAuthMiddleware, async (req, res) => {
    try {
         if(!await checkAdminRole(req.user.id)){
            return res.status(403).json({ error: 'user does not have admin role' });
        }
        const candidateId = req.params.candidateId;//Extract the candidate ID from the url parameter
        const updatedCandidateData = req.body;
        
       const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
            returnDocument: 'after',
            runValidators: true,
        })
        if (!response) {
            return res.status(403).json({ error: 'Candidate not found' });
        }
        console.log('Candidate data updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/:candidateId',jwtAuthMiddleware, async (req, res) => {
    try {
         if(!await checkAdminRole(req.user.id)){
            return res.status(403).json({ error: 'user does not have admin role' });
        }
        const candidateId = req.params.candidateId;//Extract the candidate ID from the url parameter
   
       const response = await Candidate.findByIdAndDelete(candidateId);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        console.log('Candidate deleted');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Voting
router.post('/vote/:candidateId',jwtAuthMiddleware,async (req,res)=>{
    //Admin can't vote at all
    //user can vote only once
    candidateId=req.params.candidateId;
    userId=req.user.id;

    try{
        const candidate=await Candidate.findById(candidateId);
        if(!candidate){
            return res.status(404).json({ error: 'Candidate not found' });  
        }
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        if(user.isVoted){
         res.status(400).json({ error: 'User has already voted' });
        }
        if(user.role==='admin'){
            res.status(403).json({ error: 'Admin are not allowed to vote' });
        }

        //update the candidate document to record the vote
        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        //update the user document
        user.isVoted=true;
        await user.save();

        res.status(200).json({ message: 'Vote recorded successfully' });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//vote count

router.get('/vote/count',async (req,res)=>{
    try{
        const candidate=await Candidate.find().sort({voteCount: 'desc'});

        const voteRecord=candidate.map((data)=>{
            return{
                party:data.party,
                count:data.voteCount
            }
        })
          return res.status(200).json(voteRecord);  
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
module.exports = router;