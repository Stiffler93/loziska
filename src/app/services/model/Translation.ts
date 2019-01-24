export class Translation {

  content: object;

  constructor(private name: string, private short: string) {
  }

  public parse(data: object): void {
    this.content = data;
  }
}
