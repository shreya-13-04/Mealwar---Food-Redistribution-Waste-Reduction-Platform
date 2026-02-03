/**
 * Helper function to calculate time remaining
 * @param {Date|string} createdAt - The creation date of the listing
 * @returns {Object} { hours, minutes, expired }
 */
export const getTimeRemaining = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursElapsed = (now - created) / (1000 * 60 * 60);
    const hoursRemaining = 4 - hoursElapsed; // 4 hour safety window

    if (hoursRemaining <= 0) return { hours: 0, minutes: 0, expired: true };

    const hours = Math.floor(hoursRemaining);
    const minutes = Math.floor((hoursRemaining - hours) * 60);

    return { hours, minutes, expired: false };
};

/**
 * Helper function to get safety level string
 * @param {Date|string} createdAt - The creation date of the listing
 * @returns {string} 'expired' | 'safe' | 'warning' | 'critical'
 */
export const getSafetyLevel = (createdAt) => {
    const remaining = getTimeRemaining(createdAt);
    if (remaining.expired) return 'expired';

    const totalMinutes = remaining.hours * 60 + remaining.minutes;
    if (totalMinutes > 180) return 'safe'; // > 3 hours
    if (totalMinutes > 60) return 'warning'; // 1-3 hours
    return 'critical'; // < 1 hour
};
