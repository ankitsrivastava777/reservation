var mongoose = require("mongoose");
var { conn } = require("../config/db");

var reservation_details = mongoose.Schema(
    {
        duration_default: {
            type: String,
        },
        seat_capacity: {
            type: String,
        },
    },
    {
        strict: true,
        collection: "reservation_data",
    }
);

var reservation_details = conn.model("reservation_data", reservation_details);

exports.reservation_details = reservation_details;
