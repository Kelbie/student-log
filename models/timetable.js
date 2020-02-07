import ical from 'node-ical';

exports.fromURL = async function(url) {
  return await new Promise((resolve, reject) => {
    return ical.fromURL(url, {}, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
