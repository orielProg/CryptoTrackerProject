const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const User = require('../model/User');

dotenv.config({path : "../.env"});


const getTokens = async (req,res,userID) => {
    const accessToken = jwt.sign({_id : userID},process.env.ACCESS_TOKEN_SECRET, {expiresIn : "30m"})
    const refreshToken = jwt.sign({_id : userID},process.env.REFRESH_TOKEN_SECRET, {expiresIn : "365d"})
    try{
    await User.findOneAndUpdate({_id : userID},{refreshToken})
    res.cookie("accessToken",accessToken, {maxAge : 1800000, httpOnly : true})
    res.cookie("refreshToken",refreshToken, {maxAge : 3.154e10, httpOnly : true})
    res.cookie("loggedIn",true,{maxAge : 3.154e10, httpOnly : false})
    }
    catch(error){
        console.log(error);
    }
}

const getUserID = async (accessToken,refreshToken,res) => {
    if(refreshToken == null) return null;
    let _id = null;
    await jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET, async (err,user) => {
        if(user) _id = user._id;
        else{
            await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, async (err,user) => {
                const userTokenDB = await User.findById({_id : user._id},{refreshToken : refreshToken});
                if(userTokenDB.refreshToken!==refreshToken){
                    return null;
                }
                _id = user._id;
                await getTokens({},res,_id);
            })
        }
    })
    return _id;
}

const deleteTokens = (res) => {
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.clearCookie("loggedIn");
}


module.exports.getTokens = getTokens;
module.exports.getUserID = getUserID;
module.exports.deleteTokens = deleteTokens;