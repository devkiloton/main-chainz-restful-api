// Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one special character
export const STRONG_PASSWORD = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[^\w\d\s]).{8,}$/;
