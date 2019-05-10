-- Die jeweils aktuellen Daten koennen unter
-- https://daten.berlin.de/datensaetze/vbb-fahrplandaten-gtfs
-- bezogen werden

-- stops.txt von berlin.de
-- alle haltestellen aus Berlin und Brandenburg
Create table Haltestellen_VBB(
	stop_id VarChar(20) not null,
	stop_code VarChar(20) not null,
	stop_name Varchar(200) not null,
	stop_desc VarChar(200),
	stop_lat VarChar(30),
	stop_lon VarChar(30),
	location_type VarChar(2),
	parent_station VarChar(20),
	wheelchair_boarding VarChar(10),
	Coordinate ST_Point(4326),
	Primary Key (stop_id)	
);

Drop table Haltestellen_VBB;

-- agency.txt
-- alle Fahrgastunternehmen aus Berlin und Brandenburg
Create table agency(
	agency_id VarChar(3) not null,
	agency_name VarChar(200) not null,
	agency_url Varchar(200),
	agency_timezone VarChar(30),
	agency_lang VarChar(2),
	agency_phone VarChar(50),
	Primary Key (agency_id)	
);

Drop table agency;

-- trips.txt
-- Namen der Linien
Create table trips(
	route_id VarChar(20) not null,
	service_id VarChar(5) not null,
	trip_id Varchar(20),
	trip_headsign VarChar(100),
	trip_short_name VarChar(50),
	direction_id VarChar(2),
	block_id VarChar(6),
	shape_id VarChar(6),
	wheelchair_accessible VarChar(2),
	bikes_allowed VarChar(2),
	Primary Key (trip_id)	
);

Drop table trips;

-- routes.txt
-- Routen im VBB netz
Create table routes(
	route_id VarChar(20) not null,
	agency_id VarChar(4) not null,
	route_short_name Varchar(10),
	route_long_name VarChar(100),
	route_type VarChar(10),
	route_color VarChar(10),
	route_text_color VarChar(10),
	route_desc VarChar(200),
	Primary Key (route_id)	
);

Drop table routes;