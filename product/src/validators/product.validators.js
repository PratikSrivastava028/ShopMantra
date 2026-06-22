const { body, validationResult } = require('express-validator');


function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }
    next();
}

const createProductValidators = [
    body('title')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('title is required'),
    body('description')
        .optional()
        .isString()
        .withMessage('description must be a string')
        .trim()
        .isLength({ max: 500 })
        .withMessage('description max length is 500 characters'),
    body('priceAmount')
        .notEmpty()
        .withMessage('priceAmount is required')
        .bail()
        .isFloat({ gt: 0 })
        .withMessage('priceAmount must be a number > 0'),
    body('priceCurrency')
        .optional()
        .isIn([ 'USD', 'INR' ])
        .withMessage('priceCurrency must be USD or INR'),
        body('imageUrl')
        .custom((value, { req }) => {
            if (req.files && req.files.length > 0) {
                return true;
            }
            if (!value || !value.trim()) {
                throw new Error('imageUrl is required when no files are uploaded');
            }
            try {
                const url = new URL(value);
                if (url.protocol === 'http:' || url.protocol === 'https:') return true;
            } catch (_) {}
            throw new Error('imageUrl must be a valid HTTP or HTTPS URL');
        }),
    handleValidationErrors
];



module.exports = { createProductValidators };
