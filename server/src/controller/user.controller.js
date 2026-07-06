import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";

const buildDataUri = (file) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  return `data:${file.mimetype};base64,${b64}`;
};

const uploadProfilePhoto = async (file) => {
  if (!file) return null;

  const dataURI = buildDataUri(file);

  const hasCloudinaryConfig =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinaryConfig) {
    return {
      url: dataURI,
      publicId: null,
    };
  }

  try {
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "Cravings678/profile",
      width: 500,
      height: 500,
      crop: "fill",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    return {
      url: dataURI,
      publicId: null,
    };
  }
};

export const EditUserProfile = async (req, res, next) => {
  try {
    const { fullName, phone, email } = req.body;
    const newPhoto = req.file;

    if (!fullName || !phone) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const authenticatedUser = req.user;
    if (!authenticatedUser) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    const existingUser = await User.findById(authenticatedUser._id);
    if (!existingUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (newPhoto) {
      const uploadedPhoto = await uploadProfilePhoto(newPhoto);
      existingUser.photo = {
        ...existingUser.photo,
        ...uploadedPhoto,
      };
    }

    existingUser.fullName = fullName;
    existingUser.phone = phone;

    if (email) {
      existingUser.email = email.toLowerCase();
    }

    await existingUser.save();

    res.status(200).json({ message: "User Updated Sucessfully", data: existingUser });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};