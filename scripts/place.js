const temp = 15;
const windSpeed = 5;
let windChill;

function calcWindChil(temp, windSpeed) {
    return 13.12+ 0.6215 * temp - 11.37 * (windSpeed ** 0.16) + 0.3965 * temp * (windSpeed ** 0.16);
}

if (temp <= 10 && windSpeed > 4.8) {
    windChill = calcWindChil(temp, windSpeed).toFixed(1);
} else {
    windChill = "N/A"
}

if (windChill === "N/A") {
    document.getElementById("wind-chill").textContent = windChill;
} else {
    document.getElementById("wind-chill").textContent = windChill + " °C";
}