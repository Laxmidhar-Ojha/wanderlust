const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema }= require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

//index route
router.get("/", wrapAsync (async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}));

//new route
router.get("/new",isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs")
});

//show route
router.get("/:id", wrapAsync (async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist! ");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
  }));

//Create route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req,res)=>{
const newListing= new Listing(req.body.listing);
await newListing.save();
req.flash("success","New Listing Created!");
res.redirect("/listings");
}));


//Edit route
router.get("/:id/edit",isLoggedIn, wrapAsync ( async (req,res)=>{
let {id}=req.params;
const listing= await Listing.findById(id);
if(!listing){
    req.flash("error","Listing you requested for does not exist! ");
    res.redirect("/listings");
};
res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",isLoggedIn, validateListing, wrapAsync( async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash("success","Listing Upadated!");
res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn, wrapAsync( async(req,res)=>{
let {id}=req.params;
let deletedListing= await Listing.findByIdAndDelete(id);
req.flash("success","Listing Deleted!");
console.log(deletedListing);
res.redirect("/listings");
}));

module.exports=router;