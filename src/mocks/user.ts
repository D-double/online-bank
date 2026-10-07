export const mockUser = {
  firstName: 'Aziz',
  lastName: 'Karimov',
  phone: '901234567',
} as const;

export const mockUserFullName = `${mockUser.firstName} ${mockUser.lastName}`.toUpperCase();
