/**
 * Redirection logic based on user role
 */
export const getDashboardRoute = (role) => {
    switch (role) {
        case 'FOOD_PROVIDER':
            return '/seller/dashboard';
        case 'BUYER':
            return '/buyer/dashboard';
        case 'VOLUNTEER':
            return '/volunteer/dashboard';
        case 'ADMIN':
            return '/admin/dashboard';
        default:
            return '/dashboard';
    }
};
