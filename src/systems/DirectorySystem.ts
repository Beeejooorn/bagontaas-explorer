import { BAGONTAAS_BUILDINGS, BuildingData } from '../data/buildings';

export class DirectorySystem {
  private visited = new Set<string>();

  markVisited(buildingId: string): boolean {
    const isNew = !this.visited.has(buildingId);
    this.visited.add(buildingId);
    return isNew;
  }

  isVisited(buildingId: string): boolean {
    return this.visited.has(buildingId);
  }

  getVisitedCount(): number {
    return this.visited.size;
  }

  getTotalCount(): number {
    return BAGONTAAS_BUILDINGS.length;
  }

  getAllBuildings(): BuildingData[] {
    return BAGONTAAS_BUILDINGS;
  }
}
