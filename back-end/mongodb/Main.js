const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/Railway-DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
module.exports=mongoose
