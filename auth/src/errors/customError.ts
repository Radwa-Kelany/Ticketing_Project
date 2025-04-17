import { ValidationError } from "express-validator";

export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor() {
    super();
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super();
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{message: "Not Found"}];
  }
}

export class DBConnectionError extends CustomError{
    statusCode= 500;
    constructor() {
        super();
        Object.setPrototypeOf(this, DBConnectionError.prototype);
      }
      serializeErrors() {
          return [ {message:"Server Connection Error"}]
      }
}

export class BadRequestError extends CustomError{
    statusCode= 400;
    constructor(public msg:string){
        super();
        Object.setPrototypeOf(this, BadRequestError.prototype);
      }
      serializeErrors() {
        return [{message:this.msg}]
      }
}

export class RequestValidationError extends CustomError{
    statusCode=400;
    constructor(public errors:ValidationError[]) {
        super();
        Object.setPrototypeOf(this, RequestValidationError.prototype);
      }
      serializeErrors() {
          return this.errors.map(err=>{
            return{message :err.msg}
          });
      }
}

export class NotAuthorizedError extends CustomError{
statusCode=401;
constructor(){
  super()
  Object.setPrototypeOf(this, NotAuthorizedError.prototype)
}
serializeErrors(){ 
  return [ {message:"Not Authorized User"}]
}
}