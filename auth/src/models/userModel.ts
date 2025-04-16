import mongoose from 'mongoose';
import { Password } from '../utils/Password';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String
      // required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface userSentDoc {
  username:string,
  email: string;
  password: string;
}

interface userRetrievedDoc extends mongoose.Document {
  username:string,
  email: string;
  password: string;
}

interface userModel extends mongoose.Model<any> {
  build(userAttrs: userSentDoc): userRetrievedDoc;
}

userSchema.statics.build = (userAttrs) => {
  return new User(userAttrs);
};
userSchema.pre('save', async function (done) {
  // isModified function is responsible for make modification to password,
  // but at first it checks if password has modifies before, the function reject the process and return false.
  // false here meaning that the process of modification  failed, not the password is modified.
  // but if he password is plain the function will take it and undergo modification process ,returning true that the process succeed.
  //  The question is how the function check state of password?????
  //  and what is the use case????
  if (this.isModified('password')) {
    const hashed = await Password.hashingPass(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

export const User = mongoose.model<userRetrievedDoc, userModel>(
  'user',
  userSchema
);
