select stop_name, stop_id, stop_lat, stop_lon 
from haltestellen_vbb where stop_name LIKE '%erlin%' and stop_name LIKE 'S%' or stop_name like '%erlin%' and stop_name LIKE 'U%';

