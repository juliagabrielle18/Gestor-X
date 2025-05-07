import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];

		if (!token) {
			return res.status(401).json({success:false, error: "Não autorizado - Token inválido" });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({success:false, error: "Não autorizado - Token inválido" });
		}
		const user = await User.findById(decoded.userId).select("-password");
		
		if(!user) {
			return res.status(404).json({success:false, error: "Usuário não encontrado!!!" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(500).json({success: false, message: "token error" });
	}
};

export default authMiddleware;
