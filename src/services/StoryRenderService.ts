export default class StoryRenderService {
  renderedStory?: string;

  constructor(private story: string) {}

  renderStory(): string {
    this.renderedStory = this.story;
    this.htmlEncodeGreaterAndLessThan();
    this.parseBoldText();
    this.parseItalicText();
    this.parseNewLines();
    return this.renderedStory;
  }

  private parseBoldText(): void {
    this.renderedStory = this.renderedStory.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  private parseItalicText(): void {
    this.renderedStory = this.renderedStory.replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  private parseNewLines(): void {
    const paragraphs = this.renderedStory.split(/\n{2,}/);

    this.renderedStory = paragraphs.map(paragraph => {
      const formattedParagraph = paragraph.replace(/\n/g, '<br>');
      return `<p>${formattedParagraph}</p>`;
    }).join('');
  }

  private htmlEncodeGreaterAndLessThan(): void {
    this.renderedStory = this.renderedStory.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
