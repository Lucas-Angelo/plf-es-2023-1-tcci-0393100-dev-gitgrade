const apiUrl = import.meta.env.VITE_API_URL;
const defaultApiUrl = 'http://localhost:3001';

if (!apiUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    `-- Missing enviroment variable VITE_API_URL: defaulted to ${defaultApiUrl} --`
  );
}

const env = {
  apiUrl: apiUrl ?? defaultApiUrl,
};

export default env;
