-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('user','driver','admin')) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DRIVERS
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(50),
  phone VARCHAR(20)
);

-- ROUTES
CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  route_name VARCHAR(100),
  start_point VARCHAR(100),
  end_point VARCHAR(100)
);

-- STOPS
CREATE TABLE stops (
  id SERIAL PRIMARY KEY,
  stop_name VARCHAR(100),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6)
);

-- BUSES
CREATE TABLE buses (
  id SERIAL PRIMARY KEY,
  bus_number VARCHAR(50),
  route_id INT REFERENCES routes(id),
  driver_id INT REFERENCES drivers(id)
);

-- BUS-STOPS (Many to Many)
CREATE TABLE bus_stops (
  id SERIAL PRIMARY KEY,
  bus_id INT REFERENCES buses(id),
  stop_id INT REFERENCES stops(id),
  stop_order INT
);

-- LIVE LOCATIONS
CREATE TABLE live_locations (
  id SERIAL PRIMARY KEY,
  bus_id INT REFERENCES buses(id),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  speed DECIMAL(6,2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
