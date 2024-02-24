-- Create a table
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    deviceType VARCHAR(255) NOT NULL,
    breakingNewsAlerts BOOLEAN NOT NULL,
    weeklySummaryAlerts BOOLEAN NOT NULL,
    expoPushToken TEXT
);

-- Insert some data
INSERT INTO devices (deviceType, breakingNewsAlerts, weeklySummaryAlerts, weeklySummaryAlerts) VALUES ('Phone', TRUE, FALSE, 'ExpoToken125');

-- Query to list all devices
SELECT * FROM devices;
