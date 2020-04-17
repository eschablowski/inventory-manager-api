import { UUID } from "../base";

export default interface Document {
  /**
   * The unique identifier for this Document.
   *
   * Used to identify a document if all other properties are equal.
   * @category Attributes
   * @unique
   */
  id: UUID;
  /**
   * The name of this Document.
   * @category Attributes
   */
  name: string;
  /**
   * The filename of this Document.
   *
   * Used by templating engines as well as downloads, etc.
   * @category Attributes
   * @unique
   */
  filename: string;
  /**
   * The [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of this Document.
   * @category Attributes
   */
  mime: string;
  /**
   * The version string of this Document.
   *
   * Used to track revisions to Documentation, etc.
   * @category Attributes
   */
  version: string;
  /**
   * The templating engine to be used for this Document.
   * @category Attributes
   */
  template: Templates;
  /**
   * Gets the Data that is stored in this Document.
   * @returns A promise that resolves with the data for this Document.
   * @category Attributes
   * @memory-intensive
   */
  getData(): Promise<Buffer>;
  /**
   * Renders the document with its designated templating engine.
   * @param options The environment to render in, basically the global namespace for the document
   * @returns The rendered document.
   * @category Attributes
   * @memory-intensive
   */
  render(options: any): Promise<Buffer>;
}

/**
 * The available templating engines.
 */
export enum Templates {
  /**
   * Specifies that no templating engine should be used.
   *
   * I.E. Plain text, PDF, whatever.
   */
  NONE,
  /**
   * Specifies that the [nunjucks](https://mozilla.github.io/nunjucks/) templating engine should be used.
   */
  NUNJUCKS
}
