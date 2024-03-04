import * as bcrypt from 'bcryptjs';
import { encryptPassword, comparePasswords } from '../page/Encrpyt';

jest.mock('bcryptjs');

describe('Password utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('encrypts a password', async () => {
    const testPassword = 'testPassword';
    const hashedPassword = 'hashedPassword';

    bcrypt.hash.mockResolvedValueOnce(hashedPassword);

    const result = await encryptPassword(testPassword);
    expect(bcrypt.hash).toHaveBeenCalledWith(testPassword, 10);
    expect(result).toBe(hashedPassword);
  });

  it('compares passwords', async () => {
    const plainPassword = 'testPassword';
    const hashedPassword = 'hashedPassword';

    bcrypt.compare.mockResolvedValueOnce(true);

    const isMatch = await comparePasswords(plainPassword, hashedPassword);
    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });
});
