

--Viktor

DROP PROCEDURE "find_shortest_path";

CREATE PROCEDURE "find_shortest_path" (IN start_node_id INT, IN end_node_id INT, OUT edge_name "U558587"."EDGES_STOPS")
 LANGUAGE GRAPH READS SQL DATA AS
  BEGIN
    Graph g = Graph("U558587", "SHORTEST_ROUTES");
    Vertex sourceVertex = Vertex(:g, :start_node_id);
    Vertex targetVertex = Vertex(:g, :end_node_id);
    WeightedPath<BIGINT> p = SHORTEST_PATH(:g, :sourceVertex, :targetVertex);
    edge_name = SELECT :route, :e."start",  :e."end", :e."line"
    FOREACH e in EDGES(:p) WITH ORDINALITY AS route;
  END;

--Je nachdem was für eine Ausgabe ihr gerne hättet, müsstet ihr einen Type anlegen:

CREATE TYPE "U558587"."EDGES_STOPS" AS TABLE(
    "route" BIGINT CS_FIXED,
    "start" INT,
    "end" INT,
    "line" VARCHAR(10) CS_STRING
);

DROP TYPE "U558587"."EDGES_STOPS";

CALL "U558587"."find_shortest_path"(
	START_NODE_ID => /*<INTEGER>*/,
	END_NODE_ID => /*<INTEGER>*/,
	EDGE_NAME => ?
);