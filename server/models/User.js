const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10

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

// userSchema.pre('save', (next) => {
// 	let user = this;
// 	if(this.isModified('password')) {
// 		bcrypt.genSalt(saltRounds, (err, salt) => {
// 			if(err) return next(err)
// 			bcrypt.hash(user.password, salt, (err, hash) => {
// 				// Store hash in your password DB.
// 				if(err) return next(err)
// 				user.password = hash
// 				next()
// 			});
// 		});
// 	}
// 	return true
// })

// 전처리
userSchema.pre('save', function (next) {
	// 비밀번호 암호화
	var user = this;
	if(this.isModified('password')) {
		bcrypt.genSalt(saltRounds, (err, salt) => {
			if(err) return next(err)
			bcrypt.hash(user.password, salt, (err, hash) => {
				// Store hash in your password DB.
				if(err) return next(err)
				user.password = hash
				next()
			});
		});
	} else {
		next()
	}

})

userSchema.methods.comparePassword = function(plainPassword, cb) {
	// plainPassword 1234567 암호화된 비밀번호 hashMac
	bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
		if(err) return cb(err),
			createImageBitmap(null, isMatch)
	})
}

userSchema.methods.generateToken = function(cb) {
	
	var user = this;
	
	// jsonwebtoken 을 이용해서 token 생성하기
	var token = jwt.sign(user._id.toHexString(), 'secretToken')
	user.token = token
	user.save(function(err, user) {
		if(err) return cb(err)
		cb(null, user)
	})
}

userSchema.statics.findByToken = function (token, cb) {
	var user = this;

	// 토큰을 decode 한다.
	jwt.verify(token, 'secretToken', function (err, decoded) {
		// 유저 아이디를 이용해서 유저를 찾은 다음에
		// 클라이언트에서 가져온 token 과 DB 에 보관된 토큰이 일치하는지 확인

		user.findOne({"_id":decoded, "token" : token}, function(err, user){
			if(err) return cb(err)
			cb(null, user)
		})
	})
}

const User = mongoose.model('User', userSchema)

module.exports = { User }