var mongoose = require("mongoose");
var { conn } = require("../config/db");
var { reservation } = require("../models/reservation");

var end_time = mongoose.Schema(
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
        collection: "end_time",
    }
);

var end_time = conn.model("end_time", end_time);

exports.end_time = end_time;
