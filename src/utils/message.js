const generateMessage = (text,username)=>{
    return {
        username: username,
        text: text,
        createdAt : new Date().getTime()
    }
}

const generateLocationURL = (locationURL,username)=>{
    return {
        username:username,
        locationURL: locationURL,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationURL
}