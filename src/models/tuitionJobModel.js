const { Schema, model } = require("mongoose");

const tuitionJobSchema = new Schema({
    tuitionCode: {
        type: String,
    },
    jobLocation: {
        type: String,
        required: [true, "Tuition location name is required"],
        minlength: [
            12,
            "The length of  tuition location can be minimum 12 character"
        ],
    },
    slug: {
        type: String,
        required: [true, "tuition location Slug is required"],
        lowercase: true,
        unique: true,
    },
    jobSalary: {
        type: Number,
        required: [true, "tuition Job salary is required"],
        trim: true,
        validate: {
            validator: (v) => v > 0,
            message: (props) =>
                `${props.value} is not a valid salary! salary must be greater than 0`,
        },
    },
    tutorGender: {
        type: String,
        required: [true, "Tuition Gender is required"],
    },
    medium: {
        type: String,
        required: [true, "Tuition Medium is required"],
    },
    jobCategory: {
        type: String,
        required: [true, "Tuition job category is required"],
    },
    perWeek: {
        type: Number,
        required: [true, "tuition Per Week is required"],
    },
    class: {
        type: String,
        required: [true, "tuition Class is required"],
    },
    subject: {
        type: String,
        required: [true, "tuition Subject is required"],
    },
    jobComment: {
        type: String,
    },
    duration: {
        type: String,
        required: [true, "tuition Duration is required"],
    },
    studentGender: {
        type: String,
        required: [true, "tuition Student Gender is required"],
    },
    studentSchool: {
        type: String,
    },
    fixedTime: {
        type: String,
        required: [true, "tuition Fixed Time is required"],
    },
    description: {
        type: String,
    },

}, { timestamps: true })


const TuitionJob = model("TuitionJobs", tuitionJobSchema)

module.exports = TuitionJob;