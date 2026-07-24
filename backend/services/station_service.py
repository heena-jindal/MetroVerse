from database.supabase import supabase


def get_all_stations():
    response = (
        supabase
        .table("stations")
        .select("*")
        .execute()
    )

    return response.data


def get_station_by_name(name):
    response = (
        supabase
        .table("stations")
        .select("*")
        .ilike("station_name", f"%{name}%")
        .execute()
    )

    return response.data


def get_station_by_id(station_id):
    response = (
        supabase
        .table("stations")
        .select("*")
        .eq("id", station_id)
        .single()
        .execute()
    )

    return response.data