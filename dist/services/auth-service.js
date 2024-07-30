"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const User_1 = __importDefault(require("../models/User"));
const registerUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.default({ email, password: bcryptjs_1.default.hashSync(password, 10) });
    yield user.save();
    return user;
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email });
    if (user && bcryptjs_1.default.compareSync(password, user.password)) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET);
        return { user, token };
    }
    throw new Error('Invalid email or password');
});
exports.loginUser = loginUser;
