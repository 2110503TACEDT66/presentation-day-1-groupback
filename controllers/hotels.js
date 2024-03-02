const Hotel = require('../models/Hotel')
//@desc Get all hotels
//@route GET /api/v1/hotels
//@access Public
exports.getHotels= async (req,res,next)=>{
    let query;

    //Copy req.query
    const reqQuery={...req.query};

    //Fields to exclude 
    const removeFields=['select','sort','page','limit'];

    //loop over remove field and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    
    query = Hotel.find(JSON.parse(queryStr)).populate('bookings');

    //Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query=query.select(fields)
    }

    //Select Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    }else{
        query = query.sort('name');
    }

    //Pageination
    const page = parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query.limit,10)||25

    const startIndex = (page-1)*limit;
    const endIndex = page * limit;
    const total = await Hotel.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Excuting query
    try {
        const hotels = await query;
        //Pageination result
        const pageination = {};
        if (endIndex<total) {
            pageination.next={
                page:page+1,
                limit
            }
        }
        if (startIndex>0) {
            pageination.prev={
                page:page-1,
                limit
            }
        }

        res.status(200).json({seccess:true,count:hotels.length,pageination,data:hotels});
    } catch (err) {
        res.status(400).json({seccess:false});        
    }
}

//@desc Get single hotel
//@route GET /api/v1/hotels/:id
//@access Public
exports.getHotel= async (req,res,next)=>{
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            res.status(400).json({seccess:false});
        }
        res.status(200).json({seccess:true,data:hotel});
    } catch (err) {
        res.status(400).json({seccess:false});
        
    }
}

//@desc Create a hotel
//@route POST /api/v1/hotels
//@access Private
exports.createHotels= async (req,res,next)=>{
    const hotel = await Hotel.create(req.body);
    res.status(201).json({
        success:true,
        data:hotel
    })
}

//@desc Update single hotel
//@route PUT /api/v1/hotels/:id
//@access Private
exports.updateHotel= async (req,res,next)=>{
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators:true
        });
        if (!hotel) {
            res.status(400).json({seccess:false});
        }
        res.status(200).json({seccess:true,data:hotel});
    } catch (err) {
        res.status(400).json({seccess:false});
    }
}

//@desc Delete single hotel
//@route DELETE /api/v1/hotels/:id
//@access Private
exports.deleteHotel= async(req,res,next)=>{
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            res.status(400).json({seccess:false});
        }

        await hotel.deleteOne();
        res.status(200).json({seccess:true,data:{}});
    } catch (err) {
        res.status(400).json({seccess:false});
    }
}