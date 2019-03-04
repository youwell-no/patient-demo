// Get local datetime object from UTC-datetime string
export const getLocalDate = (dateString) => {
    if (!dateString) {
        return null;
    }

    if (dateString.getDate && !dateString.slice) {
        return dateString; // dateString is actually Date
    }

    const date = dateString.slice(-1).toLowerCase() === 'z' ? new Date(dateString) : new Date(`${dateString}Z`); // Azuming UTC timestring

    if (Number.isNaN(date)) {
        return null;
    }

    return date;
};

export const pad2 = number => (
    number < 10 ? `0${number}` : number
);


// Get date or time-string from UTC-datetime string
export const timestamp = (dateOrString, translate) => {
    const date = getLocalDate(dateOrString);

    if (!date) {
        return null;
    }

    if (date.toDateString() === new Date().toDateString()) {
        if (translate && date.getHours() === 0 && date.getMinutes() === 0) {
            return translate('time.today');
        }
        return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    }
    if (date.getFullYear() === new Date().getFullYear()) {
        if (date.getHours() === 0 && date.getMinutes() === 0) {
            return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`;
        }
        return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)} ${translate ? translate('time.at') : ''} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    }
    if (date.getHours() === 0 && date.getMinutes() === 0) {
        return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;
    }
    return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}-${date.getFullYear()} ${translate ? translate('time.at') : ''} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

export const datestamp = (dateOrString) => {
    const date = getLocalDate(dateOrString);

    if (!date) {
        return null;
    }

    return date.toLocaleDateString();
};

export const mondayZeroIndex = n => (((n - 1) % 7) + 7) % 7;

export const getTimeStringFromDayOfWeek = (day) => {
    const a = new Date();
    const dayOffset = (a.getDay() - day) * 1000 * 60 * 60 * 24 * -1;
    const d = new Date(a.getTime() + dayOffset);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d.toISOString();
};

export const dateWithOptionalTime = (dateOrString) => {
    const date = getLocalDate(dateOrString);

    if (!date) {
        return null;
    }

    if (date.getHours() === 0 && date.getMinutes() === 0) {
        return date.toLocaleDateString();
    }
    return date.toLocaleString().slice(0, -3);
};

// returns string to set in input type=date
export const getTextfieldDateString = (dateOrString) => {
    const d = dateOrString ? getLocalDate(dateOrString) : new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

// returns string to set in input type=datetime-local
export const getTextfieldDateTimeString = (date) => {
    const d = date && date.length === 10 ? new Date(`${date}T00:00`) : new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

// returns string to save in database
export const getDateTimeSaveString = (date) => {
    let d;
    if (!date) {
        return null;
    }

    if (date.length === 10) {
        d = new Date(`${date}T00:00`);
    } else {
        d = new Date(date);
    }
    return d.toISOString();
};

export const getWeekNumber = (dateString) => {
    const date = getLocalDate(dateString);

    const d = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) : new Date();
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return weekNo;
};

export const today = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

export const isToday = (dateString) => {
    const date = getLocalDate(dateString);

    if (!date) {
        return false;
    }

    return new Date().toLocaleDateString() === date.toLocaleDateString();
};

export const msInOneWeek = 1000 * 60 * 60 * 24 * 7;
export const msInOneDay = 1000 * 60 * 60 * 24;

export const getNumberOfWeeks = (startTime, endTime) => {
    if (!startTime || !endTime) {
        return 0;
    }

    return Math.floor(Math.abs(new Date(startTime) - new Date(endTime)) / msInOneWeek) || 0;
};

export const getNumberOfDays = (startTime, endTime) => {
    if (!startTime || !endTime) {
        return 0;
    }

    return Math.floor(Math.abs(new Date(startTime) - new Date(endTime)) / msInOneDay);
};

export const getWeekStartDate = (weekNumber) => {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);

    const d = new Date(yearStart.getTime() + ((weekNumber - 1) * msInOneWeek));

    // set to monday
    d.setDate(d.getDate() + 1 - (d.getDay() || 7));

    return d;
};

export const getNumberOfSeconds = (startTime, endTime) => {
    if (!startTime || !endTime) {
        return 0;
    }

    return Math.floor(Math.abs(new Date(startTime) - new Date(endTime)) / 1000);
};
