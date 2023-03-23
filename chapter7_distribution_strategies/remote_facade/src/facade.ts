interface CrewData {
  id: number;
  name: string;
  bounty: number;
}

export class CrewFacade {
  static fetch(_id: number): CrewData {
    // NOTE: Fetch crew data from a server
    const responseBody = '{"id":1,"name":"Luffy","bounty":1500000000}';
    return JSON.parse(responseBody);
  }

  static create(crewData: CrewData) {
    const _requestBody = JSON.stringify(crewData);
    // NOTE: Send crew data to a server for creation
  }

  static update(crewData: CrewData) {
    const _requestBody = JSON.stringify(crewData);
    // NOTE: Send crew data to a server for update
  }

  static delete(_id: string) {
    // NOTE: Send a request to a server for deletion
  }
}
