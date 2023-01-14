declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TFL_API_KEY: string;
      NODE_ENV: 'test' | 'development' | 'production';
      PORT: number;
    }
  }
}

export { }
