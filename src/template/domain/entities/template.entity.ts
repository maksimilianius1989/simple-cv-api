import { TemplateCategory } from '../enums/template-category.enum';

export interface ITemplate {
  id: string;
  ownerId?: string;
  name: string;
  body: string;
  category: TemplateCategory;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Template {
  private readonly props: ITemplate;

  constructor(props: ITemplate) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id(): string {
    return this.props.id;
  }

  get ownerId(): string | undefined {
    return this.props.ownerId;
  }

  get name(): string {
    return this.props.name;
  }

  get body(): string {
    return this.props.body;
  }

  get category(): TemplateCategory {
    return this.props.category;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
