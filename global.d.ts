namespace NodeJS {
    interface ProcessEnv {
        PORT: number,
        DATABASE_URL: string,
        DATABASE_AUTH_TOKEN: string,
        CLOUDINARY_CLOUD_NAME: string,
        CLOUDINARY_API_KEY: string,
        CLOUDINARY_API_SECRET: string,
        JWT_SECRET: string
    }
}