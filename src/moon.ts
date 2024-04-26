export function calculateMoonPhase(date: Date): string {
  // Calculate the number of days since the last known new moon (January 6, 2000)
  const daysSinceNewMoon = Math.floor((date.getTime() - new Date("January 6, 2000").getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate the number of synodic months since the last known new moon
  const synodicMonths = daysSinceNewMoon / 29.53058867;
  
  // Calculate the phase of the moon based on the fractional part of the synodic months
  const phase = (synodicMonths % 1) * 100;
  
  // Determine the moon phase based on the phase value
  if (phase < 3.5 || phase >= 96.5) {
    return "New Moon";
  } else if (phase < 10.5) {
    return "Waxing Crescent";
  } else if (phase < 17.5) {
    return "First Quarter";
  } else if (phase < 24.5) {
    return "Waxing Gibbous";
  } else if (phase < 31.5) {
    return "Full Moon";
  } else if (phase < 38.5) {
    return "Waning Gibbous";
  } else if (phase < 45.5) {
    return "Last Quarter";
  } else if (phase < 52.5) {
    return "Waning Crescent";
  } else {
    return "New Moon";
  }
}