const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // cities: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'City'
    // }]
});



module.exports = mongoose.model("indian-states-cities", stateSchema)
// const State = mongoose.model('indian-states-cities', stateSchema);
// module.exports = State;
