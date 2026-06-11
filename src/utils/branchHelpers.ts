export const getBranchId = (entity: any): string => {
  if (entity == null) {
    return "";
  }

  if (typeof entity !== "object") {
    return String(entity);
  }

  return String(
    entity.branchId ??
    entity.branch?.id ??
    entity.branch?._id ??
    entity.branch?.branchId ??
    entity.branch?.branch_id ??
    entity.id ??
    entity._id ??
    ""
  );
};

export const getUserBranchId = (user: any): string => {
  if (!user) {
    return "";
  }

  return getBranchId(
    user.branchId ||
    user.branch ||
    user.branch?.id ||
    user.branch?._id ||
    user.branch?.branchId ||
    user
  );
};

export const getReservationBranchId = (reservation: any): string => {
  if (!reservation) {
    return "";
  }

  const reservationPayload =
    reservation.branch ||
    reservation.reservation?.branch ||
    reservation.reservation ||
    reservation;

  return getBranchId(reservationPayload);
};

export const extractArrayFromResponse = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const commonArrayKeys = [
    "reservations",
    "data",
    "results",
    "items",
    "payload",
    "branches",
    "orders",
    "users",
    "shifts"
  ];

  for (const key of commonArrayKeys) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  for (const value of Object.values(payload)) {
    const extracted = extractArrayFromResponse(value);
    if (Array.isArray(extracted)) {
      return extracted;
    }
  }

  return [];
};
