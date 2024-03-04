const User = require('../models/User')

//@desc Get all users
//@route GET /api/v1/users
//@access Private
exports.getUsers= async (req,res,next)=>{
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
    
    query = User.find(JSON.parse(queryStr)).populate('mybookings');

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
    const total = await User.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Excuting query
    try {
        const users = await query;
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

        res.status(200).json({seccess:true,count:users.length,pageination,data:users});
    } catch (err) {
        console.log(err)
        return res.status(400).json({seccess:false});        
    }
}

//@desc Get single user
//@route GET /api/v1/users/:id
//@access Public
exports.getUser= async (req,res,next)=>{
    try {
        console.log(req.params.id)
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({seccess:false});
        }
        return res.status(200).json({seccess:true,data:user});
    } catch (err) {
        return res.status(400).json({seccess:false});
    }
}

//@desc Update user
//@route PUT /api/v1/users/:id
//@access Private
exports.updateUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);
        console.log(user);
        if (!user) {
            return res.status(404).json({
                success: false,
                massage: `No user with the id of ${req.params.id}`
            });
        }

        //Make sure user is the user owner
        if (user._id.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                // userId:user._id.toString(),
                // TokenId:req.user.id,
                massage: `User ${req.user.id} is not authorized to update this user`
            });
        }

        // If the user is not an admin, can not update his role.
        if (req.user.role !== 'admin' && req.body.role) {
            return res.status(401).json({
                success: false,
                massage: `Only admin can update role`
            });
        }

        user = await User.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Cannot update User"
        });
    }
};

//@desc Delete single hotel
//@route DELETE /api/v1/users/:id
//@access Private
exports.deleteUser= async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success:false,
                massage:`No user with the id of ${req.params.id}`});
        }
        //Make sure user is the user owner
        if (user._id.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                // userId:user._id.toString(),
                // TokenId:req.user.id,
                massage: `User ${req.user.id} is not authorized to delete this user`
            });
        }
        await user.deleteOne();
        res.status(200).json({seccess:true,data:{}});
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            seccess:false,
            message:"Cannot dalete User"
        });
    }
}

