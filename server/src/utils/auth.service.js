import Jwt from "jsonwebtoken";

export const genToken = async (user, res) => {
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
      secure: false,
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};
