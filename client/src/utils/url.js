const rootURL = process.env.NODE_ENV === 'test' ? 'http://localhost:3000' : '/api';

export default rootURL;
