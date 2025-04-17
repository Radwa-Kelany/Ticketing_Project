import Stripe from "stripe";

const stripe= new Stripe("sk_test_51Qj1n6C6g6sK3D5g1SsjXf6PLNEBVIwN7sP7F6wCmbSb9trErEeSzJRgaHX2R11FPz2CvHVNVmhLeZBKU00YrILR00d2rAkH0n",{
    apiVersion:"2024-12-18.acacia"
})
// const stripe = require('stripe')('sk_test_51Qj1n6C6g6sK3D5g1SsjXf6PLNEBVIwN7sP7F6wCmbSb9trErEeSzJRgaHX2R11FPz2CvHVNVmhLeZBKU00YrILR00d2rAkH0n');


export default stripe