export const ROLES = {
  PUBLIC: 'public',
  CLIENT: 'client',
  ADMIN: 'admin',
  STAFF: 'staff',
  SUPER_ADMIN: 'super_admin',
} as const;

export const ROLE_LABELS = {
  public: 'Vista publica',
  client: 'Portal cliente',
  admin: 'Admin del negocio',
  staff: 'Staff operativo',
  super_admin: 'Digital Atlas',
} as const;
