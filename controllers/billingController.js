const Billing = require('../models/billingModel')

exports.createBillingInfo = async(req,res) =>{
    const {Name, PhoneNo, Address, Town} = req.body
    try{
        const newBilling = await Billing.create({
            Name: Name,
            PhoneNo: PhoneNo,
            Address: Address,
            Town:Town
        })
        return res.status(200).json({message: "Success", newBilling})
    }
    catch(error){
        return res.status(500).json({message: "Something went wrong", error: error.message})
    }
}
exports.getBillingInfo = async(req,res)=>{
        const isAdmin = req.user._id && req.user.admin
        if (!isAdmin){
            return res.status(403).json({ message: 'Unauthorized: Only admin can access billing information.' });
        }
        try{
            const billingInfo = await Billing.find()
            if (billingInfo.length === 0){
                return res.status(404).json({ message: "No billing info found" });
            }
            return res.status(200).json({ message: 'Success', billingInfo });
        }
        catch(error){
            return res.status(500).json({message: "Something went wrong",error: error.message})
        }
    }
