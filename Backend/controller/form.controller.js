import Forms from '../models/FormModel.js';
import User from '../models/SignupModel.js';

// Create a new form
export const createForm = async (req, res) => {
    try {
        const {
            title, description, formType, targetAudience, departments,
            companyName, jobDescription, salaryPackage, location,
            hackathonPlace, testName, testTimeLocation, testLink
        } = req.body;
        if (!formType) {
            return res.status(400).json({ message: 'Form type is required' });
        }

        if (targetAudience === 'specific' && (!departments || departments.length === 0)) {
            return res.status(400).json({ message: 'Departments are required for specific target audience' });
        }
        if (formType === 'interview' && !companyName) {
            return res.status(400).json({ message: 'Company name is required for interview forms' });
        }

        if (formType === 'hackathon' && (!companyName || !hackathonPlace)) {
            return res.status(400).json({ message: 'Company name and venue are required for hackathon forms' });
        }

        if (formType === 'test' && (!testName || !testTimeLocation)) {
            return res.status(400).json({ message: 'Test name and time/location are required for test forms' });
        }

        // Create the form
        const newForm = new Forms({
            title,
            description, // Now used for all form types
            formType,
            targetAudience,
            departments: targetAudience === 'specific' ? departments : [],
            companyName,
            jobDescription,
            salaryPackage,
            location,
            hackathonPlace,
            testName,
            testTimeLocation,
            testLink,
            createdBy: req.user._id
        });

        const savedForm = await newForm.save();

        res.status(201).json(savedForm);
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all forms (admin access)
export const getAllForms = async (req, res) => {
    try {
        const forms = await Forms.find({})
            .sort({ createdAt: -1 });

        res.status(200).json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get a single form by ID
export const getFormById = async (req, res) => {
    try {
        const form = await Forms.findById(req.params.id);

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        if (!req.user.isAdmin) {
            const userCanAccessForm =
                form.targetAudience === 'all' ||
                (form.departments.includes(req.user.course));

            if (!userCanAccessForm) {
                return res.status(403).json({ message: 'You do not have permission to access this form' });
            }
        }

        res.status(200).json(form);
    } catch (error) {
        console.error('Error fetching form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update a form
export const updateForm = async (req, res) => {
    try {
        const form = await Forms.findById(req.params.id);

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        const allowedUpdates = [
            'title', 'description', 'formType', 'targetAudience', 'departments',
            'companyName', 'jobDescription', 'salaryPackage', 'location',
            'hackathonPlace', 'testName', 'testTimeLocation', 'testLink', 'status'
        ];

        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        Object.assign(form, updates);
        form.updatedAt = Date.now();

        const updatedForm = await form.save();

        res.status(200).json(updatedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete a form (soft delete)
export const deleteForm = async (req, res) => {
    try {
        await Forms.deleteOne({ _id: req.body.id });

        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getFormStudents = async (req, res) => {
    try {
        const { formId } = req.params;
        const form = await Forms.findById(formId);

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        if (!form.interestedStudents || form.interestedStudents.length === 0) {
            return res.status(200).json({ students: [] });
        }

        const students = await User.find(
            { _id: { $in: form.interestedStudents } },
            {
                password: 0,
                resetPasswordToken: 0,
                resetPasswordExpire: 0,
                appliedForms: 0,
                isAdmin: 0,
                isPC: 0,
                createdAt: 0,
                updatedAt: 0
            }
        ).lean();

        res.status(200).json({
            count: students.length,
            students: students
        });

    } catch (error) {
        console.error('Error fetching form applicants:', error);
        res.status(500).json({
            message: 'Server error. Could not fetch student details.',
            error: error.message
        });
    }
};