export const getFlights = (date, employeeId, flights) => {
    if (!flights.hasOwnProperty(date)) {
        return [];
    }

    const dateWiseFlights = flights[date];

    if (!dateWiseFlights.hasOwnProperty(employeeId)) {
        return [];
    }

    return dateWiseFlights[employeeId];
}

export const getEmployees = (date, flightId, employees) => {
    return employees?.[date]?.[flightId] || [];
}