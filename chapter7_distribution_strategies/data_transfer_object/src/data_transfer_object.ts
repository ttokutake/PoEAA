import { Crew, SpecialMove } from "./domain.ts";

export class CrewDto {
  private constructor(
    public id: number,
    public name: string,
    public bounty: number,
    public specialMoves: SpecialMoveDto[],
  ) {}

  static fromDomainModel(crew: Crew) {
    const specialMoveDtos = crew.specialMoves.map((s) =>
      SpecialMoveDto.fromDomainModel(s)
    );
    return new CrewDto(
      crew.id,
      crew.name,
      crew.bounty,
      specialMoveDtos,
    );
  }
}

export class SpecialMoveDto {
  private constructor(
    public id: number,
    public name: string,
  ) {}

  static fromDomainModel(specialMove: SpecialMove) {
    return new SpecialMoveDto(specialMove.id, specialMove.name);
  }
}
