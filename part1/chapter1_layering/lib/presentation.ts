import { Crew, Domain } from './domain.ts';

export class Presentation {
  domain: Domain;

  constructor(domain: Domain) {
    this.domain = domain;
  }

  async render(): Promise<string> {
    const crews = await this.domain.crews();

    const content = crews
      .map((crew: Crew) => {
        return `<li>${crew.name}${crew.isCaptain() ? ' (C)' : ''}</li>`
      })
      .join('');

    return `<html>
  <title>Layering</title>
  <body>
    <ul>
      ${content}
    </ul>
  </body>
</html>`;
  }
}
