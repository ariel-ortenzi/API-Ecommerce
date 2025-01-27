import { generateToken } from "../utils/jwt.js";

export class AuthController {
    static async login(req, res) {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const payload = {
            email: req.user.email,
            role: req.user.role,
        };

        const token = generateToken(payload);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 2,
        });

        return res.status(200).json({ message: "Login successful", token });
    }

    static async register(req, res) {
        res.json(req.user);
    }

    static async current(req, res) {
        res.json(req.user)
    }
}