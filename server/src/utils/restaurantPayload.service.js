const parseBooleanValue = (value) => {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(normalizedValue)) {
      return true;
    }
    if (["false", "0", "no", "n", "off", ""].includes(normalizedValue)) {
      return false;
    }
  }

  return Boolean(value);
};

const parseArrayValue = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value);
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

export const normalizeRestaurantPayload = (input = {}) => {
  const payload = { ...input };
  const cuisineTypes = parseArrayValue(payload.cuisineTypes);
  const socialMediaLinks = parseArrayValue(payload.socialMediaLinks);

  return {
    ...payload,
    restaurantName: payload.restaurantName || "",
    address: payload.address || "",
    city: payload.city || "",
    state: payload.state || "",
    pinCode: payload.pinCode || "",
    country: payload.country || "",
    description: payload.description || "",
    restaurantType: payload.restaurantType || "both",
    cuisineTypes,
    isOpen: parseBooleanValue(payload.isOpen),
    contactDetails: {
      email: payload.contactEmail || payload.contactDetails?.email || "",
      phone: payload.contactPhone || payload.contactDetails?.phone || "",
    },
    servingHours: {
      openingTime: payload.openingTime || payload.servingHours?.openingTime || "",
      closingTime: payload.closingTime || payload.servingHours?.closingTime || "",
    },
    geoLocation: {
      lat: payload.geoLat || payload.geoLocation?.lat || "",
      lon: payload.geoLon || payload.geoLocation?.lon || "",
    },
    documents: {
      legalName: payload.legalName || payload.documents?.legalName || "",
      companyType: payload.companyType || payload.documents?.companyType || "",
      gstCertificate: payload.gstCertificate || payload.documents?.gstCertificate || "",
      fssaiCertificate: payload.fssai || payload.documents?.fssaiCertificate || "",
      panCard: payload.panCard || payload.documents?.panCard || "",
    },
    financialDetails: {
      bankName: payload.bankName || payload.financialDetails?.bankName || "",
      accountNumber:
        payload.accountNumber || payload.financialDetails?.accountNumber || "",
      ifscCode: payload.ifscCode || payload.financialDetails?.ifscCode || "",
    },
    socialMediaLinks,
  };
};
