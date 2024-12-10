const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: {
        type: Number,
        default: 0
    },
    price: Number
})


const OrderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: { type: String },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        default: "Recieved",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
    },
    address: String,
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
}, { timestamps: true })

OrderSchema.pre('save', function (next) {
    this.updated = new Date();
    next();
  });
  
const Order = mongoose.model('OrderSchema', OrderSchema)

const ProductCart = mongoose.model('ProductCartSchema', ProductCartSchema)


module.exports = { Order, ProductCart }