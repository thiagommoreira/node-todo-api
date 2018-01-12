
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const secret = 'abc123';

let UserSchema = new mongoose.Schema({

	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: (value) => { //ou simplesmente validator: validator.isEmail
				return validator.isEmail(value);
			},
			message: '{VALUE} is not a valid email.'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		trim: true
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON	= function() {
		let user = this;
		let userObject = user.toObject();

		return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () { //pra utilizar o this ali em baixo precisa usar a palavra function

	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id: user._id.toHexString(), access}, secret).toString();

	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	});

};

UserSchema.statics.findByToken = function(token) {

	var User = this;
	var decoded;

	try {

		decoded = jwt.verify(token, secret);

	} catch (e) {

		return Promise.reject();

	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});

};

UserSchema.statics.findByCredentials = function(email, password) {
	let User = this;

	return User.findOne({email}).then((user) => {
		if(!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {

				if(res) {
					return resolve(user);
				} else {
					return reject();
				}

			});

		});

	});

};

UserSchema.pre('save', function(next) {
	let user = this;

	if (user.isModified('password')) {
		let pw = user.password;
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(pw, salt, (err, res) => {
				user.password = res;
				next();
			});
		});

	} else {
		next();
	}
});

let User = mongoose.model('User', UserSchema);

module.exports = {
	User
}
