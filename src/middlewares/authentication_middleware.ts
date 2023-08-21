import { Request, Response, NextFunction } from 'express';
import responses from "../utils/responses";
import commonUtils from "../utils/commonUtils";
import logger from '../logger/logger';

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies['access_token'];
    if (token == null) {
        console.log('Token missing from headers')
        logger.error(`Token missing from headers`);
        return res.status(responses.CODE_SUCCESS).send(responses.get_response_object(
            responses.CODE_UNAUTHORIZED_ACCESS, null, responses.MESSAGE_UNAUTHORIZED_ACCESS
        ))
    }
    let verified_token = await commonUtils.verify_jwt_token(token);
    if (verified_token["code"] != 200){
        return res.status(responses.CODE_SUCCESS).send(responses.get_response_object(
            responses.CODE_UNAUTHORIZED_ACCESS, null, responses.MESSAGE_UNAUTHORIZED_ACCESS
        ))
    }
   
    req['user'] = verified_token["user"]
    next()
}

export default authenticateToken;
