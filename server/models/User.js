
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
	let token = jwt.sign({_id: user._id.toHexString(), access}, 'secret').toString();

	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	});

};

let User = mongoose.model('User', UserSchema);

module.exports = {
	User
}
