import bcrypt from 'bcryptjs';

export class Password {
  static hashingPass(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hash(password, salt);
    return hashedPassword;
  }

  static comparePass(userPassword: string, hashedPassword: string):boolean {
    const isMatch = bcrypt.compareSync(userPassword, hashedPassword);
    return isMatch;
  }
}
