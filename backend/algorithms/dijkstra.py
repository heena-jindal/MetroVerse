import heapq


def dijkstra(graph, start, end):
    """
    Find the shortest path between two stations using Dijkstra's algorithm.
    """

    priority_queue = [(0, start)]
    distances = {start: 0}
    previous = {}

    while priority_queue:

        current_distance, current_node = heapq.heappop(priority_queue)

        if current_node == end:
            break

        if current_distance > distances[current_node]:
            continue

        for neighbor in graph.get(current_node, []):

            next_node = neighbor["station"]
            weight = neighbor["distance"]

            new_distance = current_distance + weight

            if (
                next_node not in distances
                or new_distance < distances[next_node]
            ):

                distances[next_node] = new_distance
                previous[next_node] = current_node

                heapq.heappush(
                    priority_queue,
                    (new_distance, next_node)
                )

    if end not in distances:
        return None

    path = []
    node = end

    while node != start:
        path.append(node)
        node = previous[node]

    path.append(start)
    path.reverse()

    return {
        "distance": distances[end],
        "path": path
    }