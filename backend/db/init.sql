-- Create a table
CREATE TABLE devices (
    deviceId SERIAL PRIMARY KEY,
    deviceType VARCHAR(255) NOT NULL,
    breakingNewsAlerts BOOLEAN NOT NULL,
    weeklySummaryAlerts BOOLEAN NOT NULL,
    expoPushToken TEXT
);

-- Insert some data
INSERT INTO devices (deviceType, breakingNewsAlerts, weeklySummaryAlerts, weeklySummaryAlerts) VALUES ('Phone', TRUE, FALSE, 'ExpoToken123');

-- Query to list all devices
SELECT * FROM devices;
