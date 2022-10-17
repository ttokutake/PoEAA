import { Crew, Domain } from './domain.ts';

export class Presentation {
  constructor(private domain: Domain){}

  async render(): Promise<string> {
    const crews = await this.domain.crews();

    const content = crews
      .map((crew: Crew) => {
        return `<li>${crew.name}${crew.isDanger() ? ' (Danger)' : ''}</li>`
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
