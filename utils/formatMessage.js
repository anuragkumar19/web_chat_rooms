module.exports = function (msg, user) {
    return {
        user,
        time: new Date(),
        text: msg.trim(),
    };
};
