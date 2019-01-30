import {Language} from '../../language/model/Language';

export class Translation {

  content: object;

  constructor(public language: Language) {
  }

  public parse(data: object): void {
    this.content = data;
  }
}
