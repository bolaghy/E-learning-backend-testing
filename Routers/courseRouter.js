const router = require('express').Router()
const {roleMiddleware, authMiddleware} = require('../Middleware/authMiddleware')
const {getAllCourses, createCourse, getSingleCourse, updateACourse, deleteACourse,
    addLesson , enrollStudent } = require('../Controllers/course')
const {countTotalCourses, countInstructorCourses} = require('../Controllers/analystController')



router.route(`/`).get(authMiddleware, getAllCourses)
router.route(`/:id`).get(authMiddleware, getSingleCourse)
router.post('/create-course', authMiddleware, roleMiddleware(["instructor"]), createCourse)
router.post('/enroll/:courseId', authMiddleware, roleMiddleware(["instructor"]), enrollStudent)
router.post('/add-lesson/:courseId', authMiddleware, roleMiddleware(["instructor"]), addLesson)
router.delete('/delete/:Id', authMiddleware, roleMiddleware(["instructor"]), deleteACourse)
router.put('/update/:Id',authMiddleware, roleMiddleware(["instructor"]),updateACourse)

router.get('/count-all-courses', countTotalCourses);                  
router.get('/count-all-instructor-courses', countInstructorCourses);   

   
module.exports = router   