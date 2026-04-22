import config from '../config.json';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crpto from 'crypto';
import {  Op } from 'sequelize';
import sendEmail from '../_helpers/send-email';
import db from '../_helpers/db';
import role from '../_helpers/role';

export default {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword, 
    getALl,
    getById,
    create,
    update,
    delete: _delete
};