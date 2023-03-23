interface CrewData {
  id: number;
  name: string;
  bounty: number;
  specialMoves: SpecialMove[];
}

interface SpecialMove {
  id: number;
  name: string;
}

export class CrewFacade {
  static async fetch(_id: number): Promise<CrewData> {
    // NOTE: Fetch crew data from a server
    const response = await fetch("http://api:8080");
    const crewData = await response.json();
    return crewData;
  }

  static create(crewData: CrewData) {
    const _requestBody = JSON.stringify(crewData);
    // TODO: Send crew data to a server for creation
  }

  static update(crewData: CrewData) {
    const _requestBody = JSON.stringify(crewData);
    // TODO: Send crew data to a server for update
  }

  static delete(_id: string) {
    // TODO: Send a request to a server for deletion
  }
}
