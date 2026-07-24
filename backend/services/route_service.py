from database.supabase import supabase

from services.station_service import (
    get_station_by_name,
    get_station_by_id
)

from algorithms.dijkstra import dijkstra


def load_graph():

    response = (
        supabase
        .table("station_connections")
        .select("*")
        .execute()
    )

    graph = {}

    for edge in response.data:

        source = edge["from_station"]
        destination = edge["to_station"]

        if source not in graph:
            graph[source] = []

        graph[source].append({

            "station": destination,

            "distance": float(edge["distance_km"]),

            "time": edge["travel_time_minutes"],

            "fare": float(edge["fare"])

        })

    return graph


graph = load_graph()


def find_route(from_station, to_station):

    start = get_station_by_name(from_station)

    end = get_station_by_name(to_station)

    if not start:
        return {"error": "Source station not found"}

    if not end:
        return {"error": "Destination station not found"}

    start_id = start[0]["id"]
    end_id = end[0]["id"]

    result = dijkstra(
        graph,
        start_id,
        end_id
    )

    if result is None:
        return {"error": "No route found"}

    station_names = []

    for station_id in result["path"]:

        station = get_station_by_id(station_id)

        station_names.append(
            station["station_name"]
        )

    return {

        "from": from_station,

        "to": to_station,

        "stations": station_names,

        "distance": round(
            result["distance"],
            2
        )
    }