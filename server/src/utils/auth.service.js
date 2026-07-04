import Jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const genToken = async (user) => {
  try {
    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = Jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.cookie("Oreo", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};
