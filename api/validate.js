module.exports = function (decoded, request, callback) {
    // console.log("Validate!!!!!=======");
    console.log(decoded);
    console.log(request.route.fingerprint);
    // request.route.method for the method asked for
    // TODO: Look into what is in decoded & request
    // query the database for the user
    return callback(null, true);
};
