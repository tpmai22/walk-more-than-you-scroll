/**
 * @typedef {Object} DayStats
 * @property {number} totalDistance
 * @property {Object.<string, {distance: number}>} domains
 */

const stats = {
  getTotalDistance: async (date = new Date().toLocaleDateString()) => {
    const dayStats = await stats.getDayStats(date);
    return dayStats.totalDistance;
  },

  getDomainDistance: async (domain, date = new Date().toLocaleDateString()) => {
    const dayStats = await stats.getDayStats(date);
    return dayStats.domains[domain]?.distance || 0;
  },

  getTodayStats: async () => {
    const date = new Date().toLocaleDateString();
    return stats.getDayStats(date);
  },

  updateDistance: async (domain, distance) => {
    const date = new Date().toLocaleDateString();
    const dayStats = await stats.getDayStats(date);

    dayStats.totalDistance += distance;
    dayStats.domains[domain] = {
      distance: (dayStats.domains?.[domain]?.distance || 0) + distance,
    };

    return stats.updateDayStats(date, dayStats);
  },

  getWeeklyStats: async () => {
    const today = new Date();
    const { days } = await chrome.storage.local.get(['days']);
    let week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const scrollDistance = days[date.toLocaleDateString()]?.totalDistance || 0;
      week.push({
        distance: scrollDistance,
        date: date.toLocaleDateString(),
        day: date.getDay(),
      });
      if (date.getDay() === 0) break;
    }

    while (week.length < 7) {
      week.splice(0, 0, 0);
    }

    return week.reverse();
  },

  /** @type {(date: string) => Promise<DayStats>} */
  getDayStats: async (date) => {
    const { days } = await chrome.storage.local.get(['days']);
    if (!days[date]) {
      days[date] = {
        totalDistance: 0,
        domains: {},
      };
      await chrome.storage.local.set({ days });
    }
    return days[date];
  },

  /**  @type {(date: string, dayStats: DayStats) => Promise<void>} */
  updateDayStats: async (date, dayStats) => {
    const { days } = await chrome.storage.local.get(['days']);
    days[date] = dayStats;
    return chrome.storage.local.set({ days });
  },
};
