import ical from "node-ical";

exports.fromURL = async function(url) {
    return await new Promise((resolve, reject) => {
        return ical.fromURL(
            "https://timetables.rgu.ac.uk/iCal/ical/ical/QF2DXRCL547645/schedule.ics",
            {},
            function(err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            }
        );
    });
}