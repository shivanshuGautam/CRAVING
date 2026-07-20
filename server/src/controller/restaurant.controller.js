import Restaurant from "../models/restaurant.model.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  uploadSingleImage,
  deleteSingleImage,
} from "../utils/image.service.js";
import { normalizeRestaurantPayload } from "../utils/restaurantPayload.service.js";

export const RestaurantGetData = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const managerId = req.query.id;

    if (!managerId) {
      const error = new Error("Manager id is required");
      error.statusCode = 400;
      return next(error);
    }

    if (currentUser._id.toString() !== managerId) {
      const error = new Error("Unauthorized Access");
      error.statusCode = 401;
      return next(error);
    }

    const restaurantData = await Restaurant.findOne({ managerId });

    if (restaurantData) {
      res.status(200).json({
        message: "Restaurant Fetched Successfully",
        data: restaurantData,
      });
    } else {
      res.status(200).json({
        message: "No restaurant Data Found",
        data: {},
      });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const restaurantDataFromFE = req.body || {};
    const coverImageFromFE = req.files?.coverImage;
    const restaurantImagesFromFE = req.files?.restaurantImage;

    const normalizedData = normalizeRestaurantPayload(restaurantDataFromFE);

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const payload = {
        managerId: currentUser._id,
        ...normalizedData,
      };

      if (coverImageFromFE) {
        const coverImage = await uploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        payload.coverImage = coverImage;
      }

      if (restaurantImagesFromFE && restaurantImagesFromFE.length > 0) {
        const restaurantImage = await uploadMultipleImages(
          restaurantImagesFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        payload.restaurantImage = restaurantImage;
      }

      const newRestaurant = await Restaurant.create(payload);
      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    }

    if (coverImageFromFE) {
      if (existingRestaurant.coverImage?.publicId) {
        await deleteSingleImage(existingRestaurant.coverImage);
      }

      const coverImage = await uploadSingleImage(
        coverImageFromFE,
        `restaurant/${currentUser.phone}/coverPhoto`,
      );
      normalizedData.coverImage = coverImage;
    }

    if (restaurantImagesFromFE && restaurantImagesFromFE.length > 0) {
      if (existingRestaurant.restaurantImage?.length) {
        await deleteMultipleImages(existingRestaurant.restaurantImage);
      }

      const restaurantImage = await uploadMultipleImages(
        restaurantImagesFromFE,
        `restaurant/${currentUser.phone}/restaurantPhotos`,
      );
      normalizedData.restaurantImage = restaurantImage;
    }

    Object.assign(existingRestaurant, normalizedData);
    existingRestaurant.managerId = currentUser._id;
    await existingRestaurant.save();

    return res.status(200).json({
      message: "Restaurant profile updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};