const mistriModel = require("../models/mistri.model")


const userSearchController = async (req, res) => {
    const Data  = req.body;
    console.log(Data.query);
    const mistri = await mistriModel.find({ profession: Data.query }).select("-password -email");
    if (mistri) {
        res.status(200).json({mistri,message:"success"});

    }else{
        res.status(200).json({ message: "No mistri found" });
    }
}

module.exports = userSearchController;