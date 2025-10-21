import Swal from 'sweetalert2';

export const useAuthAlert = () => {
    const showUnauthorizedAlert = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: 'You must be logged in to access this page.',
            confirmButtonText: 'Go to Login',
            confirmButtonColor: '#3B82F6',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
    };

    const showSessionExpiredAlert = () => {
        Swal.fire({
            icon: 'info',
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
            confirmButtonText: 'Go to Login',
            confirmButtonColor: '#3B82F6',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
    };

    const showLogoutConfirmation = () => {
        return Swal.fire({
            icon: 'question',
            title: 'Confirm Logout',
            text: 'Are you sure you want to log out?',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280'
        });
    };

    const showLogoutSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            timer: 1500,
            showConfirmButton: false
        });
    };

    return {
        showUnauthorizedAlert,
        showSessionExpiredAlert,
        showLogoutConfirmation,
        showLogoutSuccess
    };
};