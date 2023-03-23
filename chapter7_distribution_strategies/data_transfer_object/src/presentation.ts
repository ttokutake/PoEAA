import { Crew } from "./domain.ts";
import { CrewDto } from "./data_transfer_object.ts";

export class Presentation {
  static handler(_request: Request): Response {
    const crew = Crew.fetch(1);
    const crewDto = CrewDto.fromDomainModel(crew);

    return new Response(JSON.stringify(crewDto), {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}
