const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(
            "This should be here", 
            { useNewUrlParser: true}
        );
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.error(err)
    }
}

module.exports = { connect };