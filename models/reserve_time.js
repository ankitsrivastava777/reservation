var mongoose = require("mongoose");
var { conn } = require("../config/db");
var { reservation } = require("../models/reservation");

var reserve_time = mongoose.Schema(
    {
        reservation_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        timezone: {
            type: String,
            required: true,
        },
        reservation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reservation",
        },
    },
    {
        timestamp: true,
        strict: true,
        collection: "reserve_time",
    }
);

var reserve_time = conn.model("reserve_time", reserve_time);

exports.reserve_time = reserve_time;
