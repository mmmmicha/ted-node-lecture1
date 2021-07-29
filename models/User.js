const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	email: {
		type: String,
		trim: true, // 문자열 내 space 가 없도록 해주는 역할
	},
	password: {
		type: String,
		maxlength: 50
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: {
		type: String
	},
	tokenExp: {
		type: Number
	}
})
// before_save(vaildateName)

// const vaildateName = (user) => {
// 	if dgasdfgasdfg
// 		true
// 	else
// 		false
// }
const User = mongoose.model('User', userSchema)

module.exports = { User }