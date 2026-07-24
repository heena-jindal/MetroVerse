from fastapi import APIRouter

from services.route_service import find_route

router = APIRouter()


@router.get("/route")
def route(from_station: str, to_station: str):

    result = find_route(
        from_station,
        to_station
    )

    return result