// file: api/auth.ts
import { dummyUsers } from './dummyUsers';

export const login = async (email: string, password: string) => {
  const user = dummyUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    return {
      data: {
        message: 'Login successful',
        user: {
          email: user.email,
          name: user.name,
        },
      },
    };
  } else {
    throw new Error('Invalid credentials');
  }
};
