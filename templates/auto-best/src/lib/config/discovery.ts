/** Shared input policy; inventory choices are derived from the actual records. */
export const minimumVehicleYear = 1900;
export const maximumVehicleYear = (now = new Date()) => now.getFullYear() + 1;
