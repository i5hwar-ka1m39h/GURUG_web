"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToken = exports.KEY = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//the key to site
exports.KEY = "this_is_the_key";
//authorization 
const handleToken = (req, res, next) => {
    const authHead = req.headers.authorization;
    //if authHead then this code
    if (authHead) {
        //split the token from bearer
        const token = authHead.split(" ")[1];
        jsonwebtoken_1.default.verify(token, exports.KEY, (err, payload) => {
            if (err) {
                return res.sendStatus(403); //understand the request but won't give a shit
            }
            if (!payload) {
                return res.sendStatus(403);
            }
            if (typeof payload === 'string') {
                return res.sendStatus(403);
            }
            req.headers["userID"] = payload._id;
            next();
        });
    }
    //if not authHead this send 401:unathorized
    else {
        return res.sendStatus(401);
    }
};
exports.handleToken = handleToken;
