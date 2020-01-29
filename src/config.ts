export const EXPRESS_PORT: number = 3000;

export const DB_HOST: string = "localhost";
export const DB_PORT: number = 27017;
export const DB_NAME: string = "froged";
export const DB: string = process.env.MONGODB_URI ||`mongodb://localhost:27017/froged`;
