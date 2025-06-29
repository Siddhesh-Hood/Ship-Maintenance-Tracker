
export const hasPermission = (userRole, requiredPermission) => {
  const permissions = {
    Admin: ['create', 'read', 'update', 'delete', 'manage_users'],
    Inspector: ['read', 'create_inspection', 'update_inspection'],
    Engineer: ['read', 'update_job_status', 'create_maintenance_report']
  };

  return permissions[userRole]?.includes(requiredPermission) || false;
};

export const canManageShips = (userRole) => {
  return ['Admin'].includes(userRole);
};

export const canCreateJobs = (userRole) => {
  return ['Admin', 'Inspector', 'Engineer'].includes(userRole);
};

export const canUpdateJobStatus = (userRole) => {
  return ['Admin', 'Engineer'].includes(userRole);
};

export const canDeleteEntities = (userRole) => {
  return ['Admin'].includes(userRole);
};

export const getRoleColor = (role) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800';
    case 'Inspector':
      return 'bg-blue-100 text-blue-800';
    case 'Engineer':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
