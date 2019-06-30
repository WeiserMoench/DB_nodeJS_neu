
DROP TYPE "U558587"."EDGES_STOPS";
CREATE TYPE "U558587"."EDGES_STOPS" AS TABLE(
    "route" BIGINT CS_FIXED,
    "start_name" VARCHAR(200) CS_STRING,
    "end_name" VARCHAR(200) CS_STRING,
    "line" VARCHAR(10) CS_STRING
);


DROP PROCEDURE "find_shortest_path";
CREATE PROCEDURE "find_shortest_path" (IN start_node_id INT, IN end_node_id INT, OUT edge_name "U558587"."EDGES_STOPS")
 LANGUAGE GRAPH READS SQL DATA AS
  BEGIN
    Graph g = Graph("U558587", "SHORTEST_ROUTES");
    Vertex sourceVertex = Vertex(:g, :start_node_id);
    Vertex targetVertex = Vertex(:g, :end_node_id);
    WeightedPath<BIGINT> p = SHORTEST_PATH(:g, :sourceVertex, :targetVertex);
    edge_name = SELECT :route, :e."start_name",  :e."end_name", :e."line"
    FOREACH e in EDGES(:p) WITH ORDINALITY AS route;
  END;

CALL "U558587"."find_shortest_path"(
	START_NODE_ID => 187,
	END_NODE_ID => 5,
	EDGE_NAME => ?
);


-- ----

DROP TYPE "U558587"."EDGES_STOPS_DIST";
CREATE TYPE "U558587"."EDGES_STOPS_DIST" AS TABLE(
    "route" BIGINT CS_FIXED,
    "start_name" VARCHAR(200) CS_STRING,
    "end_name" VARCHAR(200) CS_STRING,
    "line" VARCHAR(10) CS_STRING,
    "distance" INTEGER
);


DROP PROCEDURE "find_shortest_path_dist";
CREATE PROCEDURE "find_shortest_path_dist" (IN start_node_id INT, IN end_node_id INT, OUT edge_name "U558587"."EDGES_STOPS_DIST", OUT totalDistance INT )
 LANGUAGE GRAPH READS SQL DATA AS
  BEGIN
    Graph g = Graph("U558587", "SHORTEST_ROUTES");
    Vertex sourceVertex = Vertex(:g, :start_node_id);
    Vertex targetVertex = Vertex(:g, :end_node_id);
    WeightedPath<BIGINT> p = SHORTEST_PATH(:g, :sourceVertex, :targetVertex);
    FOREACH e in EDGES(:p) {
    	totalDistance = :totalDistance + :e."distance";
    }
    edge_name = SELECT :route, :e."start_name",  :e."end_name", :e."line", :e."distance"
    FOREACH e in EDGES(:p) WITH ORDINALITY AS route;
  END;

CALL "U558587"."find_shortest_path_dist"(
	START_NODE_ID => 187,
	END_NODE_ID => 5,
	EDGE_NAME => ?,
	totalDistance => ?
);
