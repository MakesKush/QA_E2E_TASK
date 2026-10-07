import { BasePage } from './base-page';

export class EmailConfirmationPage extends BasePage {
  readonly welcomeMessage = this.page.getByRole('heading', {
    name: 'Welcome to the world’s most advanced negotiation sim',
    exact: true,
  });
  readonly sentMessage = this.page.getByText('A confirmation email has been sent to', { exact: false });
}
