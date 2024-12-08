import { Router } from 'express';

import {body, param} from 'express-validator';

import TextController from '../controller/textController.js';

const router = Router();

router.get('/', TextController.getData);    

router.post(
    '/add',
    [
        body('text')
            .exists().withMessage('Text field is required')
            .notEmpty().withMessage('Text cannot be empty')
            .isString().withMessage('Text must be a string')
            .isLength({ max: 40 }).withMessage('Text must be maximum 100 characters long'),

        body('padding')
            .exists().withMessage('Padding field is required')
            .isInt({ min: 0 }).withMessage('Padding must be a non-negative integer'),

        body('animationDuration')
            .exists().withMessage('Animation duration field is required')
            .isFloat({ min: 0 }).withMessage('Animation duration must be a non-negative number'),

        body('mainColor')
            .exists().withMessage('Main color field is required')
            .isString().withMessage('Main color must be a string')
            .matches(/^#[0-9A-F]{6}$/i).withMessage('Main color must be a valid HEX color'),
    ],
    TextController.addData
);  

router.delete('/delete/:id',
    [
        param('id')
            .exists().withMessage('Id field is required')
            .notEmpty().withMessage('Id cannot be empty')
            .isString().withMessage('Id must be a string'),
    ],
     TextController.deleteData);

export default router;