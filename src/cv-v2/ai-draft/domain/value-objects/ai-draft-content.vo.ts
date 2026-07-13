export interface IAiDraftContentParams {
  name?: string;
  position?: string;
  contacts?: string;
  summary?: string;
  skills?: string[];
}
export class AiDraftContent {
  private props: IAiDraftContentParams;

  constructor(props: IAiDraftContentParams) {
    this.props = { ...props };
  }

  get name() {
    return this.props.name;
  }

  get position() {
    return this.props?.position;
  }

  get summary() {
    return this.props?.summary;
  }

  get skills() {
    return this.props?.skills;
  }
}
