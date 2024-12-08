import prisma from '../db/db.js';   
import { ApiError } from '../errors/apiError.js';

export default class TextService {
    static async getData() {
        const text = await prisma.text.findFirst()
        return text;
    }

    static async addData(text = '', padding = 0, animationDuration = 0, mainColor = '') {
        const existingData = await prisma.text.findFirst();

        if (existingData) {
            return await prisma.text.update({
                where: { id: existingData.id },
                data: {
                    text,
                    padding,
                    animationDuration,
                    mainColor,
                },
            });
        } else {
            return await prisma.text.create({
                data: {
                    text,
                    padding,
                    animationDuration,
                    mainColor,
                },
            });
        }
    }

    static async deleteData(id) {
        const text = await prisma.text.findUnique({ where: { id: parseInt(id, 10) } });
        if (!text) {
            throw ApiError.BadRequestError('Text not found');
        }
        await prisma.text.delete({ where: { id: parseInt(id, 10) } });

        return true;
    }
}