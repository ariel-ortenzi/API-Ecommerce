import bcrypt from "bcrypt";

const SALT_ROUND = 10;

export async function createHash(password) {
    const hashPassword = await bcrypt.hash(
        password,
        bcrypt.genSaltSync(SALT_ROUND)
    );
    return hashPassword;
}

export async function verifyPassword(passowrd, hash) {
    const isPasswordCorrect  = await bcrypt.compare(passowrd, hash);
    return isPasswordCorrect;
    
}