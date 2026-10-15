The finished weather dashboard will have these features:

Search: A text input and search button. The user types a city name (e.g., "Nairobi", "Mombasa", "London") and clicks Search or presses Enter.

Current Weather Display: Shows the city name, current temperature in Celsius, weather description (e.g., "scattered clouds"), humidity percentage, and wind speed.

Weather Icon: A visual icon representing the current conditions (sunny, cloudy, rainy, etc.), provided by OpenWeatherMap's icon set.

5-Day Forecast: A row of five cards, each showing the day of the week, a weather icon, the high temperature, and the low temperature.

Loading State: While waiting for the API response, the dashboard shows a loading indicator (text or spinner). The search button is disabled to prevent duplicate requests.

Error Handling: If the user types an invalid city name, the dashboard shows a clear error message like "City not found. Please check the spelling and try again." If the network fails, it shows "Unable to connect. Check your internet connection."

Search History: The last 5 searched cities are saved in localStorage and displayed as clickable buttons below the search bar. Clicking a history button searches that city again.

Responsive Design: The dashboard looks good on both desktop (wide layout) and mobile (stacked layout).

Deployed: The project is live on GitHub Pages with a clean commit history.