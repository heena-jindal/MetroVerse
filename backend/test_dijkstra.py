from services.route_service import load_graph
from algorithms.dijkstra import dijkstra

graph = load_graph()

nodes = list(graph.keys())

start = nodes[0]
end = nodes[10]

result = dijkstra(graph, start, end)

print(result)