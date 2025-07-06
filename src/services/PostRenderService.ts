export default class PostRenderService {
  renderedPost?: string;

  constructor(private post: string) {}

  renderPost(): string {
    this.renderedPost = this.post;
    this.htmlEncodeGreaterAndLessThan();
    this.parseBoldText();
    this.parseItalicText();
    this.parseNewLines();
    return this.renderedPost;
  }

  private parseBoldText(): void {
    this.renderedPost = this.renderedPost.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  private parseItalicText(): void {
    this.renderedPost = this.renderedPost.replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  private parseNewLines(): void {
    const paragraphs = this.renderedPost.split(/\n{2,}/);

    this.renderedPost = paragraphs.map(paragraph => {
      const formattedParagraph = paragraph.replace(/\n/g, '<br>');
      return `<p>${formattedParagraph}</p>`;
    }).join('');
  }

  private htmlEncodeGreaterAndLessThan(): void {
    this.renderedPost = this.renderedPost.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
