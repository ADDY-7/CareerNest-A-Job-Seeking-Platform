require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

/**
 * Seed Script – Populate MongoDB with sample data
 * Run: node seed.js
 * WARNING: Clears all existing data before seeding.
 */

const seedData = async () => {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@careernest.com',
        password: 'admin123',
        skills: ['Management', 'HR'],
        isAdmin: true,
    });
    console.log(`👤 Admin created: ${adminUser.email} / admin123`);

    // Create a regular user
    const regularUser = await User.create({
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'rahul123',
        skills: ['JavaScript', 'React', 'Node.js'],
        isAdmin: false,
    });
    console.log(`👤 Demo user created: ${regularUser.email} / rahul123`);

    // Sample jobs
    const jobs = [
        {
            title: 'Frontend Developer Intern',
            company: 'TechSpark Solutions',
            location: 'Bangalore',
            type: 'Internship',
            description:
                'Work with React.js to build modern user interfaces. Familiarity with hooks and REST APIs required.',
            salary: '₹15,000/month',
        },
        {
            title: 'Full Stack Developer',
            company: 'InnovateTech',
            location: 'Remote',
            type: 'Remote',
            description:
                'Build and maintain scalable web applications using MERN stack. 2+ years experience preferred.',
            salary: '₹8 LPA',
        },
        {
            title: 'Backend Engineer',
            company: 'CloudBase Inc.',
            location: 'Hyderabad',
            type: 'Full-time',
            description:
                'Design and develop RESTful APIs using Node.js and MongoDB. AWS knowledge is a plus.',
            salary: '₹10 LPA',
        },
        {
            title: 'Data Science Intern',
            company: 'DataMinds Analytics',
            location: 'Mumbai',
            type: 'Internship',
            description:
                'Assist in building ML models and data pipelines using Python, Pandas, and Scikit-learn.',
            salary: '₹20,000/month',
        },
        {
            title: 'UI/UX Designer',
            company: 'PixelCraft Studio',
            location: 'Pune',
            type: 'Full-time',
            description:
                'Create stunning user interfaces and wireframes using Figma. Portfolio required.',
            salary: '₹6 LPA',
        },
        {
            title: 'DevOps Engineer',
            company: 'SkyCloud Systems',
            location: 'Remote',
            type: 'Remote',
            description:
                'Manage CI/CD pipelines, Docker containers, and Kubernetes deployments on AWS.',
            salary: '₹14 LPA',
        },
        {
            title: 'Android Developer Intern',
            company: 'AppFactory',
            location: 'Chennai',
            type: 'Internship',
            description:
                'Develop Android applications using Kotlin/Java. Knowledge of Firebase is a plus.',
            salary: '₹12,000/month',
        },
        {
            title: 'Python Developer',
            company: 'AutomateHub',
            location: 'Delhi',
            type: 'Full-time',
            description:
                'Develop automation scripts and backend services using Python and Django/FastAPI.',
            salary: '₹7 LPA',
        },
        {
            title: 'Machine Learning Engineer',
            company: 'NeuralWave AI',
            location: 'Bangalore',
            type: 'Full-time',
            description:
                'Build and deploy NLP and Computer Vision models using TensorFlow and PyTorch.',
            salary: '₹18 LPA',
        },
        {
            title: 'Cloud Solutions Architect',
            company: 'Nimbus Tech',
            location: 'Remote',
            type: 'Remote',
            description:
                'Design cloud infrastructure on AWS/GCP. AWS Solutions Architect certification preferred.',
            salary: '₹25 LPA',
        },
    ];

    const createdJobs = await Job.insertMany(
        jobs.map((j) => ({ ...j, postedBy: adminUser._id }))
    );
    console.log(`💼 ${createdJobs.length} jobs seeded`);

    // Add a demo application for regular user
    await Application.create({
        userId: regularUser._id,
        jobId: createdJobs[0]._id,
        status: 'Shortlisted',
    });
    await Application.create({
        userId: regularUser._id,
        jobId: createdJobs[1]._id,
        status: 'Applied',
    });
    console.log('📝 Demo applications seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin  → admin@careernest.com   / admin123');
    console.log('User   → rahul@example.com       / rahul123');
    console.log('─────────────────────────────────');
    process.exit(0);
};

seedData().catch((err) => {
    console.error(err);
    process.exit(1);
});
