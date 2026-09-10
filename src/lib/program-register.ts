export const ALREADY_REGISTERED_MESSAGE = "You're already registered";
export const FULLY_BOOKED_MESSAGE = "Fully Booked";

export function registrationSuccessMessage(title: string) {
  return `Your registration for ${title} has been successfully completed.`;
}
