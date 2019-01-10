
export class Product {

  name: string;
  icon: string;
  text: string;
  columnDefs: object[] = undefined;
  gridData: object[] = undefined;

  parameters: string[] = [];

  constructor(name: string, icon: string, text: string, parameters: string[] = []) {
    this.name = name;
    this.icon = icon;
    this.text = text;
    this.parameters = parameters;
  }

}
