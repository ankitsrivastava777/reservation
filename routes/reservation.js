const bodyParser = require("body-parser");
var express = require("express");
const { customer_details } = require("../models/customer");
const { reserve_time } = require("../models/reserve_time");
var { end_time } = require("../models/end_time");

var app = express();
var { reservation } = require("../models/reservation");
app.use(express.json());

function time_convert(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return hours + ":" + minutes;
}

app.post("/booking", async (req, res) => {
    var date = req.body.date;
    var bookingDate = new Date(date);
    if (new Date(date).getTime() < new Date().getTime()) {
        res.status(500).json({
            error: 0,
            message: "entered date is not valid",
            data: null,
        });
    } else {
        if (req.body.seats > 20) {
            res.status(200).json({
                error: 0,
                message: "you must call the restaurent you have large group",
                data: null,
            });
        } else {
            var customerDetails = await reservation
                .find({})
                .populate("end_time")
                .populate("reserve_time")
                .populate("customer");
            var endTimeBookingData = [];
            for (var i = 0; i < customerDetails.length; i++) {
                if (
                    customerDetails[i]["end_time"][0].time >
                    new Date(date).getTime()
                ) {
                    endTimeBookingData.push(customerDetails[i].number_of_guest);
                }
            }

            function getArraySum(a) {
                var total = 0;
                for (var i in a) {
                    total += a[i];
                }
                return total;
            }
            var result = endTimeBookingData.map((obj) => parseInt(obj));
            var bookedSeats = getArraySum(result);
            var seats = req.body.seats;
            var duration = req.body.duration;
            var name = req.body.customer_name;
            var email = req.body.customer_email;
            var date = req.body.date;
            var bookingTime = bookingDate.getTime();
            var timezone = bookingDate.getTimezoneOffset();
            var reservedDuration = duration * 60 * 60 * 1000;
            var endTime = bookingTime + reservedDuration;
            console.log(bookedSeats);
            var seatsAvailable = 100 - parseInt(bookedSeats);
            if (seatsAvailable > 0 && seatsAvailable >= seats) {
                const reservation_save = new reservation({
                    number_of_guest: seats,
                    duration: reservedDuration,
                    update_time: new Date(),
                });

                reservation_save.save(async function (err, row) {
                    if (err) {
                        res.status(500).json({
                            error: 1,
                            message: err.message,
                            data: null,
                        });
                    } else {
                        var customer_details_save = await new customer_details({
                            reservation_id: reservation_save._id,
                            name: name,
                            email: email,
                        }).save();
                        await reservation.updateOne(
                            { _id: reservation_save._id },
                            { $push: { customer: customer_details_save._id } }
                        );

                        var reserve_time_save = await new reserve_time({
                            reservation_id: reservation_save._id,
                            date: bookingDate.toLocaleDateString(),
                            time: bookingTime,
                            timezone: timezone,
                        }).save();
                        await reservation.updateOne(
                            { _id: reservation_save._id },
                            { $push: { reserve_time: reserve_time_save._id } }
                        );

                        var end_time_save = await new end_time({
                            reservation_id: reservation_save._id,
                            date: bookingDate.toLocaleDateString(),
                            time: endTime,
                            timezone: timezone,
                        }).save();
                        await reservation.updateOne(
                            { _id: reservation_save._id },
                            { $push: { end_time: end_time_save._id } }
                        );

                        res.status(200).json({
                            error: 0,
                            message: "table boked successfully",
                            data: null,
                        });
                    }
                });
            } else {
                var date = new Date(endTime);
                date.toString("MMM dd");
                res.status(500).json({
                    error: 1,
                    message: `only seats left for ${seatsAvailable} people at ${bookingDate} seats available after  ${date.toString("MMM dd")}`,
                    data: seatsAvailable,
                });
            }
        }
    }
});

module.exports = app;
