/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var connection = require("../utils/database");
var MailConfig = require('../utils/email');
var hbs = require('nodemailer-express-handlebars');
var gmailTransport = MailConfig.GmailTransport;
var ObjectID = require("mongodb").ObjectID;
var crypto = require('crypto');
var {
  throwError,
  throwIf,
  sendError,
  sendSuccess
} = require("../utils/errorHandlers");
var algorithm = 'aes256';
var text = 'I love kittens';

module.exports = async function(router, db) {
  router
  	.post('/register', async function(req,res){
      var col = await db.collection("users");
  		const {username, password, email} = req.body;
      var cipher = crypto.createCipher(algorithm, text);
      var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

      try{
        var user = await col.findOne({username: username})
        if(user) return res.json({code: 1, msg:'Username already exists'});
        user = await col.insertOne({username:username, password: encrypted, email:email})
        //use cookie
        res.cookie('userid', user.ops[0]._id, {maxAge:1000*60*60*24})
        res.json({code: 0, data:{_id:user.ops[0]._id,username:user.ops[0].username,email:user.ops[0].email}});
      }catch(err){
        throwError()(err);
      }
  		
  	})
  	.post('/login',async function(req,res){
      const {username, password} = req.body;
      var col = await db.collection("users");
      var cipher = crypto.createCipher(algorithm, text);
      var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

      try{
      	//projection password 0 filter out password
        var user = await col.findOne({username:username, password: encrypted}, {projection:{password:0}});
        if(user){
          res.cookie('userid', user._id, {maxAge:1000*60*60*24})
          res.json({code: 0, data:user});
        }
        else res.json({code: 1, msg:'Incorrect username and password'});
      } catch(err){
        throwError()(err);
      }
  	})
    .post('/initialize',async function(req,res){
      const userid = req.cookies.userid;
      if(!userid) return res.send({code: 1, msg:'Please login first'})

      const user = req.body;
      var col = await db.collection("users");

      col.findOneAndUpdate({_id:ObjectID(userid)}, 
      					   {$set:{profilePicture: user.profilePicture, 
                                  displayName: user.displayName,
                                  funFact: user.funFact}},
                           {returnOriginal:false,projection: {password: 0}},
                           (err, updatedUser)=>{
        if(err) throwError()(err);
        //cookie does not match any existing user.
        if(!updatedUser){
          res.clearCookie('userid');
          return res.send({code: 1, msg:'Invald login credentials'});
        };
        res.send({code:0, data:updatedUser.value})
      	})   
      }
    )
    .post('/update', async function(req,res){
    	const userid = req.cookies.userid;
    	if(!userid) return res.send({code: 1, msg:'Please login first'})
    	const {newDisplayName, newEmail, newFunFact} = req.body;
    	var col = await db.collection("users");

    	try{
    		var user = await col.findOneAndUpdate({_id:ObjectID(userid)}, 
    											  {$set:{email: newEmail, 
                                   displayName: newDisplayName,
                                 	 funFact: newFunFact}},
    											  {returnOriginal:false,projection: {password: 0}});
	    	if(!user){
	          	res.clearCookie('userid');
	          	return res.send({code: 1, msg:'Invald login credentials'});
	        };
	        res.send({code:0, data:user.value})
    	}catch(err){
    		throwError()(err);
    	}
    })
    .get('/user', async function(req,res){
    	const userid = req.cookies.userid
  		if(!userid) return res.send({code: 1, msg:'Please login first'})
      try{ 
        var col = await db.collection("users");
        var user = await col.findOne({_id:ObjectID(userid)},{projection: {password: 0}});
        if(!user){
          res.clearCookie('userid');
          return res.send({code: 1, msg:'Invald login credentials'});
        };
        res.send({code: 0, data:user});
        }
      catch(err){
        throwError()(err);
      }
    })

    .get('/userList', async function(req,res){
      const userid = req.cookies.userid
      if(!userid) return res.send({code: 1, msg:'Please login first'})
      var col = await db.collection("users");
      try{
        var userList = await col.find({_id:{$ne: ObjectID(userid)}},{projection: {password: 0}}).toArray();
        res.send({code:0, data:userList})
      }catch(err){
        throwError()(err);
      }
    })
    .get('/msgList', async function(req,res){
      const userid = req.cookies.userid
      if(!userid) return res.send({code: 1, msg:'Please login first'})
      var userCol = await db.collection("users");
      var chatCol = await db.collection("chat");

      const userDoc = await userCol.find({},{projection: {password: 0}}).toArray();
      
      
      const users = {};
      userDoc.forEach((user)=>{
          users[user._id]={displayName:user.displayName, profilePicture:user.profilePicture}
      })  
        //find all messages from or to a user
      const chatMsgs = await chatCol.find({'$or': [{from:userid} , {to:userid}]}).toArray();
      console.log(chatMsgs)
      res.send({code: 0, data:{users, chatMsgs}})
        
    })
    //change a particular msg to read status
    .post('/readMsg', async function(req,res){
      const from = req.body.from;
      const to = req.cookies.userid;


      var chatCol = await db.collection("chat");
      chatCol.updateMany({from, to, read: false}, {$set:{read: true}},function(err,doc){
        res.send({code:0, data:doc.modifiedCount})
      })

    })
    .post('/findInfo', async function(req,res){
      const username = req.body.username;
      var userCol = await db.collection("users");
      const userDoc = await userCol.findOne({username});
      if(!userDoc) return res.send({code: 1, msg:'Invalid username'})

      var decipher = crypto.createDecipher(algorithm, text);
      var decrypted = decipher.update(userDoc.password, 'hex', 'utf8') + decipher.final('utf8');


      MailConfig.ViewOption(gmailTransport,hbs);
      let HelperOptions = {
        from: '"Chat" <donotreplychatfindinfo@gmail.com>',
        to: userDoc.email,
        subject: 'YOUR LOGIN INFO',
        template: 'info',
        context: {
          username: userDoc.username,
          password: decrypted,
          email: userDoc.email
        }
      };
      gmailTransport.sendMail(HelperOptions, (error,info) => {
        if(error) {
          console.log(error);
          return res.json(error);
        }
        console.log(info);
        res.json({code:0, data:"Email is sent"});
      });
    })
};
