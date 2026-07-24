from flask import Blueprint, request, jsonify
from services.station_service import get_all_stations

station_bp = Blueprint("station", __name__)


@station_bp.route("/api/stations")
def stations():

    q = request.args.get("q", "").lower()

    stations = get_all_stations()

    names = []

    for station in stations:

        name = station["station_name"]

        if q in name.lower():
            names.append(name)

    return jsonify({
        "stations": sorted(names)[:10]
    })