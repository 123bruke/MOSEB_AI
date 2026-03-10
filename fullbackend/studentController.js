import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc   Get all students
// @route  GET /api/students
// @access Private (admin or authenticated)
export const getStudents = asyncHandler(async(req, res) => {
    const students = await User.find().select('-password');
    res.json(students);
});

// @desc   Get single student by id
// @route  GET /api/students/:id
// @access Private
export const getStudentById = asyncHandler(async(req, res) => {
    const student = await User.findById(req.params.id).select('-password');
    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc   Update student profile
// @route  PUT /api/students/:id
// @access Private
export const updateStudent = asyncHandler(async(req, res) => {
    const student = await User.findById(req.params.id);

    if (student) {
        student.name = req.body.name || student.name;
        student.email = req.body.email || student.email;
        if (req.body.password) student.password = req.body.password;

        const updatedStudent = await student.save();
        res.json({
            _id: updatedStudent._id,
            name: updatedStudent.name,
            email: updatedStudent.email,
        });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc   Delete student
// @route  DELETE /api/students/:id
// @access Private
export const deleteStudent = asyncHandler(async(req, res) => {
    const student = await User.findById(req.params.id);
    if (student) {
        await student.remove();
        res.json({ message: 'Student removed' });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});