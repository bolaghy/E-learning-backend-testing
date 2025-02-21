const Course = require('../Models/course')



const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
        res.status(200).json({success: true, courses})
    } catch (error) {
        res.status(400).json({success: false, error})
    }
}
const getSingleCourse = async (req, res) => {
    try { 
        const singleCourse = await Course.findById(req.params.Id)
        if(!singleCourse){
            return res.status(400).json({sucess: false, msg: 'course not found'})
        }else{
            return res.status(200).json({suceess: true, singleCourse})
        }
    } catch (error) {
        res.status(400).json({success: false, error})
    }
}


const createCourse = async (req, res) =>{
    try { 
        const createCourse = await Course.create(req.body) 
        res.status(200).json({success: true, createCourse})
    } catch (error) {
        res.status(400).json({success: false, error})   
    }
}

const updateACourse = async (req, res) =>{
    try { 
        const updateCourse = await Course.findByIdAndUpdate(req.params.Id, req.body,{
            new: true,
            runValidators: true
        });
        if(!updateCourse){
            return res.status(400).json({sucess: false, msg: 'course not found'})
        }else{
            return res.status(200).json({success: true, updateCourse})
        }
    } catch (error) {
        res.status(400).json({success: false, error})   
    }
}

const deleteACourse = async (req, res) =>{
    try { 
        const deleteCourse = await Course.findByIdAndDelete(req.params.Id)
        if(!deleteCourse){
            return res.status(400).json({success: false, msg: 'course not found'})
        }else{
            return res.status(200).json({success: true, deleteCourse})
        }
    } catch (error) {
        res.status(400).json({success: false, error})   
    }
}


  
  

module.exports = {getAllCourses, createCourse, getSingleCourse, 
                             updateACourse, deleteACourse,}