import bcrypt from 'bcryptjs';
import config from '../config/config';
import responses from './responses';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

require('dotenv').config()
const { ACCESS_TOKEN_SECRET_KEY, FROM, PASS } = process.env;

let commonUtils = {
    encrypt_password: async (password: string): Promise<any> => {
        const salt: string = await bcrypt.genSalt(config["SALT_WORK_FACTOR"]);
        const hashed_password: string = bcrypt.hashSync(password, salt);
        return [hashed_password, salt];
    },
    compare_password: async (input_password: string, user_password: string): Promise<any> => {
        return await bcrypt.compare(input_password, user_password).catch((err) => false);
    },
    create_jwt_token: async (data: Object | any): Promise<any> => {
        let access_token_secret_key: string = ACCESS_TOKEN_SECRET_KEY || "";
        return jwt.sign(data, access_token_secret_key);
    },
    verify_jwt_token: async (token: string): Promise<any> => {
        let access_token_secret_key: string = ACCESS_TOKEN_SECRET_KEY || "";
        return jwt.verify(token, access_token_secret_key, (err: String | any, user: Object | any) => {
            if (err) {
                console.log(err);
                return {code: 401, user: null};
            }
            else {
                return {code: 200, user: user};
            }
        });
    },
    validate_data: async (body: any): Promise<any> => {
        const schema = Joi.object({
            password: Joi.string().regex(RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,50}$')),
            email_address: Joi.string().email().trim(),
            image: Joi.string().uri().allow(...['', ' ']),
            token: Joi.string(),
            name: Joi.string(),
            gender: Joi.object({
                id: Joi.number(),
                name: Joi.string()
            }),
            id: Joi.string().hex().length(24),
            uid: Joi.string().uuid()
        });
        return schema.validate(body);
    },
}

export default commonUtils;
