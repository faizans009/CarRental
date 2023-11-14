const RentalInfo = require('../models/rentalInfoModel')

exports.createRentalInfo = async(req,res) => {
    const {pickupLocation, pickupDate, pickupTime, dropOffLocation, dropOffDate,dropOffTime} = req.body;
    try{
        const newRentalInfo  = await RentalInfo.create({
            Pickup:{
                location: pickupLocation,
                date: pickupDate,
                time: pickupTime
            },
            DropOff:{
                location: dropOffLocation,
                date: dropOffDate,
                time: dropOffTime
            }
        })
        return res.status(200).json({message: "Success",newRentalInfo})
    }
    catch(error){
        return res.status(500).json({message: "Something went wrong",error: error.message})
    }

}

exports.getRentalInfo = async(req,res)=>{
    const isAdmin = req.user._id && req.user.admin
    if (!isAdmin){
        return res.status(403).json({ message: 'Unauthorized: Only admin can access Rental information.' });
    }
    try{
        const newRentalInfo = await RentalInfo.find()
        if (newRentalInfo.length === 0){
            return res.status(404).json({ message: "No Rental info found" });
        }
        return res.status(200).json({ message: 'Success', newRentalInfo });
    }
    catch(error){
        return res.status(500).json({message: "Something went wrong",error: error.message})
    }
}
