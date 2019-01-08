
export class Product {

  name: String;
  icon: String;
  text: String;

  parameters: String[];

  constructor(name: String, icon: String, text: String, parameters: String[] = []) {
    this.name = name;
    this.icon = icon;
    this.text = text;
    this.parameters = parameters;
  }

}
