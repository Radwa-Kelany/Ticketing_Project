import { Router } from "express";
import { createPaymentRouter } from "./createPayment";

const router= Router();
router.use('/',createPaymentRouter)


export {router as paymentsRouter}