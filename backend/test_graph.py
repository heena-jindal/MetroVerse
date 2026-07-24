from services.route_service import load_graph

graph = load_graph()

print("Stations in Graph:", len(graph))

for node in list(graph.keys())[:5]:
    print(node)
    print(graph[node])
    print("-" * 40)