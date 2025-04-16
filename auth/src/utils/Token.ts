import jwt from 'jsonwebtoken';
export class Token {
  static signToken(payload: object): string {
    const token = jwt.sign(payload, process.env.JWT_KEY!, {
      expiresIn: 60 * 60 ,
    });
    return token;
  }

  static verifyToken(token: string) {
      const user = jwt.verify(token, process.env.JWT_KEY!);
      return user
  }
}
