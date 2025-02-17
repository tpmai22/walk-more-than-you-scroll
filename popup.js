/* global pixelToMeter, stats */

const header_elem = $('#header');
const stats_elem = $('#stats');

stats.getTodayStats().then(({ totalDistance, domains }) => {
  updateDistance(totalDistance);

  const stats = Object.entries(domains);
  const top3 = stats.sort(([, { distance: a }], [, { distance: b }]) => b - a).slice(0, 3);
  updateScrollDistances(top3);
});

function updateScrollDistances(scrollDistances) {
  scrollDistances.forEach(([domain, { distance }]) => {
    const distanceInMeter = pixelToMeter(distance);
    const li = $('<li></li>');
    li.text(`${domain}: ${distanceInMeter}m`);
    stats_elem.append(li);
  });
}

function updateDistance(distance) {
  const distanceMeter = pixelToMeter(distance, 0);
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'short' });
  const date = today.getDate();
  // Ex: Today, Aug 26
  const day = `Today, ${month} ${date}`;
  header_elem.html(`
    <div >
      <span id="day">${day}</span>
      <br>
      <span id="distance">${distanceMeter}m</span>
    </div>
  `);
}
