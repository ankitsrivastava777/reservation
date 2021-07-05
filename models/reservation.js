var mongoose = require("mongoose");
var { conn } = require("../config/db");
var { customer_details } = require("../models/customer");
var { reserve_time } = require("../models/reserve_time");
var { end_time } = require("../models/end_time");

var reservation = mongoose.Schema(
    {
        duration: {
            type: String,
        },
        number_of_guest: {
            type: String,
        },
        reserve_time: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "reserve_time",
            },
        ],
        end_time: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "end_time",
            },
        ],
        customer: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "customer_details",
            },
        ],
    },
    {
        timestamps: true,
        strict: true,
        collection: "reservation",
    }
);

var reservation = conn.model("reservation", reservation);

exports.reservation = reservation;
