var {
  throwError,
  throwIf,
  sendError,
  sendSuccess
} = require("../utils/errorHandlers");
var mongo = require("../utils/database.js");
var moment = require('moment');

module.exports = async function(io){
	var db;
	try{

		db = await mongo.getDB("chatDB")
	}catch(e){
		console.log(e);
	}

	var users=[];


	io.on('connection', function(socket){
		console.log(socket.id+' io connected(socket id)')

		socket.on('userConnected', function(userId){
			//this will not work after client refresh because it send 'userConnected' after login
			users[userId]=socket.id;
			console.log(userId+" socket connected(user id)");
			console.log(users);
			socket.broadcast.emit("userConnected", userId+" socket connected(user id)");
		})

		socket.on('sendServer', async function(data){
			
			//ensure both from and to access the same chat_id and same chatting history
			const chat_id = [data.from, data.to].sort().join('-');
			socketIdFrom = users[data.from];
			socketIdTo = users[data.to];
			const create_on = Date.now();
			//console.log(moment(create_on,"unix").fromNow())
			try{
				var chatCol = await db.collection("chat");
				var chatData = await chatCol.insertOne({...data, chat_id, create_on, read:false})
				//console.log(socketIdFrom);
				//console.log(socketIdTo)
				//socketIdTo is undefined after client refresh or not login
				//if undefined, it is NOT sending here but send out to sender in next line.
				//then save in db. functioned as off-line messages
				io.to(socketIdTo).emit('sendClient', chatData.ops[0]);
				//send a copy with create_on and etc to the sender to display
				//socketIdFrom is undefined after client refresh
				io.to(socket.id).emit('sendClient', chatData.ops[0]);
			}catch(err){
				console.log(err);
			}
		})
		socket.on('disconnect', function(){
        	console.log('client disconnect...', socket.id)
    	});
    	socket.on('error', function (err) {
    		console.log('received error from client:', socket.id)
    		console.log(err)
  		})
	})
}