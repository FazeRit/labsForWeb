import { validationResult } from "express-validator";

import TextService from "../service/textService.js";

export default class TextController {
    static async getData(req, res, next){
        try{
            const data = await TextService.getData();

            return res.status(200).json({data});
        }catch(err){    
            next(err);
        }
    }

    static async addData(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const { text, padding, animationDuration, mainColor } = req.body;
    
            const data = await TextService.addData(text, padding, animationDuration, mainColor);
    
            return res.status(200).json({ message: 'Data updated successfully', data });
        } catch (err) {
            next(err);
        }
    }    

    static async deleteData(req, res, next){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }   
            const {id} = req.params;

            await TextService.deleteData(id);
            
            return res.status(200).json('Text deleted');
        }catch(err){
            next(err);
        }
    }
}
