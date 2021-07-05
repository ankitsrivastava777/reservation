var mongoose = require("mongoose");
var { conn } = require("../config/db");
var { reservation } = require("../models/reservation");

var customer_details = mongoose.Schema(
    {
        reservation_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        reservation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reservation",
        },
    },
    {
        strict: true,
        collection: "customer_details",
    }
);

var customer_details = conn.model("customer_details", customer_details);

exports.customer_details = customer_details;
